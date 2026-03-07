import { describe, it, expect } from "vitest";
import { VENUES, type VenueData } from "../venues";

describe("VENUES data", () => {
  describe("overall structure", () => {
    it("should have at least 25 venues total (including 11 new ones)", () => {
      expect(VENUES.length).toBeGreaterThanOrEqual(25);
    });

    it("should have no duplicate IDs", () => {
      const ids = VENUES.map((v) => v.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("required fields", () => {
    it("every venue should have an id", () => {
      for (const venue of VENUES) {
        expect(venue.id).toBeDefined();
        expect(typeof venue.id).toBe("string");
        expect(venue.id.length).toBeGreaterThan(0);
      }
    });

    it("every venue should have a name", () => {
      for (const venue of VENUES) {
        expect(venue.name).toBeDefined();
        expect(typeof venue.name).toBe("string");
        expect(venue.name.length).toBeGreaterThan(0);
      }
    });

    it("every venue should have a valid type", () => {
      const validTypes = [
        "gym",
        "chess",
        "ai_meetup",
        "swimming",
        "cycling",
        "restaurant",
        "social",
        "coworking",
      ];
      for (const venue of VENUES) {
        expect(validTypes).toContain(venue.type);
      }
    });

    it("every venue should have a neighborhoodId", () => {
      for (const venue of VENUES) {
        expect(venue.neighborhoodId).toBeDefined();
        expect(typeof venue.neighborhoodId).toBe("string");
        expect(venue.neighborhoodId.length).toBeGreaterThan(0);
      }
    });

    it("every venue should have an address", () => {
      for (const venue of VENUES) {
        expect(venue.address).toBeDefined();
        expect(typeof venue.address).toBe("string");
        expect(venue.address.length).toBeGreaterThan(0);
      }
    });

    it("every venue should have valid lat/lng coordinates", () => {
      for (const venue of VENUES) {
        expect(typeof venue.lat).toBe("number");
        expect(typeof venue.lng).toBe("number");
        // Zurich area coordinates roughly
        expect(venue.lat).toBeGreaterThan(47.3);
        expect(venue.lat).toBeLessThan(47.5);
        expect(venue.lng).toBeGreaterThan(8.4);
        expect(venue.lng).toBeLessThan(8.6);
      }
    });

    it("every venue should have a tags array", () => {
      for (const venue of VENUES) {
        expect(Array.isArray(venue.tags)).toBe(true);
        expect(venue.tags.length).toBeGreaterThan(0);
      }
    });
  });

  describe("category coverage", () => {
    const venuesByType = (type: string) =>
      VENUES.filter((v) => v.type === type);

    it("should have at least 3 gyms", () => {
      expect(venuesByType("gym").length).toBeGreaterThanOrEqual(3);
    });

    it("should have at least 3 chess venues", () => {
      expect(venuesByType("chess").length).toBeGreaterThanOrEqual(3);
    });

    it("should have at least 3 AI meetup venues", () => {
      expect(venuesByType("ai_meetup").length).toBeGreaterThanOrEqual(3);
    });

    it("should have at least 3 swimming venues", () => {
      expect(venuesByType("swimming").length).toBeGreaterThanOrEqual(3);
    });

    it("should have at least 3 restaurant or social venues", () => {
      const count =
        venuesByType("restaurant").length + venuesByType("social").length;
      expect(count).toBeGreaterThanOrEqual(3);
    });

    it("should have at least 3 coworking venues", () => {
      expect(venuesByType("coworking").length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("specific new venues", () => {
    it("should include Schachclub Letzi", () => {
      const letzi = VENUES.find((v) => v.id === "chess-letzi");
      expect(letzi).toBeDefined();
      expect(letzi?.type).toBe("chess");
    });

    it("should include Hallenbad City (indoor pool)", () => {
      const pool = VENUES.find((v) => v.id === "swim-hallenbad-city");
      expect(pool).toBeDefined();
      expect(pool?.type).toBe("swimming");
    });

    it("should include Hiltl restaurant", () => {
      const hiltl = VENUES.find((v) => v.id === "restaurant-hiltl");
      expect(hiltl).toBeDefined();
      expect(hiltl?.type).toBe("restaurant");
    });

    it("should include Westhive coworking", () => {
      const westhive = VENUES.find((v) => v.id === "cowork-westhive");
      expect(westhive).toBeDefined();
      expect(westhive?.type).toBe("coworking");
    });
  });
});
