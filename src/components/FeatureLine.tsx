"use client";

import { ItemDescription, ItemTitle } from "@/components/ui/item";
import {
  formatLength,
  getFeatureLabel,
  getFeatureName,
  isWhitewater,
} from "@/lib/featureLabel";
import { getFeatureLevel, getFeatureLevelClassName } from "@/lib/featureLevel";
import type { Feature } from "@/lib/itinerary";
import { cn } from "@/lib/utils";

export default function FeatureLine({ feature }: { feature: Feature }) {
  const label = getFeatureLabel(feature);
  const name = getFeatureName(feature);
  const level = getFeatureLevel(feature);
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
          {isWhitewater(feature) ? "🌊" : null}
          {label && level ? (
            <span
              className={cn(
                "border-accent rounded border px-1",
                getFeatureLevelClassName(level),
              )}
            >
              {label}
            </span>
          ) : (
            label
          )}
          {name}
        </ItemTitle>
      ) : null}
      {details ? (
        <ItemDescription className="text-foreground">{details}</ItemDescription>
      ) : null}
    </div>
  );
}
