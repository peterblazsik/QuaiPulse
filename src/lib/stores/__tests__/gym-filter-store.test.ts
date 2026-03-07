import { describe, it, expect, beforeEach } from "vitest";
import { useGymFilterStore } from "../gym-filter-store";

describe("useGymFilterStore", () => {
  beforeEach(() => {
    useGymFilterStore.setState({
      selectedEquipment: [],
      priceRange: [0, 200],
      kneeSafeOnly: false,
      compareIds: [],
    });
  });

  describe("initial state", () => {
    it("should have default price range of [0, 200]", () => {
      const { priceRange } = useGymFilterStore.getState();
      expect(priceRange).toEqual([0, 200]);
    });

    it("should have empty selectedEquipment", () => {
      const { selectedEquipment } = useGymFilterStore.getState();
      expect(selectedEquipment).toEqual([]);
    });

    it("should have kneeSafeOnly set to false", () => {
      const { kneeSafeOnly } = useGymFilterStore.getState();
      expect(kneeSafeOnly).toBe(false);
    });

    it("should have empty compareIds", () => {
      const { compareIds } = useGymFilterStore.getState();
      expect(compareIds).toEqual([]);
    });
  });

  describe("setPriceRange", () => {
    it("should update the price range", () => {
      const { setPriceRange } = useGymFilterStore.getState();
      setPriceRange([50, 150]);

      const { priceRange } = useGymFilterStore.getState();
      expect(priceRange).toEqual([50, 150]);
    });

    it("should handle minimum range (same min and max)", () => {
      const { setPriceRange } = useGymFilterStore.getState();
      setPriceRange([100, 100]);

      const { priceRange } = useGymFilterStore.getState();
      expect(priceRange).toEqual([100, 100]);
    });

    it("should handle zero-based range", () => {
      const { setPriceRange } = useGymFilterStore.getState();
      setPriceRange([0, 50]);

      const { priceRange } = useGymFilterStore.getState();
      expect(priceRange).toEqual([0, 50]);
    });

    it("should replace the previous price range completely", () => {
      const { setPriceRange } = useGymFilterStore.getState();
      setPriceRange([30, 80]);
      setPriceRange([60, 180]);

      const { priceRange } = useGymFilterStore.getState();
      expect(priceRange).toEqual([60, 180]);
    });
  });

  describe("toggleEquipment", () => {
    it("should add equipment when not present", () => {
      const { toggleEquipment } = useGymFilterStore.getState();
      toggleEquipment("leg_press");

      const { selectedEquipment } = useGymFilterStore.getState();
      expect(selectedEquipment).toContain("leg_press");
    });

    it("should remove equipment when already present", () => {
      const { toggleEquipment } = useGymFilterStore.getState();
      toggleEquipment("leg_press");
      useGymFilterStore.getState().toggleEquipment("leg_press");

      const { selectedEquipment } = useGymFilterStore.getState();
      expect(selectedEquipment).not.toContain("leg_press");
    });

    it("should support multiple equipment selections", () => {
      const store = useGymFilterStore.getState();
      store.toggleEquipment("leg_press");
      useGymFilterStore.getState().toggleEquipment("cable_cross");
      useGymFilterStore.getState().toggleEquipment("free_weights");

      const { selectedEquipment } = useGymFilterStore.getState();
      expect(selectedEquipment).toHaveLength(3);
      expect(selectedEquipment).toContain("leg_press");
      expect(selectedEquipment).toContain("cable_cross");
      expect(selectedEquipment).toContain("free_weights");
    });
  });

  describe("setKneeSafeOnly", () => {
    it("should set kneeSafeOnly to true", () => {
      const { setKneeSafeOnly } = useGymFilterStore.getState();
      setKneeSafeOnly(true);

      expect(useGymFilterStore.getState().kneeSafeOnly).toBe(true);
    });

    it("should set kneeSafeOnly back to false", () => {
      const { setKneeSafeOnly } = useGymFilterStore.getState();
      setKneeSafeOnly(true);
      useGymFilterStore.getState().setKneeSafeOnly(false);

      expect(useGymFilterStore.getState().kneeSafeOnly).toBe(false);
    });
  });

  describe("toggleCompare", () => {
    it("should add a gym to compare list", () => {
      const { toggleCompare } = useGymFilterStore.getState();
      toggleCompare("gym-1");

      const { compareIds } = useGymFilterStore.getState();
      expect(compareIds).toContain("gym-1");
    });

    it("should remove a gym from compare list when toggled again", () => {
      const { toggleCompare } = useGymFilterStore.getState();
      toggleCompare("gym-1");
      useGymFilterStore.getState().toggleCompare("gym-1");

      const { compareIds } = useGymFilterStore.getState();
      expect(compareIds).not.toContain("gym-1");
    });

    it("should limit compare list to 3 gyms", () => {
      const store = useGymFilterStore.getState();
      store.toggleCompare("gym-1");
      useGymFilterStore.getState().toggleCompare("gym-2");
      useGymFilterStore.getState().toggleCompare("gym-3");
      useGymFilterStore.getState().toggleCompare("gym-4");

      const { compareIds } = useGymFilterStore.getState();
      expect(compareIds).toHaveLength(3);
      expect(compareIds).not.toContain("gym-4");
    });
  });

  describe("clearCompare", () => {
    it("should clear the compare list", () => {
      const store = useGymFilterStore.getState();
      store.toggleCompare("gym-1");
      useGymFilterStore.getState().toggleCompare("gym-2");

      useGymFilterStore.getState().clearCompare();

      const { compareIds } = useGymFilterStore.getState();
      expect(compareIds).toEqual([]);
    });
  });
});
