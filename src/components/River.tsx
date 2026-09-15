"use client";

import { Fragment, useEffect, useState } from "react";
import type { RiverFeature } from "@/data/rivers";
import {
  Item,
  ItemGroup,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemSeparator,
} from "@/components/ui/item";
import {
  compareFeatureLevel,
  getDistanceLevelClassName,
  getFeatureLevelClassName,
} from "@/lib/featureLevel";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export type RiverProps = {
  features: (RiverFeature & { id: string })[];
};

const defaultShowRapids = true;

export default function River({ features = [] }: RiverProps) {
  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showRapids, setShowRapids] = useState<boolean>(defaultShowRapids);

  function toggleShowRapids() {
    setShowRapids((prev) => !prev);
  }

  useEffect(() => {
    const stored = localStorage.getItem("checked");
    if (stored) {
      setChecked(JSON.parse(stored));
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("checked", JSON.stringify(checked));
  }, [checked, hydrated]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const km = event.target.dataset.km;
    if (km) {
      setChecked((prev) => ({
        ...prev,
        [km]: event.target.checked,
      }));
    }
  };

  const sortedChecked = Object.entries(checked)
    .filter(([_, isChecked]) => isChecked)
    .map(([km]) => parseFloat(km))
    .sort((a, b) => b - a);

  let dayCounter = 1;

  return (
    <ItemGroup className="feature-list w-full max-w-2xl gap-0 self-center">
      <Item variant="outline" className="4xs:flex-row my-4 flex-col py-0.5">
        <ItemContent>
          <ItemDescription>
            <label htmlFor="showRapidsCheckbox">Afficher les rapides</label>
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <label htmlFor="showRapidsCheckbox">🌊</label>
          <Switch
            id="showRapidsSwitch"
            onCheckedChange={toggleShowRapids}
            defaultChecked={showRapids}
            checked={showRapids}
          />
        </ItemActions>
      </Item>
      {features.map(({ id, km, label, text }, idx) => {
        const isLastFeature = idx === features.length - 1;

        if (label === "") {
          return null;
        }
        const kmsTravelled =
          checked[km] || isLastFeature
            ? distanceFromLastChecked(parseFloat(km), sortedChecked)
            : null;
        const kmsTravelledLevelClassName =
          kmsTravelled !== null ? getDistanceLevelClassName(kmsTravelled) : "";
        const daySummary =
          checked[km] || isLastFeature
            ? countFeaturesEncountered(parseFloat(km), sortedChecked, features)
            : null;
        const isCampable =
          label.indexOf("🏕") !== -1 || label.indexOf("🚙") !== -1;

        return (
          <Fragment key={id}>
            <Item
              variant="outline"
              title={text}
              className={cn(
                "hover:bg-muted bg-accent/50 2xs:flex-row flex-col rounded-none transition-[opacity,max-height] duration-600",
                !showRapids && !isCampable
                  ? "max-h-0 border-0 py-0 opacity-0"
                  : "2xs:py-0.5 max-h-96 border py-2 opacity-100",
              )}
            >
              <ItemContent
                className={cn(
                  "transition-max-height 3xs:flex-row flex w-full flex-col items-center gap-2",
                  !showRapids && !isCampable ? "max-h-0" : "max-h-96",
                )}
              >
                <span className="text-muted-foreground inline-block font-mono text-xs">
                  km {parseFloat(km).toFixed(1)}
                </span>
                <ItemTitle>
                  {label[0] === "R" ||
                  label[0] === "C" ||
                  label[0] === "L" ||
                  label[0] === "S" ||
                  label[0] === "E"
                    ? "🌊 "
                    : null}
                  {label}
                  {" "}
                </ItemTitle>
                <ItemDescription className="text-foreground text-center">
                  {text}
                </ItemDescription>
              </ItemContent>
              {isCampable ? (
                <ItemActions>
                  <label className="2xs:justify-end">
                    <Input
                      type="checkbox"
                      checked={checked[km] || false}
                      onChange={onChange}
                      data-km={km}
                      className="size-6"
                    />
                  </label>
                </ItemActions>
              ) : null}
            </Item>
            {(isLastFeature || isCampable) && (kmsTravelled || daySummary) ? (
              <Item className="">
                <ItemContent className="items-center">
                  {kmsTravelled !== null && (
                    <ItemTitle className="flex flex-col 2xl:flex-row">
                      <span>totalisant</span>
                      <span
                        className={cn("text-lg", kmsTravelledLevelClassName)}
                      >
                        {kmsTravelled} km
                      </span>
                      {daySummary && Object.keys(daySummary).length > 0 && (
                        <span>avec</span>
                      )}
                    </ItemTitle>
                  )}
                  {daySummary && (
                    <ItemGroup className="flex-row flex-wrap justify-center">
                      {Object.entries(daySummary)
                        .sort(([a], [b]) => compareFeatureLevel(a, b))
                        .map(([label, count]) => (
                          <Item
                            key={label}
                            className="flex w-fit flex-row items-center gap-2"
                          >
                            <ItemTitle>
                              <span className="font-bold">{count}</span>
                              {" "}⨉{" "}
                              <span
                                className={cn(
                                  "3xs:text-lg border-accent inline-block rounded border p-2 text-sm",
                                  getFeatureLevelClassName(label),
                                )}
                              >
                                {label}
                              </span>
                            </ItemTitle>
                          </Item>
                        ))}
                    </ItemGroup>
                  )}
                </ItemContent>
              </Item>
            ) : null}
            {!isLastFeature && isCampable && (kmsTravelled || daySummary) ? (
              <>
                <ItemSeparator className="bg-accent-foreground" />
                <Day dayCounter={dayCounter++} />
              </>
            ) : null}
          </Fragment>
        );
      })}
    </ItemGroup>
  );
}

function distanceFromLastChecked(km: number, sortedChecked: number[]) {
  if (sortedChecked.length === 0) {
    return null;
  }

  let lastKm = Infinity;
  for (const marker of sortedChecked) {
    if (marker < km) {
      break;
    }
    if (marker !== km) {
      if (marker < lastKm) {
        lastKm = marker;
      }
    }
  }
  const distance = lastKm - km;

  return lastKm === Infinity ? null : Math.round(10 * distance) / 10;
}

function countFeaturesEncountered(
  km: number,
  sortedChecked: number[],
  features: RiverFeature[],
) {
  if (sortedChecked.length === 0) {
    return null;
  }

  let lastKm = Infinity;
  for (const marker of sortedChecked) {
    if (marker < km) {
      break;
    }
    if (marker !== km) {
      if (marker < lastKm) {
        lastKm = marker;
      }
    }
  }

  return features.reduce<Record<string, number>>((acc, feature) => {
    const featureKm = parseFloat(feature.km);
    if (
      featureKm > km &&
      featureKm <= lastKm &&
      feature.label !== "" &&
      feature.label.indexOf("🏕") === -1 &&
      feature.label.indexOf("🚙") === -1
    ) {
      if (!acc[feature.label]) {
        acc[feature.label] = 0;
      }
      acc[feature.label]++;
    }
    return acc;
  }, {});
}

function Day({ dayCounter }: { dayCounter: number }) {
  return (
    <Item variant="outline" className="justify-center text-lg font-bold">
      Jour {dayCounter}
    </Item>
  );
}
