"use client";

import { useEffect, useState } from "react";
import type { River } from "@/data/rivers/types";
import {
  Item,
  ItemGroup,
  ItemActions,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item";
import {
  getAccesses,
  planDays,
  selectedPath,
  type Selection,
} from "@/lib/itinerary";
import {
  destination,
  type FilterKind,
  type Filters,
  type View,
} from "@/lib/view";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CornerRightDown } from "lucide-react";
import HomeAddressDialog from "@/components/HomeAddressDialog";
import Rows from "@/components/Rows";
import DaySummary from "@/components/DaySummary";
import { getTrips, type Trip } from "@/lib/directions";

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
      <Item className="pr-1">
        <ItemContent>
          <ItemDescription className="text-level-neutral-text text-right text-xl">
            Coche tes dodos
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <CornerRightDown className="text-level-neutral-text" />
        </ItemActions>
      </Item>
      <Rows itinerary={river} prefix="" onPath view={view} />
      {view.plan.last ? <DaySummary day={view.plan.last} /> : null}
    </ItemGroup>
  );
}
