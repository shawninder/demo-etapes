"use client";

import { ItemDescription, ItemTitle } from "@/components/ui/item";
import FeatureLabel from "@/components/FeatureLabel";
import {
  formatLength,
  getFeatureIcon,
  getFeatureLabel,
  getFeatureName,
} from "@/lib/featureLabel";
import { getFeatureLevel, getFeatureLevelClassName } from "@/lib/featureLevel";
import type { Feature } from "@/lib/itinerary";
import { cn } from "@/lib/utils";

export default function FeatureLine({ feature }: { feature: Feature }) {
  const icon = getFeatureIcon(feature);
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
    <div className="flex flex-row items-baseline gap-2">
      {icon || label || name ? (
        <ItemTitle className="shrink-0 whitespace-nowrap">
          {icon && <span>{icon}</span>}
          {label && level ? (
            <span
              className={cn(
                "border-accent rounded border px-1",
                getFeatureLevelClassName(level),
              )}
            >
              <FeatureLabel label={label} />
            </span>
          ) : (
            label && (
              <span>
                <FeatureLabel label={label} />
              </span>
            )
          )}
          {name && <span>{name}</span>}
        </ItemTitle>
      ) : null}
      {details ? (
        <ItemDescription className="text-foreground min-w-0 flex-1">
          {details}
        </ItemDescription>
      ) : null}
    </div>
  );
}
