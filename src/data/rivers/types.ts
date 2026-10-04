export type Km = number;

export type Metres = number;

export type Coordinates = { lat: number; lon: number };

export type Access = {
  km: Km;
  name?: string;
  coordinates: Coordinates;
  notes?: string;
};

export type CampsiteSize = 1 | 2 | 3 | 4 | 5 | "G";
export type CampsiteQuality = "A" | "B" | "C" | "D";

export type Campsite = {
  km: Km;
  name?: string;
  size?: CampsiteSize;
  quality?: CampsiteQuality;
  unconfirmed?: boolean;
  notes?: string;
};

export type SectionType =
  "calm" | "swift" | "rapid" | "ledge" | "waterfall" | "lake";

export type Grade = number | [min: number, max: number];

export type Section = {
  km: Km;
  type: SectionType;
  class?: Grade;
  name?: string;
  length?: Metres;
  notes?: string;
};

export type Portage = {
  km: Km;
  length?: Metres;
  notes?: string;
};

export type PointOfInterest = {
  km: Km;
  name?: string;
  notes?: string;
};

export type Itinerary = {
  accesses?: Access[];
  campsites?: Campsite[];
  sections?: Section[];
  portages?: Portage[];
  pointsOfInterest?: PointOfInterest[];
  forks?: Fork[];
};

export type Fork = {
  km: Km;
  name?: string;
  notes?: string;
  routes: [Route, Route, ...Route[]];
};

export type Route = Itinerary & {
  name: string;
  notes?: string;
};

export type River = Itinerary & {
  name: string;
  slug: string;
  gaugeUrl?: string;
  mapUrls: string[];
};
