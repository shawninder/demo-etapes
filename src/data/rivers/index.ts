import broadback from "./broadback";
import type { River } from "./types";

const rivers: Record<string, River> = Object.fromEntries(
  [broadback].map((river) => [river.slug, river]),
);

export default rivers;
