import type { FeatureKind, Plan, Selection } from "@/lib/itinerary";
import type { Trip } from "@/lib/directions";

export type FilterKind = Exclude<FeatureKind, "fork">;
export type Filters = Record<FilterKind, boolean>;

export type View = {
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

export function destination({ lat, lon }: { lat: number; lon: number }) {
  return `${lat},${lon}`;
}
