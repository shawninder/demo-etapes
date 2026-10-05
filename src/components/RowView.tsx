"use client";

import { isStop, type Row } from "@/lib/itinerary";
import type { View } from "@/lib/view";
import FeatureRow from "@/components/FeatureRow";
import DayBreak from "@/components/DayBreak";

export default function RowView({
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
