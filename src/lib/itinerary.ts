import type {
  Access,
  Campsite,
  Fork,
  Itinerary,
  Km,
  PointOfInterest,
  Portage,
  Section,
} from "@/data/rivers/types";
import { getFeatureLabel } from "@/lib/featureLabel";
import {
  compareFeatureLevel,
  getFeatureLevel,
  type FeatureLevel,
} from "@/lib/featureLevel";

export type Feature =
  | ({ kind: "access" } & Access)
  | ({ kind: "campsite" } & Campsite)
  | ({ kind: "pointOfInterest" } & PointOfInterest)
  | ({ kind: "section" } & Section)
  | ({ kind: "portage" } & Portage)
  | ({ kind: "fork" } & Fork);

export type FeatureKind = Feature["kind"];
export type FeatureOf<K extends FeatureKind> = Extract<Feature, { kind: K }>;

export type Row = { km: Km; features: Feature[] };

// Within a km, places you can stop at come first: the km marks where a
// section, portage or fork begins, so you reach them before it.
const collections = [
  ["access", "accesses"],
  ["campsite", "campsites"],
  ["pointOfInterest", "pointsOfInterest"],
  ["section", "sections"],
  ["portage", "portages"],
  ["fork", "forks"],
] as const satisfies [FeatureKind, keyof Itinerary][];

/**
 * Merges the itinerary's lists, each sorted by descending km, into one row
 * per km holding every feature found there.
 */
export function buildRows(itinerary: Itinerary): Row[] {
  const lists = collections.map(([kind, key]) =>
    (itinerary[key] ?? []).map((item) => ({ kind, ...item }) as Feature),
  );
  const cursors = lists.map(() => 0);
  const rows: Row[] = [];

  for (;;) {
    let km = -Infinity;
    lists.forEach((list, i) => {
      if (cursors[i] < list.length) km = Math.max(km, list[cursors[i]].km);
    });
    if (km === -Infinity) return rows;

    const features: Feature[] = [];
    lists.forEach((list, i) => {
      while (cursors[i] < list.length && list[cursors[i]].km === km) {
        features.push(list[cursors[i]++]);
      }
      if (cursors[i] < list.length && list[cursors[i]].km > km) {
        throw new Error(
          `${collections[i][1]} must be sorted by descending km: ${list[cursors[i]].km} follows ${km}`,
        );
      }
    });
    if (features.filter(isFork).length > 1) {
      throw new Error(`Only one fork allowed per km: ${km}`);
    }
    rows.push({ km, features });
  }
}

export function isStop(
  feature: Feature,
): feature is FeatureOf<"access" | "campsite"> {
  return feature.kind === "access" || feature.kind === "campsite";
}

export function isFork(feature: Feature): feature is FeatureOf<"fork"> {
  return feature.kind === "fork";
}

export function rowKey(prefix: string, km: Km) {
  return `${prefix}${km}`;
}

export function routePrefix(forkKey: string, route: number) {
  return `${forkKey}/${route}/`;
}

export type Selection = Record<string, number>;

export function selectedRoute(selection: Selection, key: string, fork: Fork) {
  const route = selection[key] ?? 0;
  return route < fork.routes.length ? route : 0;
}

export type PathRow = Row & { key: string };

export function selectedPath(
  itinerary: Itinerary,
  selection: Selection,
  prefix = "",
): PathRow[] {
  return buildRows(itinerary).flatMap((row) => {
    const key = rowKey(prefix, row.km);
    const fork = row.features.find(isFork);
    if (!fork) return [{ ...row, key }];

    const route = selectedRoute(selection, key, fork);
    return [
      { ...row, key },
      ...selectedPath(fork.routes[route], selection, routePrefix(key, route)),
    ];
  });
}

export function getAccesses(itinerary: Itinerary): Access[] {
  return [
    ...(itinerary.accesses ?? []),
    ...(itinerary.forks ?? []).flatMap(({ routes }) =>
      routes.flatMap(getAccesses),
    ),
  ];
}

export type Tally = {
  label: string;
  level: FeatureLevel | null;
  count: number;
};
export type Day = { distance: Km; tallies: Tally[] };

export function summarizeDay(path: PathRow[], from: Km, to: Km): Day {
  const tallies = new Map<string, Tally>();
  for (const row of path) {
    if (row.km > from || row.km <= to) continue;
    for (const feature of row.features) {
      if (feature.kind !== "section" && feature.kind !== "portage") continue;
      const label = getFeatureLabel(feature);
      if (!label) continue;
      const tally = tallies.get(label) ?? {
        label,
        level: getFeatureLevel(feature),
        count: 0,
      };
      tally.count++;
      tallies.set(label, tally);
    }
  }
  return {
    distance: Math.round(10 * (from - to)) / 10,
    tallies: [...tallies.values()].sort((a, b) =>
      compareFeatureLevel(a.level, b.level),
    ),
  };
}

export type StopPlan = {
  ended: Day | null;
  next: number | null;
};

export type Plan = {
  stops: Map<string, StopPlan>;
  last: Day | null;
};

export function planDays(
  path: PathRow[],
  checked: Record<string, boolean>,
): Plan {
  const stops = path
    .filter((row) => checked[row.key] && row.features.some(isStop))
    .sort((a, b) => b.km - a.km);
  const end = Math.min(...path.map((row) => row.km));

  const plan = new Map<string, StopPlan>();
  stops.forEach((stop, i) => {
    plan.set(stop.key, {
      ended: i > 0 ? summarizeDay(path, stops[i - 1].km, stop.km) : null,
      next: stop.km > end ? i + 1 : null,
    });
  });

  const lastStop = stops.at(-1);
  return {
    stops: plan,
    last:
      lastStop && lastStop.km > end
        ? summarizeDay(path, lastStop.km, end)
        : null,
  };
}
