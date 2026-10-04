import { Apple, MapPin, Navigation, type LucideIcon } from "lucide-react";
import type { Coordinates } from "@/data/rivers/types";

const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
const CACHE_KEY = "directionsCache";

export type Trip = { km: number; seconds: number };

type Cache = {
  geocode: Record<string, [lat: number, lon: number]>;
  trips: Record<string, Trip>;
};

const latLon = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;

function readCache(): Cache {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { geocode: {}, trips: {} };
}

function writeCache(cache: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

async function geocode(
  address: string,
  cache: Cache,
): Promise<[lat: number, lon: number]> {
  const match = address.match(latLon);
  if (match) return [parseFloat(match[1]), parseFloat(match[2])];
  if (cache.geocode[address]) return cache.geocode[address];

  const params = new URLSearchParams({
    text: address,
    format: "json",
    limit: "1",
    apiKey: API_KEY ?? "",
  });
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?${params}`,
  );
  if (!response.ok) throw new Error(`Erreur de géocodage (${response.status})`);
  const { results } = await response.json();
  if (!results?.length) throw new Error("Adresse introuvable");

  const coords: [number, number] = [results[0].lat, results[0].lon];
  cache.geocode[address] = coords;
  writeCache(cache);
  return coords;
}

export async function getTrips(
  homeAddress: string,
  destinations: string[],
): Promise<Record<string, Trip>> {
  const cache = readCache();
  const tripKey = (destination: string) => `${homeAddress}|${destination}`;
  const missing = destinations.filter((d) => !cache.trips[tripKey(d)]);

  if (missing.length > 0) {
    if (!API_KEY) throw new Error("NEXT_PUBLIC_GEOAPIFY_API_KEY manquante");

    const from = await geocode(homeAddress, cache);
    const targets = await Promise.all(missing.map((d) => geocode(d, cache)));
    const response = await fetch(
      `https://api.geoapify.com/v1/routematrix?apiKey=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "drive",
          sources: [{ location: [from[1], from[0]] }],
          targets: targets.map(([lat, lon]) => ({ location: [lon, lat] })),
        }),
      },
    );
    if (!response.ok) throw new Error(`Erreur de trajet (${response.status})`);
    const { sources_to_targets } = await response.json();

    for (const { distance, time, target_index } of sources_to_targets[0]) {
      if (distance == null || time == null) continue;
      cache.trips[tripKey(missing[target_index])] = {
        km: distance / 1000,
        seconds: time,
      };
    }
    writeCache(cache);
  }

  return Object.fromEntries(
    destinations.flatMap((d) => {
      const trip = cache.trips[tripKey(d)];
      return trip ? [[d, trip]] : [];
    }),
  );
}

export function formatTrip({ km, seconds }: Trip) {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const duration =
    hours > 0
      ? `${hours} h ${String(minutes % 60).padStart(2, "0")}`
      : `${minutes} min`;
  return `${Math.round(km)} km, ~${duration}`;
}

export type DirectionsLink = {
  name: string;
  icon: LucideIcon;
  href: (from: string, to: Coordinates) => string;
};

export const directionsLinks: DirectionsLink[] = [
  {
    name: "Google Maps",
    icon: MapPin,
    href: (from, { lat, lon }) =>
      `https://www.google.com/maps/dir/?${new URLSearchParams({
        api: "1",
        origin: from,
        destination: `${lat},${lon}`,
        travelmode: "driving",
      })}`,
  },
  {
    name: "Apple Plans",
    icon: Apple,
    href: (from, { lat, lon }) =>
      `https://maps.apple.com/?${new URLSearchParams({
        saddr: from,
        daddr: `${lat},${lon}`,
        dirflg: "d",
      })}`,
  },
  {
    // Waze always starts from the current location.
    name: "Waze",
    icon: Navigation,
    href: (_, { lat, lon }) =>
      `https://waze.com/ul?${new URLSearchParams({
        ll: `${lat},${lon}`,
        navigate: "yes",
      })}`,
  },
];
