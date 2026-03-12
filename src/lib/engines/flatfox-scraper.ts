/**
 * Flatfox API client for apartment scraping.
 *
 * Two-step approach:
 * 1. /api/v1/pin/ — geo-filtered search returning listing PKs + prices
 * 2. /api/v1/public-listing/{pk}/ — full listing details
 */

const FLATFOX_BASE = "https://flatfox.ch";
const API_BASE = `${FLATFOX_BASE}/api/v1`;

// Zurich bounding box (city + near suburbs)
const ZURICH_BOUNDS = {
  north: 47.44,
  south: 47.33,
  east: 8.63,
  west: 8.45,
};

export interface FlatfoxPin {
  pk: number;
  latitude: number;
  longitude: number;
  price_display: number | null;
  price_display_type: string;
  price_unit: string;
}

export interface FlatfoxListing {
  pk: number;
  slug: string;
  url: string;
  status: string;
  offer_type: string;
  object_category: string;
  object_type: string;
  price_display: number | null;
  price_display_type: string;
  rent_net: number | null;
  rent_charges: number | null;
  rent_gross: number | null;
  short_title: string;
  public_title: string;
  description: string;
  surface_living: number | null;
  number_of_rooms: number | null;
  floor: number | null;
  street: string;
  zipcode: number;
  city: string;
  public_address: string;
  latitude: number;
  longitude: number;
  year_built: number | null;
  year_renovated: number | null;
  moving_date_type: string;
  moving_date: string | null;
  is_furnished: boolean;
  attributes: { name: string }[];
  published: string;
  cover_image: number | null;
  images: {
    pk: number;
    url: string;
    url_thumb_m: string;
    url_listing_search: string;
    caption: string;
  }[];
}

export interface ScrapedApartment {
  id: string;
  source: "flatfox";
  externalPk: number;
  title: string;
  address: string;
  street: string;
  zipcode: number;
  city: string;
  kreis: number;
  rentNet: number | null;
  rentCharges: number | null;
  rentGross: number | null;
  rentDisplay: number;
  rooms: number | null;
  sqm: number | null;
  floor: number | null;
  availableDate: string | null;
  availableType: string;
  attributes: string[];
  isFurnished: boolean;
  sourceUrl: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  publishedAt: string;
  scrapedAt: string;
}

export interface ScrapeOptions {
  minSurface?: number;
  maxSurface?: number;
  minRooms?: number;
  maxRooms?: number;
  minPrice?: number;
  maxPrice?: number;
  count?: number;
}

export function extractKreis(zipcode: number): number {
  const zip = String(zipcode);
  // Zurich zipcodes: 80xx where the 3rd digit maps to Kreis roughly
  if (!zip.startsWith("80")) return 0;
  const kreisMap: Record<string, number> = {
    "8001": 1,
    "8002": 2,
    "8003": 3,
    "8004": 4,
    "8005": 5,
    "8006": 6,
    "8008": 8,
    "8032": 7,
    "8037": 10,
    "8038": 2,
    "8041": 2,
    "8044": 7,
    "8045": 3,
    "8046": 11,
    "8047": 3,
    "8048": 9,
    "8049": 9,
    "8050": 11,
    "8051": 11,
    "8052": 12,
    "8053": 2,
    "8055": 3,
    "8057": 10,
    "8064": 9,
  };
  return kreisMap[zip] ?? 0;
}

function toScrapedApartment(listing: FlatfoxListing): ScrapedApartment {
  const rentDisplay =
    listing.rent_gross ??
    listing.rent_net ??
    listing.price_display ??
    0;

  const imageUrl =
    listing.images?.[0]?.url_listing_search ??
    listing.images?.[0]?.url ??
    null;

  return {
    id: `ff-${listing.pk}`,
    source: "flatfox",
    externalPk: listing.pk,
    title: listing.short_title || listing.public_title,
    address: listing.public_address || `${listing.street}, ${listing.zipcode} ${listing.city}`,
    street: listing.street,
    zipcode: listing.zipcode,
    city: listing.city,
    kreis: extractKreis(listing.zipcode),
    rentNet: listing.rent_net,
    rentCharges: listing.rent_charges,
    rentGross: listing.rent_gross,
    rentDisplay,
    rooms: listing.number_of_rooms,
    sqm: listing.surface_living,
    floor: listing.floor,
    availableDate: listing.moving_date,
    availableType: listing.moving_date_type,
    attributes: (listing.attributes ?? []).map((a) => a.name),
    isFurnished: listing.is_furnished,
    sourceUrl: `${FLATFOX_BASE}${listing.url}`,
    imageUrl: imageUrl ? `${FLATFOX_BASE}${imageUrl}` : null,
    latitude: listing.latitude,
    longitude: listing.longitude,
    publishedAt: listing.published,
    scrapedAt: new Date().toISOString(),
  };
}

/**
 * Step 1: Search for apartment pins matching criteria.
 */
export async function fetchFlatfoxPins(
  opts: ScrapeOptions = {}
): Promise<FlatfoxPin[]> {
  const params = new URLSearchParams({
    north: String(ZURICH_BOUNDS.north),
    south: String(ZURICH_BOUNDS.south),
    east: String(ZURICH_BOUNDS.east),
    west: String(ZURICH_BOUNDS.west),
    count: String(opts.count ?? 500),
    object_category: "APARTMENT",
    offer_type: "RENT",
  });

  if (opts.minSurface) params.set("min_surface_living", String(opts.minSurface));
  if (opts.maxSurface) params.set("max_surface_living", String(opts.maxSurface));
  if (opts.minRooms) params.set("min_rooms", String(opts.minRooms));
  if (opts.maxRooms) params.set("max_rooms", String(opts.maxRooms));

  const res = await fetch(`${API_BASE}/pin/?${params}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 }, // cache 1h in Next.js
  });

  if (!res.ok) throw new Error(`Flatfox pin search failed: ${res.status}`);
  return res.json();
}

/**
 * Step 2: Fetch full listing details for a single PK.
 */
export async function fetchFlatfoxListing(
  pk: number
): Promise<FlatfoxListing> {
  const res = await fetch(
    `${API_BASE}/public-listing/${pk}/?expand=images`,
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error(`Flatfox listing ${pk} failed: ${res.status}`);
  return res.json();
}

/**
 * Full scrape: search + fetch details + transform.
 * Fetches listings in parallel batches to be respectful.
 */
export async function scrapeFlatfox(
  opts: ScrapeOptions = {}
): Promise<ScrapedApartment[]> {
  const pins = await fetchFlatfoxPins(opts);

  // Pre-filter by price if specified
  const filtered = pins.filter((p) => {
    if (!p.price_display) return false;
    if (opts.minPrice && p.price_display < opts.minPrice) return false;
    if (opts.maxPrice && p.price_display > opts.maxPrice) return false;
    return true;
  });

  // Fetch details in batches of 10
  const BATCH_SIZE = 10;
  const DELAY_MS = 300;
  const results: ScrapedApartment[] = [];

  for (let i = 0; i < filtered.length; i += BATCH_SIZE) {
    const batch = filtered.slice(i, i + BATCH_SIZE);
    const listings = await Promise.allSettled(
      batch.map((pin) => fetchFlatfoxListing(pin.pk))
    );

    for (const result of listings) {
      if (result.status === "fulfilled") {
        results.push(toScrapedApartment(result.value));
      }
    }

    // Rate limit between batches
    if (i + BATCH_SIZE < filtered.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  // Sort by published date (newest first)
  results.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return results;
}
