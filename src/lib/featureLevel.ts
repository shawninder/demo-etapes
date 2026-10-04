import type { Grade } from "@/data/rivers/types";
import type { Feature } from "@/lib/itinerary";

export type FeatureLevel =
  | "helpful"
  | "neutral"
  | "fun"
  | "active"
  | "engaging"
  | "demanding"
  | "extreme"
  | "impassable";

const featureLevelOrder: FeatureLevel[] = [
  "helpful",
  "neutral",
  "fun",
  "active",
  "engaging",
  "demanding",
  "extreme",
  "impassable",
];

export function compareFeatureLevel(
  a: FeatureLevel | null,
  b: FeatureLevel | null,
): number {
  const rankA = a ? featureLevelOrder.indexOf(a) : -1;
  const rankB = b ? featureLevelOrder.indexOf(b) : -1;
  return rankA - rankB;
}

type FeatureLevelClassNames = [bg: string, border: string, text: string];

const featureLevelClassNames: Record<FeatureLevel, FeatureLevelClassNames> = {
  helpful: [
    "bg-level-helpful-bg",
    "border-level-helpful-border",
    "text-level-helpful-text",
  ],
  neutral: [
    "bg-level-neutral-bg",
    "border-level-neutral-border",
    "text-level-neutral-text",
  ],
  fun: ["bg-level-fun-bg", "border-level-fun-border", "text-level-fun-text"],
  active: [
    "bg-level-active-bg",
    "border-level-active-border",
    "text-level-active-text",
  ],
  engaging: [
    "bg-level-engaging-bg",
    "border-level-engaging-border",
    "text-level-engaging-text",
  ],
  demanding: [
    "bg-level-demanding-bg",
    "border-level-demanding-border",
    "text-level-demanding-text",
  ],
  extreme: [
    "bg-level-extreme-bg",
    "border-level-extreme-border",
    "text-level-extreme-text",
  ],
  impassable: [
    "bg-level-impassable-bg",
    "border-level-impassable-border",
    "text-level-impassable-text",
  ],
};

const rapidLevels: (FeatureLevel | undefined)[] = [
  undefined,
  "fun",
  "active",
  "engaging",
  "demanding",
  "extreme",
  "impassable",
];

function ledgeLevel(classNum: number): FeatureLevel {
  if (classNum <= 2) return "engaging";
  if (classNum <= 5) return "demanding";
  return "extreme";
}

function highestClass(grade: Grade | undefined) {
  return Array.isArray(grade) ? grade[1] : grade;
}

export function getFeatureLevel(feature: Feature): FeatureLevel | null {
  if (feature.kind === "portage") return "active";
  if (feature.kind !== "section") return null;

  const classNum = highestClass(feature.class);
  switch (feature.type) {
    case "swift":
      return "helpful";
    case "rapid":
      return classNum === undefined
        ? null
        : (rapidLevels[classNum] ?? "impassable");
    case "ledge":
      return classNum === undefined ? null : ledgeLevel(classNum);
    case "waterfall":
      return classNum !== undefined && classNum >= 1 ? "extreme" : "impassable";
    default:
      return null;
  }
}

export function getFeatureLevelClassName(level: FeatureLevel | null): string {
  return level ? featureLevelClassNames[level].join(" ") : "";
}

const distanceLevelThresholds: [number, FeatureLevel][] = [
  [5, "helpful"],
  [10, "neutral"],
  [15, "fun"],
  [20, "active"],
  [35, "engaging"],
  [50, "demanding"],
  [60, "extreme"],
];

export function getDistanceLevel(km: number): FeatureLevel {
  for (const [max, level] of distanceLevelThresholds) {
    if (km < max) return level;
  }
  return "impassable";
}

export function getDistanceLevelClassName(km: number): string {
  return featureLevelClassNames[getDistanceLevel(km)][2];
}
