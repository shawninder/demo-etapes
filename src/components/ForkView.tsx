"use client";

import type { Fork, Itinerary } from "@/data/rivers/types";
import { Item, ItemDescription, ItemTitle } from "@/components/ui/item";
import { buildRows, isFork, routePrefix, selectedRoute } from "@/lib/itinerary";
import type { Filters, View } from "@/lib/view";
import { cn } from "@/lib/utils";
import Rows from "@/components/Rows";

function isVisible(itinerary: Itinerary, filters: Filters): boolean {
  return buildRows(itinerary).some(({ features }) =>
    features.some((feature) =>
      isFork(feature)
        ? feature.routes.some((route) => isVisible(route, filters))
        : filters[feature.kind],
    ),
  );
}

export default function ForkView({
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
      className={cn("my-1 flex flex-col")}
    >
      <Item className="3xs:flex-row flex-col gap-2 py-1 pl-1">
        <span className="text-muted-foreground inline-block font-mono text-xs">
          km {fork.km.toFixed(1)}
        </span>
        <ItemTitle className="font-semibold">
          {fork.name ?? "Choisis ta ligne"}
        </ItemTitle>
        {fork.notes ? <ItemDescription>{fork.notes}</ItemDescription> : null}
      </Item>
      {fork.routes.map((route, i) => (
        <div
          key={i}
          className={cn(
            "border-l-4",
            onPath && i === selected
              ? "border-level-neutral-border"
              : "border-background-alt",
          )}
        >
          <label className="hover:bg-muted flex cursor-pointer items-center gap-2 px-4 py-1 text-xs">
            <input
              type="radio"
              name={`fork:${forkKey}`}
              checked={i === selected}
              onChange={() => view.onSelect(forkKey, i)}
              className="accent-level-neutral size-3 cursor-pointer"
            />
            <span className="font-medium">{route.name}</span>
            {route.notes ? (
              <span className="text-muted-foreground">{route.notes}</span>
            ) : null}
          </label>
          <div className="pl-2">
            <Rows
              itinerary={route}
              prefix={routePrefix(forkKey, i)}
              onPath={onPath && i === selected}
              view={view}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
