"use client";

import type { Km } from "@/data/rivers/types";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { isFork, isStop, type Feature } from "@/lib/itinerary";
import { destination, type FilterKind, type View } from "@/lib/view";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Directions from "@/components/Directions";
import TripSummary from "@/components/TripSummary";
import FeatureLine from "@/components/FeatureLine";
import ForkView from "@/components/ForkView";

export default function FeatureRow({
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
          <ItemActions className="2xs:ml-auto 2xs:flex-row 2xs:w-auto w-full flex-col">
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
                  className="size-5 cursor-pointer"
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
