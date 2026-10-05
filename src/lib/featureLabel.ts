import type { Grade, Metres, SectionType } from "@/data/rivers/types";
import type { Feature } from "@/lib/itinerary";

export function formatGrade(grade: Grade) {
  return Array.isArray(grade) ? grade.join("-") : String(grade);
}

export function formatLength(length: Metres) {
  return length < 1000 ? `${length}m` : `${length / 1000}km`;
}

export const PORTAGE_KEY = "P";
export const LAKE_KEY = "lake";

const sectionPrefixes: Record<SectionType, string | null> = {
  calm: null,
  lake: null,
  swift: "EV",
  rapid: "R",
  ledge: "S",
  waterfall: "C",
};

const sectionNames: Record<SectionType, string> = {
  calm: "Eau calme",
  lake: "Lac",
  swift: "Eau vive",
  rapid: "Rapide",
  ledge: "Seuil",
  waterfall: "Chute",
};

export function getFeatureLabel(feature: Feature): string | null {
  switch (feature.kind) {
    case "campsite":
      return (
        `${feature.size ?? ""}${feature.quality ?? ""}${feature.unconfirmed ? "?" : ""}` ||
        null
      );
    case "portage":
      return PORTAGE_KEY;
    case "section": {
      const prefix = sectionPrefixes[feature.type];
      if (!prefix) return feature.type === "lake" ? LAKE_KEY : null;
      return feature.class === undefined
        ? prefix
        : `${prefix}${formatGrade(feature.class)}`;
    }
    default:
      return null;
  }
}

export function getFeatureIcon(feature: Feature): string | null {
  switch (feature.kind) {
    case "access":
      return "🚙";
    case "campsite":
      return "🏕";
    case "pointOfInterest":
      return "📍";
    case "section":
      return isWhitewater(feature) ? "🌊" : null;
    default:
      return null;
  }
}

export function getFeatureName(feature: Feature): string | undefined {
  if (feature.kind === "portage") return undefined;
  if (feature.kind === "section" && feature.type === "lake") {
    return feature.name;
  }
  if (feature.kind === "section" && !sectionPrefixes[feature.type]) {
    return feature.name ?? sectionNames[feature.type];
  }
  return feature.name;
}

export function isWhitewater(feature: Feature) {
  return feature.kind === "section" && sectionPrefixes[feature.type] !== null;
}
