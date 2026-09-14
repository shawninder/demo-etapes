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

export function compareFeatureLevel(a: string, b: string): number {
  const levelA = getFeatureLevel(a);
  const levelB = getFeatureLevel(b);
  const rankA = levelA ? featureLevelOrder.indexOf(levelA) : -1;
  const rankB = levelB ? featureLevelOrder.indexOf(levelB) : -1;
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

const unratedTypeLevels: Record<string, FeatureLevel> = {
  EV: "helpful",
  P: "active",
  K: "impassable",
  C: "impassable",
};

const labelPattern = /^([A-Z]+)(\d+)?(?:-(\d+))?/;

export function getFeatureLevel(label: string): FeatureLevel | null {
  const match = labelPattern.exec(label.trim());
  if (!match) return null;

  const [, type, low, high] = match;
  const classNum = high
    ? parseInt(high, 10)
    : low
      ? parseInt(low, 10)
      : undefined;

  if (classNum === undefined) {
    return unratedTypeLevels[type] ?? null;
  }

  if (type === "R") return rapidLevels[classNum] ?? "impassable";
  if (type === "S") return ledgeLevel(classNum);
  if (type === "C") return classNum >= 1 ? "extreme" : "impassable";

  return null;
}

export function getFeatureLevelClassName(label: string): string {
  const level = getFeatureLevel(label);
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
