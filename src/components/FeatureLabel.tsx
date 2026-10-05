import { PortageIcon } from "@/components/icons/PortageIcon";
import { PORTAGE_KEY } from "@/lib/featureLabel";

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
  return label;
}
