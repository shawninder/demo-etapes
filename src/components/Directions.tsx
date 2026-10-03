"use client";

import { CornerUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Directions({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="inline-block size-5 -rotate-45 cursor-pointer rounded p-1"
      onClick={onClick}
      aria-label="Calculer le trajet routier"
      title="Calculer trajet routier"
    >
      <CornerUpRight className="size-3 rotate-45" />
    </Button>
  );
}
