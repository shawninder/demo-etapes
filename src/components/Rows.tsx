"use client";

import type { Itinerary } from "@/data/rivers/types";
import { buildRows, rowKey } from "@/lib/itinerary";
import type { View } from "@/lib/view";
import RowView from "@/components/RowView";

export default function Rows({
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
