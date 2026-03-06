export interface PortalLink {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  color: string;
  kreisFilters: Record<number, string>;
}

export const PORTALS: PortalLink[] = [
  {
    id: "homegate",
    name: "Homegate",
    description: "Largest Swiss rental portal. Best for volume.",
    baseUrl: "https://www.homegate.ch/rent/real-estate/city-zurich/matching-list",
    color: "#e11d48",
    kreisFilters: {
      1: "?loc=geo-city-zurich-kreis-1",
      2: "?loc=geo-city-zurich-kreis-2",
      3: "?loc=geo-city-zurich-kreis-3",
      4: "?loc=geo-city-zurich-kreis-4",
      5: "?loc=geo-city-zurich-kreis-5",
      7: "?loc=geo-city-zurich-kreis-7",
      8: "?loc=geo-city-zurich-kreis-8",
      10: "?loc=geo-city-zurich-kreis-10",
      11: "?loc=geo-city-zurich-kreis-11",
    },
  },
  {
    id: "flatfox",
    name: "Flatfox",
    description: "Modern, direct applications. Many exclusive listings.",
    baseUrl: "https://flatfox.ch/en/search/",
    color: "#2563eb",
    kreisFilters: {
      1: "?city=zurich&district=kreis-1",
      2: "?city=zurich&district=kreis-2",
      3: "?city=zurich&district=kreis-3",
      4: "?city=zurich&district=kreis-4",
      5: "?city=zurich&district=kreis-5",
    },
  },
  {
    id: "immoscout24",
    name: "ImmoScout24",
    description: "Swiss version. Good for comparing market prices.",
    baseUrl: "https://www.immoscout24.ch/en/real-estate/rent/city-zurich",
    color: "#16a34a",
    kreisFilters: {
      2: "?r=10",
      3: "?r=10",
      8: "?r=10",
    },
  },
  {
    id: "ronorp",
    name: "Ronorp",
    description: "Community listings. Hidden gems, direct from tenants.",
    baseUrl: "https://www.ronorp.net/zurich/immobilien",
    color: "#f59e0b",
    kreisFilters: {},
  },
];

export const SEARCH_CRITERIA = {
  rooms: "1-2.5",
  priceMin: 1800,
  priceMax: 2800,
  targetKreise: [2, 3, 4, 5, 8],
};
