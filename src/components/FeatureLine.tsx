"use client";

import { ItemDescription, ItemTitle } from "@/components/ui/item";
import {
  formatLength,
  getFeatureLabel,
  getFeatureName,
  isWhitewater,
} from "@/lib/featureLabel";
import type { Feature } from "@/lib/itinerary";

export default function FeatureLine({ feature }: { feature: Feature }) {
  const label = getFeatureLabel(feature);
  const name = getFeatureName(feature);
  const length =
    (feature.kind === "section" || feature.kind === "portage") &&
    feature.length !== undefined
      ? formatLength(feature.length)
      : undefined;
  const details = [length, feature.notes].filter(Boolean).join("; ");

  return (
    <div className="flex flex-row items-start gap-2">
      {label || name ? (
        <ItemTitle>
          {isWhitewater(feature) ? "🌊 " : null}
          {[label, name].filter(Boolean).join(" ")}
        </ItemTitle>
      ) : null}
      {details ? (
        <ItemDescription className="text-foreground">{details}</ItemDescription>
      ) : null}
    </div>
  );
}
