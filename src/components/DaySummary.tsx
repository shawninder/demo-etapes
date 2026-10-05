"use client";

import { Item, ItemGroup, ItemContent, ItemTitle } from "@/components/ui/item";
import FeatureLabel from "@/components/FeatureLabel";
import {
  getDistanceLevelClassName,
  getFeatureLevelClassName,
} from "@/lib/featureLevel";
import type { Day } from "@/lib/itinerary";
import { cn } from "@/lib/utils";

export default function DaySummary({ day }: { day: Day }) {
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
                    <FeatureLabel label={label} />
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
