"use client";

import { Item, ItemSeparator } from "@/components/ui/item";
import type { StopPlan } from "@/lib/itinerary";
import DaySummary from "@/components/DaySummary";

export default function DayBreak({ stopPlan }: { stopPlan: StopPlan }) {
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
