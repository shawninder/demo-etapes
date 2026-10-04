"use client";

import { Fragment, useEffect, useState } from "react";
import type { Fork, Itinerary, Km, River } from "@/data/rivers/types";
import {
  Item,
  ItemGroup,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemSeparator,
} from "@/components/ui/item";
import {
  getDistanceLevelClassName,
  getFeatureLevelClassName,
} from "@/lib/featureLevel";
import {
  formatLength,
  getFeatureLabel,
  getFeatureName,
  isWhitewater,
} from "@/lib/featureLabel";
import {
  buildRows,
  getAccesses,
  isFork,
  isStop,
  planDays,
  routePrefix,
  rowKey,
  selectedPath,
  selectedRoute,
  type Day,
  type Feature,
  type FeatureKind,
  type Plan,
  type Row,
  type Selection,
  type StopPlan,
} from "@/lib/itinerary";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CornerRightDown } from "lucide-react";
import Directions from "@/components/Directions";
import HomeAddressDialog from "@/components/HomeAddressDialog";
import TripSummary from "@/components/TripSummary";
import { getTrips, type Trip } from "@/lib/directions";

type FilterKind = Exclude<FeatureKind, "fork">;
type Filters = Record<FilterKind, boolean>;

const filterKinds: { kind: FilterKind; icon: string; title: string }[] = [
  { kind: "access", icon: "🚙", title: "Accès routiers" },
  { kind: "campsite", icon: "🏕", title: "Campings" },
  { kind: "section", icon: "🌊", title: "Rapides, seuils et lacs" },
  { kind: "portage", icon: "P", title: "Portages" },
  { kind: "pointOfInterest", icon: "📍", title: "Points d'intérêt" },
];

const defaultFilters: Filters = {
  access: true,
  campsite: true,
  section: true,
  portage: true,
  pointOfInterest: true,
};

type View = {
  checked: Record<string, boolean>;
  onCheck: (key: string, checked: boolean) => void;
  selection: Selection;
  onSelect: (forkKey: string, route: number) => void;
  filters: Filters;
  plan: Plan;
  homeAddress: string;
  trips: Record<string, Trip>;
  openDirections: () => void;
};

function destination({ lat, lon }: { lat: number; lon: number }) {
  return `${lat},${lon}`;
}

export default function RiverView({ river }: { river: River }) {
  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [selection, setSelection] = useState<Selection>({});
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [homeAddress, setHomeAddress] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trips, setTrips] = useState<Record<string, Trip>>({});

  const checkedStorageKey = `checked:${river.slug}`;
  const selectionStorageKey = `routes:${river.slug}`;

  useEffect(() => {
    const storedChecked = localStorage.getItem(checkedStorageKey);
    if (storedChecked) setChecked(JSON.parse(storedChecked));
    const storedSelection = localStorage.getItem(selectionStorageKey);
    if (storedSelection) setSelection(JSON.parse(storedSelection));
    setHomeAddress(localStorage.getItem("homeAddress") ?? "");
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(checkedStorageKey, JSON.stringify(checked));
  }, [checked, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(selectionStorageKey, JSON.stringify(selection));
  }, [selection, hydrated]);

  const destinations = [
    ...new Set(
      getAccesses(river).map(({ coordinates }) => destination(coordinates)),
    ),
  ];

  useEffect(() => {
    if (!hydrated || !homeAddress) return;
    let cancelled = false;
    getTrips(homeAddress, destinations).then(
      (result) => !cancelled && setTrips(result),
      console.error,
    );
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  async function saveHomeAddress(address: string) {
    localStorage.setItem("homeAddress", address);
    setHomeAddress(address);
    setTrips(await getTrips(address, destinations));
    setDialogOpen(false);
  }

  function toggleFilter(kind: FilterKind) {
    setFilters((prev) => ({ ...prev, [kind]: !prev[kind] }));
  }

  const view: View = {
    checked,
    onCheck: (key, value) => setChecked((prev) => ({ ...prev, [key]: value })),
    selection,
    onSelect: (forkKey, route) =>
      setSelection((prev) => ({ ...prev, [forkKey]: route })),
    filters,
    plan: planDays(selectedPath(river, selection), checked),
    homeAddress,
    trips,
    openDirections: () => setDialogOpen(true),
  };

  return (
    <ItemGroup className="feature-list w-full max-w-2xl gap-0 self-center">
      <HomeAddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        homeAddress={homeAddress}
        onSave={saveHomeAddress}
      />
      <Item className="my-4 justify-end py-0.5">
        <ItemActions className="flex-wrap justify-end">
          {filterKinds.map(({ kind, icon, title }) => (
            <Button
              key={kind}
              variant={filters[kind] ? "secondary" : "ghost"}
              size="icon"
              aria-pressed={filters[kind]}
              aria-label={title}
              title={title}
              onClick={() => toggleFilter(kind)}
              className={cn("cursor-pointer", !filters[kind] && "opacity-40")}
            >
              {icon}
            </Button>
          ))}
        </ItemActions>
      </Item>
      <Item>
        <ItemContent>
          <ItemDescription className="text-level-neutral-text text-right text-xl">
            Coche tes dodos
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <CornerRightDown className="text-level-neutral-text mr-1" />
        </ItemActions>
      </Item>
      <Rows itinerary={river} prefix="" onPath view={view} />
      {view.plan.last ? <DaySummary day={view.plan.last} /> : null}
    </ItemGroup>
  );
}

function Rows({
  itinerary,
  prefix,
  onPath,
  view,
}: {
  itinerary: Itinerary;
  prefix: string;
  onPath: boolean;
  view: View;
}) {
  return buildRows(itinerary).map((row) => (
    <RowView
      key={row.km}
      row={row}
      rowKey={rowKey(prefix, row.km)}
      onPath={onPath}
      view={view}
    />
  ));
}

function RowView({
  row,
  rowKey,
  onPath,
  view,
}: {
  row: Row;
  rowKey: string;
  onPath: boolean;
  view: View;
}) {
  const stopPlan = onPath ? view.plan.stops.get(rowKey) : undefined;
  if (!stopPlan) {
    return (
      <FeatureRow
        km={row.km}
        features={row.features}
        rowKey={rowKey}
        onPath={onPath}
        view={view}
      />
    );
  }

  // The day ends at the stop, before whatever starts at the same km.
  const stops = row.features.filter(
    (f) => isStop(f) || f.kind === "pointOfInterest",
  );
  const rest = row.features.filter(
    (f) => !isStop(f) && f.kind !== "pointOfInterest",
  );
  return (
    <>
      <FeatureRow
        km={row.km}
        features={stops}
        rowKey={rowKey}
        onPath={onPath}
        view={view}
      />
      <DayBreak stopPlan={stopPlan} />
      <FeatureRow
        km={row.km}
        features={rest}
        rowKey={rowKey}
        onPath={onPath}
        view={view}
      />
    </>
  );
}

function isVisible(itinerary: Itinerary, filters: Filters): boolean {
  return buildRows(itinerary).some(({ features }) =>
    features.some((feature) =>
      isFork(feature)
        ? feature.routes.some((route) => isVisible(route, filters))
        : filters[feature.kind],
    ),
  );
}

function FeatureRow({
  km,
  features,
  rowKey,
  onPath,
  view,
}: {
  km: Km;
  features: Feature[];
  rowKey: string;
  onPath: boolean;
  view: View;
}) {
  const fork = features.find(isFork);
  const lines = features.filter((f) => !isFork(f));
  const checked = !!view.checked[rowKey];
  const shown = lines.filter(
    (f) => view.filters[f.kind as FilterKind] || (checked && isStop(f)),
  );
  const hidden = shown.length === 0;
  const displayed = hidden ? lines : shown;
  const accesses = displayed.filter((f) => f.kind === "access");
  const isStopRow = displayed.some(isStop);

  return (
    <>
      {lines.length > 0 ? (
        <Item
          variant="outline"
          className={cn(
            "hover:bg-muted bg-accent/50 2xs:flex-row flex-col items-start rounded-none pr-0 pl-1 transition-[opacity,max-height] duration-600",
            hidden
              ? "max-h-0 overflow-hidden border-0 py-0 opacity-0"
              : "2xs:py-0.5 max-h-96 border py-2 opacity-100",
            !onPath && "opacity-50",
          )}
        >
          <ItemContent
            className={cn(
              "transition-max-height 3xs:flex-row flex w-full flex-col gap-2",
              hidden ? "max-h-0 overflow-hidden" : "max-h-96",
            )}
          >
            <span className="text-muted-foreground inline-block font-mono text-xs">
              km&nbsp;{km.toFixed(1)}
            </span>
            <div className="flex flex-col flex-wrap gap-1">
              {displayed.map((feature, i) => (
                <FeatureLine key={i} feature={feature} />
              ))}
            </div>
          </ItemContent>
          <ItemActions className="2xs:ml-auto 2xs:flex-row flex-col">
            {accesses.map(({ coordinates }) => {
              const trip = view.trips[destination(coordinates)];
              return trip && view.homeAddress ? (
                <TripSummary
                  key={destination(coordinates)}
                  trip={trip}
                  from={view.homeAddress}
                  to={coordinates}
                />
              ) : null;
            })}
            {accesses.length > 0 ? (
              <Directions onClick={view.openDirections} />
            ) : null}
            {isStopRow ? (
              <label className="2xs:justify-end flex items-center">
                <Input
                  type="checkbox"
                  checked={checked}
                  disabled={!onPath}
                  onChange={(event) =>
                    view.onCheck(rowKey, event.target.checked)
                  }
                  className="size-6 cursor-pointer"
                />
              </label>
            ) : null}
          </ItemActions>
        </Item>
      ) : null}
      {fork ? (
        <ForkView fork={fork} forkKey={rowKey} onPath={onPath} view={view} />
      ) : null}
    </>
  );
}

function FeatureLine({ feature }: { feature: Feature }) {
  const label = getFeatureLabel(feature);
  const name = getFeatureName(feature);
  const length =
    (feature.kind === "section" || feature.kind === "portage") &&
    feature.length !== undefined
      ? formatLength(feature.length)
      : undefined;
  const details = [length, feature.notes].filter(Boolean).join("; ");

  return (
    <div className="flex flex-row gap-2">
      {label || name ? (
        <ItemTitle>
          {isWhitewater(feature) ? "🌊 " : null}
          {[label, name].filter(Boolean).join(" ")}
        </ItemTitle>
      ) : null}
      {details ? (
        <ItemDescription className="text-foreground">{details}</ItemDescription>
      ) : null}
    </div>
  );
}

function ForkView({
  fork,
  forkKey,
  onPath,
  view,
}: {
  fork: Fork;
  forkKey: string;
  onPath: boolean;
  view: View;
}) {
  if (!fork.routes.some((route) => isVisible(route, view.filters))) {
    return null;
  }
  const selected = selectedRoute(view.selection, forkKey, fork);

  return (
    <div
      role="radiogroup"
      aria-label={fork.name ?? "Choisis ta ligne"}
      className={cn(
        "border-level-neutral-border my-1 flex flex-col border-l-4",
        !onPath && "opacity-50",
      )}
    >
      <Item className="3xs:flex-row flex-col gap-2 py-1">
        <span className="text-muted-foreground inline-block font-mono text-xs">
          km {fork.km.toFixed(1)}
        </span>
        <ItemTitle>{fork.name ?? "Choisis ta ligne"}</ItemTitle>
        {fork.notes ? <ItemDescription>{fork.notes}</ItemDescription> : null}
      </Item>
      {fork.routes.map((route, i) => (
        <Fragment key={i}>
          <label className="hover:bg-muted flex cursor-pointer items-center gap-2 px-4 py-1 text-sm">
            <input
              type="radio"
              name={`fork:${forkKey}`}
              checked={i === selected}
              onChange={() => view.onSelect(forkKey, i)}
              className="accent-level-neutral size-4"
            />
            <span className="font-medium">{route.name}</span>
            {route.notes ? (
              <span className="text-muted-foreground">{route.notes}</span>
            ) : null}
          </label>
          <div className={cn("pl-2", i !== selected && "opacity-50")}>
            <Rows
              itinerary={route}
              prefix={routePrefix(forkKey, i)}
              onPath={onPath && i === selected}
              view={view}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function DayBreak({ stopPlan }: { stopPlan: StopPlan }) {
  return (
    <>
      {stopPlan.ended ? <DaySummary day={stopPlan.ended} /> : null}
      {stopPlan.next ? (
        <>
          <ItemSeparator className="bg-level-neutral-border" />
          <Item className="justify-center text-lg font-bold">
            Jour {stopPlan.next}
          </Item>
        </>
      ) : null}
    </>
  );
}

function DaySummary({ day }: { day: Day }) {
  return (
    <Item>
      <ItemContent className="items-center">
        <ItemTitle className="flex flex-col 2xl:flex-row">
          <span>totalisant</span>
          <span
            className={cn("text-lg", getDistanceLevelClassName(day.distance))}
          >
            {day.distance} km
          </span>
          {day.tallies.length > 0 && <span>avec</span>}
        </ItemTitle>
        {day.tallies.length > 0 && (
          <ItemGroup className="flex-row flex-wrap justify-center">
            {day.tallies.map(({ label, level, count }) => (
              <Item
                key={label}
                className="flex w-fit flex-row items-center gap-2"
              >
                <ItemTitle>
                  <span className="font-bold">{count}</span> ⨉{" "}
                  <span
                    className={cn(
                      "3xs:text-lg border-accent inline-block rounded border p-2 text-sm",
                      getFeatureLevelClassName(level),
                    )}
                  >
                    {label}
                  </span>
                </ItemTitle>
              </Item>
            ))}
          </ItemGroup>
        )}
      </ItemContent>
    </Item>
  );
}
