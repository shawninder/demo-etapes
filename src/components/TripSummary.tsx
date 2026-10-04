"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Coordinates } from "@/data/rivers/types";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { directionsLinks, formatTrip, type Trip } from "@/lib/directions";

export default function TripSummary({
  trip,
  from,
  to,
}: {
  trip: Trip;
  from: string;
  to: Coordinates;
}) {
  const [copied, setCopied] = useState(false);
  const summary = `${formatTrip(trip)} de ${from}`;

  async function copy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        render={<span tabIndex={0} />}
        className="text-muted-foreground cursor-default text-right text-xs underline decoration-dotted underline-offset-2"
      >
        {summary}
      </HoverCardTrigger>
      <HoverCardContent className="flex w-auto gap-1 p-1">
        {directionsLinks.map(({ name, icon: Icon, href }) => (
          <Button
            key={name}
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={
              <Link href={href(from, to)} target="_blank" rel="noreferrer" />
            }
            aria-label={`Itinéraire dans ${name}`}
            title={name}
          >
            <Icon />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          onClick={copy}
          aria-label="Copier le résumé du trajet"
          title={copied ? "Copié" : "Copier"}
          className="cursor-pointer"
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </HoverCardContent>
    </HoverCard>
  );
}
