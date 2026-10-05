import { PortageIcon } from "@/components/icons/PortageIcon";
import { HugeiconsIcon } from "@hugeicons/react";
import { Asteroid01Icon } from "@hugeicons/core-free-icons";
import { LAKE_KEY, PORTAGE_KEY } from "@/lib/featureLabel";

export default function FeatureLabel({ label }: { label: string }) {
  if (label === PORTAGE_KEY) {
    return (
      <PortageIcon
        role="img"
        aria-label="Portage"
        className="inline-block size-[1.25em] align-text-bottom"
      />
    );
  }
  if (label === LAKE_KEY) {
    return (
      <HugeiconsIcon
        icon={Asteroid01Icon}
        role="img"
        aria-label="Lac"
        className="text-level-neutral-text inline-block size-[1.25em] align-text-bottom"
      />
    );
  }
  return label;
}
