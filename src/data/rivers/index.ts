import broadback from "./broadback";

export type RiverFeature = {
  km: string;
  label: string;
  text: string;
};

const rivers: { [key: string]: RiverFeature[] } = {
  broadback,
};

export default rivers;
