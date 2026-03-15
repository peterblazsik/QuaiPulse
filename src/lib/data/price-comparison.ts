/**
 * Consumer goods price comparison across 4 stores:
 * - Vienna: Billa Corso (premium Austrian supermarket)
 * - Zurich: Globus Delicatessa (premium Swiss equivalent)
 * - Zurich: Migros (moderate everyday Swiss chain)
 * - Amsterdam: Albert Heijn (Dutch standard supermarket)
 *
 * All prices in EUR for fair comparison.
 * CHF → EUR conversion: multiply by 0.95
 * Prices reflect realistic 2025/2026 European market rates.
 */

export interface PriceItem {
  id: string;
  category: string;
  name: string;
  unit: string;
  viennaBillaCurso: number; // EUR
  zurichGlobus: number; // EUR (converted from CHF)
  zurichMigros: number; // EUR (converted from CHF)
  amsterdamAH: number; // EUR
}

export interface PriceCategory {
  id: string;
  name: string;
  icon: string; // lucide icon name
  items: PriceItem[];
}

export const STORE_KEYS = [
  "viennaBillaCurso",
  "zurichGlobus",
  "zurichMigros",
  "amsterdamAH",
] as const;

export type StoreKey = (typeof STORE_KEYS)[number];

export const STORE_LABELS: Record<StoreKey, { name: string; city: string; flag: string }> = {
  viennaBillaCurso: { name: "Billa Corso", city: "Vienna", flag: "🇦🇹" },
  zurichGlobus: { name: "Globus", city: "Zurich", flag: "🇨🇭" },
  zurichMigros: { name: "Migros", city: "Zurich", flag: "🇨🇭" },
  amsterdamAH: { name: "Albert Heijn", city: "Amsterdam", flag: "🇳🇱" },
};

export const PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: "dairy",
    name: "Dairy & Eggs",
    icon: "Milk",
    items: [
      { id: "dairy-01", category: "dairy", name: "Whole milk", unit: "1L", viennaBillaCurso: 1.49, zurichGlobus: 1.71, zurichMigros: 1.52, amsterdamAH: 1.29 },
      { id: "dairy-02", category: "dairy", name: "Semi-skimmed milk", unit: "1L", viennaBillaCurso: 1.39, zurichGlobus: 1.62, zurichMigros: 1.43, amsterdamAH: 1.19 },
      { id: "dairy-03", category: "dairy", name: "Butter", unit: "250g", viennaBillaCurso: 2.99, zurichGlobus: 3.80, zurichMigros: 3.33, amsterdamAH: 2.79 },
      { id: "dairy-04", category: "dairy", name: "Free-range eggs", unit: "10 pcs", viennaBillaCurso: 4.29, zurichGlobus: 6.18, zurichMigros: 5.23, amsterdamAH: 3.89 },
      { id: "dairy-05", category: "dairy", name: "Greek yogurt", unit: "200g", viennaBillaCurso: 1.79, zurichGlobus: 2.38, zurichMigros: 1.90, amsterdamAH: 1.69 },
      { id: "dairy-06", category: "dairy", name: "Emmentaler cheese", unit: "200g", viennaBillaCurso: 3.49, zurichGlobus: 3.80, zurichMigros: 3.33, amsterdamAH: 3.99 },
      { id: "dairy-07", category: "dairy", name: "Mozzarella", unit: "125g", viennaBillaCurso: 1.49, zurichGlobus: 2.19, zurichMigros: 1.81, amsterdamAH: 1.39 },
      { id: "dairy-08", category: "dairy", name: "Cream cheese", unit: "200g", viennaBillaCurso: 1.99, zurichGlobus: 2.85, zurichMigros: 2.38, amsterdamAH: 1.89 },
      { id: "dairy-09", category: "dairy", name: "Parmesan", unit: "100g", viennaBillaCurso: 3.99, zurichGlobus: 4.75, zurichMigros: 3.80, amsterdamAH: 3.49 },
      { id: "dairy-10", category: "dairy", name: "Creme fraiche", unit: "200ml", viennaBillaCurso: 1.69, zurichGlobus: 2.28, zurichMigros: 1.90, amsterdamAH: 1.59 },
      { id: "dairy-11", category: "dairy", name: "Cottage cheese", unit: "200g", viennaBillaCurso: 1.89, zurichGlobus: 2.66, zurichMigros: 2.19, amsterdamAH: 1.79 },
    ],
  },
  {
    id: "bread",
    name: "Bread & Bakery",
    icon: "Croissant",
    items: [
      { id: "bread-01", category: "bread", name: "Sourdough loaf", unit: "each", viennaBillaCurso: 3.99, zurichGlobus: 5.70, zurichMigros: 4.28, amsterdamAH: 3.49 },
      { id: "bread-02", category: "bread", name: "White sandwich bread", unit: "500g", viennaBillaCurso: 1.79, zurichGlobus: 2.85, zurichMigros: 2.19, amsterdamAH: 1.69 },
      { id: "bread-03", category: "bread", name: "Croissant", unit: "each", viennaBillaCurso: 1.29, zurichGlobus: 2.09, zurichMigros: 1.52, amsterdamAH: 1.19 },
      { id: "bread-04", category: "bread", name: "Pretzel / Bretzel", unit: "each", viennaBillaCurso: 0.99, zurichGlobus: 1.52, zurichMigros: 1.14, amsterdamAH: 1.29 },
      { id: "bread-05", category: "bread", name: "Whole grain bread", unit: "500g", viennaBillaCurso: 2.49, zurichGlobus: 3.80, zurichMigros: 2.85, amsterdamAH: 2.29 },
      { id: "bread-06", category: "bread", name: "Baguette", unit: "each", viennaBillaCurso: 1.69, zurichGlobus: 2.66, zurichMigros: 1.90, amsterdamAH: 1.49 },
    ],
  },
  {
    id: "meat",
    name: "Meat & Poultry",
    icon: "Drumstick",
    items: [
      { id: "meat-01", category: "meat", name: "Chicken breast", unit: "500g", viennaBillaCurso: 6.99, zurichGlobus: 11.40, zurichMigros: 9.50, amsterdamAH: 5.99 },
      { id: "meat-02", category: "meat", name: "Minced beef", unit: "500g", viennaBillaCurso: 5.99, zurichGlobus: 10.45, zurichMigros: 8.55, amsterdamAH: 5.49 },
      { id: "meat-03", category: "meat", name: "Pork schnitzel", unit: "400g", viennaBillaCurso: 5.49, zurichGlobus: 9.50, zurichMigros: 7.60, amsterdamAH: 4.99 },
      { id: "meat-04", category: "meat", name: "Salmon fillet", unit: "200g", viennaBillaCurso: 6.49, zurichGlobus: 9.50, zurichMigros: 7.60, amsterdamAH: 5.99 },
      { id: "meat-05", category: "meat", name: "Smoked salmon", unit: "100g", viennaBillaCurso: 4.99, zurichGlobus: 6.65, zurichMigros: 5.70, amsterdamAH: 4.49 },
      { id: "meat-06", category: "meat", name: "Prosciutto", unit: "100g", viennaBillaCurso: 3.99, zurichGlobus: 5.70, zurichMigros: 4.75, amsterdamAH: 3.79 },
      { id: "meat-07", category: "meat", name: "Wiener Wurstchen", unit: "6 pcs", viennaBillaCurso: 2.79, zurichGlobus: 4.28, zurichMigros: 3.33, amsterdamAH: 2.99 },
      { id: "meat-08", category: "meat", name: "Bacon", unit: "200g", viennaBillaCurso: 3.49, zurichGlobus: 5.23, zurichMigros: 4.28, amsterdamAH: 2.99 },
    ],
  },
  {
    id: "produce",
    name: "Fruits & Vegetables",
    icon: "Apple",
    items: [
      { id: "produce-01", category: "produce", name: "Bananas", unit: "1kg", viennaBillaCurso: 1.69, zurichGlobus: 2.38, zurichMigros: 1.90, amsterdamAH: 1.49 },
      { id: "produce-02", category: "produce", name: "Apples", unit: "1kg", viennaBillaCurso: 2.49, zurichGlobus: 3.80, zurichMigros: 2.85, amsterdamAH: 2.29 },
      { id: "produce-03", category: "produce", name: "Avocado", unit: "each", viennaBillaCurso: 1.99, zurichGlobus: 2.66, zurichMigros: 1.90, amsterdamAH: 1.49 },
      { id: "produce-04", category: "produce", name: "Tomatoes", unit: "500g", viennaBillaCurso: 2.29, zurichGlobus: 3.33, zurichMigros: 2.66, amsterdamAH: 1.99 },
      { id: "produce-05", category: "produce", name: "Broccoli", unit: "500g", viennaBillaCurso: 1.99, zurichGlobus: 3.33, zurichMigros: 2.47, amsterdamAH: 1.79 },
      { id: "produce-06", category: "produce", name: "Fresh spinach", unit: "200g", viennaBillaCurso: 1.99, zurichGlobus: 3.09, zurichMigros: 2.38, amsterdamAH: 1.89 },
      { id: "produce-07", category: "produce", name: "Onions", unit: "1kg", viennaBillaCurso: 1.29, zurichGlobus: 1.90, zurichMigros: 1.52, amsterdamAH: 1.19 },
      { id: "produce-08", category: "produce", name: "Potatoes", unit: "2kg", viennaBillaCurso: 2.49, zurichGlobus: 3.80, zurichMigros: 2.85, amsterdamAH: 2.29 },
      { id: "produce-09", category: "produce", name: "Bell pepper", unit: "each", viennaBillaCurso: 1.29, zurichGlobus: 1.90, zurichMigros: 1.43, amsterdamAH: 0.99 },
      { id: "produce-10", category: "produce", name: "Lemons", unit: "each", viennaBillaCurso: 0.49, zurichGlobus: 0.76, zurichMigros: 0.57, amsterdamAH: 0.45 },
      { id: "produce-11", category: "produce", name: "Blueberries", unit: "125g", viennaBillaCurso: 2.99, zurichGlobus: 4.28, zurichMigros: 3.33, amsterdamAH: 2.49 },
      { id: "produce-12", category: "produce", name: "Strawberries", unit: "250g", viennaBillaCurso: 2.99, zurichGlobus: 4.75, zurichMigros: 3.80, amsterdamAH: 2.99 },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: "Coffee",
    items: [
      { id: "bev-01", category: "beverages", name: "Still water", unit: "1.5L", viennaBillaCurso: 0.49, zurichGlobus: 1.14, zurichMigros: 0.57, amsterdamAH: 0.45 },
      { id: "bev-02", category: "beverages", name: "Sparkling water", unit: "1.5L", viennaBillaCurso: 0.69, zurichGlobus: 1.33, zurichMigros: 0.76, amsterdamAH: 0.59 },
      { id: "bev-03", category: "beverages", name: "Orange juice", unit: "1L", viennaBillaCurso: 2.49, zurichGlobus: 3.80, zurichMigros: 2.85, amsterdamAH: 2.19 },
      { id: "bev-04", category: "beverages", name: "Coca-Cola", unit: "1.5L", viennaBillaCurso: 1.99, zurichGlobus: 2.85, zurichMigros: 2.28, amsterdamAH: 1.79 },
      { id: "bev-05", category: "beverages", name: "Coffee beans (quality)", unit: "500g", viennaBillaCurso: 7.99, zurichGlobus: 11.40, zurichMigros: 8.55, amsterdamAH: 6.99 },
      { id: "bev-06", category: "beverages", name: "Green tea", unit: "20 bags", viennaBillaCurso: 2.49, zurichGlobus: 3.33, zurichMigros: 2.66, amsterdamAH: 1.99 },
      { id: "bev-07", category: "beverages", name: "Oat milk", unit: "1L", viennaBillaCurso: 1.99, zurichGlobus: 2.85, zurichMigros: 2.28, amsterdamAH: 1.89 },
      { id: "bev-08", category: "beverages", name: "Red Bull", unit: "250ml", viennaBillaCurso: 1.49, zurichGlobus: 1.90, zurichMigros: 1.71, amsterdamAH: 1.39 },
    ],
  },
  {
    id: "pantry",
    name: "Pantry & Staples",
    icon: "Wheat",
    items: [
      { id: "pantry-01", category: "pantry", name: "Olive oil (extra virgin)", unit: "500ml", viennaBillaCurso: 6.99, zurichGlobus: 9.50, zurichMigros: 7.60, amsterdamAH: 5.99 },
      { id: "pantry-02", category: "pantry", name: "Pasta (De Cecco)", unit: "500g", viennaBillaCurso: 2.19, zurichGlobus: 3.33, zurichMigros: 2.47, amsterdamAH: 1.99 },
      { id: "pantry-03", category: "pantry", name: "Basmati rice", unit: "1kg", viennaBillaCurso: 2.79, zurichGlobus: 4.28, zurichMigros: 3.33, amsterdamAH: 2.49 },
      { id: "pantry-04", category: "pantry", name: "Canned tomatoes", unit: "400g", viennaBillaCurso: 1.29, zurichGlobus: 1.90, zurichMigros: 1.43, amsterdamAH: 0.99 },
      { id: "pantry-05", category: "pantry", name: "Peanut butter", unit: "350g", viennaBillaCurso: 3.49, zurichGlobus: 4.75, zurichMigros: 3.80, amsterdamAH: 2.99 },
      { id: "pantry-06", category: "pantry", name: "Honey", unit: "500g", viennaBillaCurso: 5.99, zurichGlobus: 9.50, zurichMigros: 7.60, amsterdamAH: 4.99 },
      { id: "pantry-07", category: "pantry", name: "Nutella", unit: "400g", viennaBillaCurso: 3.99, zurichGlobus: 5.23, zurichMigros: 4.28, amsterdamAH: 3.49 },
      { id: "pantry-08", category: "pantry", name: "All-purpose flour", unit: "1kg", viennaBillaCurso: 0.99, zurichGlobus: 1.71, zurichMigros: 1.14, amsterdamAH: 0.89 },
      { id: "pantry-09", category: "pantry", name: "Sugar", unit: "1kg", viennaBillaCurso: 1.29, zurichGlobus: 1.52, zurichMigros: 1.14, amsterdamAH: 1.09 },
      { id: "pantry-10", category: "pantry", name: "Dark chocolate 70%", unit: "100g", viennaBillaCurso: 2.49, zurichGlobus: 3.33, zurichMigros: 2.85, amsterdamAH: 2.29 },
    ],
  },
  {
    id: "household",
    name: "Household & Personal Care",
    icon: "SprayCan",
    items: [
      { id: "house-01", category: "household", name: "Toilet paper", unit: "8 rolls", viennaBillaCurso: 3.99, zurichGlobus: 6.65, zurichMigros: 4.75, amsterdamAH: 3.49 },
      { id: "house-02", category: "household", name: "Paper towels", unit: "2 rolls", viennaBillaCurso: 2.49, zurichGlobus: 3.80, zurichMigros: 2.85, amsterdamAH: 2.29 },
      { id: "house-03", category: "household", name: "Dish soap", unit: "500ml", viennaBillaCurso: 1.99, zurichGlobus: 3.33, zurichMigros: 2.47, amsterdamAH: 1.79 },
      { id: "house-04", category: "household", name: "Laundry detergent", unit: "1L", viennaBillaCurso: 4.99, zurichGlobus: 7.60, zurichMigros: 5.70, amsterdamAH: 4.49 },
      { id: "house-05", category: "household", name: "Shampoo", unit: "250ml", viennaBillaCurso: 3.49, zurichGlobus: 4.75, zurichMigros: 3.80, amsterdamAH: 3.29 },
      { id: "house-06", category: "household", name: "Toothpaste", unit: "75ml", viennaBillaCurso: 2.49, zurichGlobus: 3.33, zurichMigros: 2.85, amsterdamAH: 2.29 },
      { id: "house-07", category: "household", name: "Deodorant", unit: "each", viennaBillaCurso: 3.29, zurichGlobus: 4.75, zurichMigros: 3.80, amsterdamAH: 2.99 },
      { id: "house-08", category: "household", name: "Hand soap", unit: "250ml", viennaBillaCurso: 1.79, zurichGlobus: 2.85, zurichMigros: 2.19, amsterdamAH: 1.59 },
    ],
  },
  {
    id: "snacks",
    name: "Snacks",
    icon: "Cookie",
    items: [
      { id: "snack-01", category: "snacks", name: "Potato chips", unit: "175g", viennaBillaCurso: 2.49, zurichGlobus: 3.80, zurichMigros: 2.85, amsterdamAH: 1.99 },
      { id: "snack-02", category: "snacks", name: "Mixed nuts", unit: "200g", viennaBillaCurso: 3.99, zurichGlobus: 5.70, zurichMigros: 4.28, amsterdamAH: 3.49 },
      { id: "snack-03", category: "snacks", name: "Granola bars", unit: "pack", viennaBillaCurso: 2.99, zurichGlobus: 4.28, zurichMigros: 3.33, amsterdamAH: 2.69 },
      { id: "snack-04", category: "snacks", name: "Hummus", unit: "200g", viennaBillaCurso: 1.99, zurichGlobus: 3.33, zurichMigros: 2.66, amsterdamAH: 1.79 },
      { id: "snack-05", category: "snacks", name: "Olives", unit: "200g", viennaBillaCurso: 2.49, zurichGlobus: 3.80, zurichMigros: 2.85, amsterdamAH: 2.29 },
    ],
  },
  {
    id: "ready",
    name: "Ready Meals & Deli",
    icon: "ChefHat",
    items: [
      { id: "ready-01", category: "ready", name: "Fresh pizza (refrigerated)", unit: "each", viennaBillaCurso: 3.99, zurichGlobus: 7.60, zurichMigros: 5.70, amsterdamAH: 3.99 },
      { id: "ready-02", category: "ready", name: "Sushi set", unit: "8-10 pcs", viennaBillaCurso: 8.99, zurichGlobus: 14.25, zurichMigros: 11.40, amsterdamAH: 7.99 },
      { id: "ready-03", category: "ready", name: "Pre-made sandwich", unit: "each", viennaBillaCurso: 3.49, zurichGlobus: 6.18, zurichMigros: 4.75, amsterdamAH: 3.29 },
      { id: "ready-04", category: "ready", name: "Fresh pasta sauce", unit: "300g", viennaBillaCurso: 2.99, zurichGlobus: 4.75, zurichMigros: 3.80, amsterdamAH: 2.69 },
      { id: "ready-05", category: "ready", name: "Pre-made salad bowl", unit: "each", viennaBillaCurso: 3.99, zurichGlobus: 7.60, zurichMigros: 5.70, amsterdamAH: 3.79 },
    ],
  },
  {
    id: "alcohol",
    name: "Alcohol",
    icon: "Wine",
    items: [
      { id: "alc-01", category: "alcohol", name: "Beer (local brand)", unit: "500ml", viennaBillaCurso: 1.29, zurichGlobus: 1.90, zurichMigros: 1.52, amsterdamAH: 1.19 },
      { id: "alc-02", category: "alcohol", name: "Table wine (decent)", unit: "750ml", viennaBillaCurso: 5.99, zurichGlobus: 9.50, zurichMigros: 7.60, amsterdamAH: 5.49 },
      { id: "alc-03", category: "alcohol", name: "Prosecco", unit: "750ml", viennaBillaCurso: 6.99, zurichGlobus: 10.45, zurichMigros: 8.55, amsterdamAH: 6.49 },
      { id: "alc-04", category: "alcohol", name: "Gin (Hendrick's equiv.)", unit: "700ml", viennaBillaCurso: 29.99, zurichGlobus: 38.00, zurichMigros: 33.25, amsterdamAH: 27.99 },
      { id: "alc-05", category: "alcohol", name: "Craft IPA", unit: "330ml", viennaBillaCurso: 2.99, zurichGlobus: 3.80, zurichMigros: 3.33, amsterdamAH: 2.69 },
    ],
  },
  {
    id: "dining",
    name: "Dining Out Reference",
    icon: "UtensilsCrossed",
    items: [
      { id: "dining-01", category: "dining", name: "Espresso (cafe)", unit: "each", viennaBillaCurso: 2.80, zurichGlobus: 4.28, zurichMigros: 4.28, amsterdamAH: 2.90 },
      { id: "dining-02", category: "dining", name: "Cappuccino (cafe)", unit: "each", viennaBillaCurso: 3.80, zurichGlobus: 5.70, zurichMigros: 5.70, amsterdamAH: 3.50 },
      { id: "dining-03", category: "dining", name: "Draft beer 500ml (pub)", unit: "each", viennaBillaCurso: 4.50, zurichGlobus: 7.60, zurichMigros: 7.60, amsterdamAH: 5.50 },
      { id: "dining-04", category: "dining", name: "Lunch menu (casual)", unit: "each", viennaBillaCurso: 12.90, zurichGlobus: 22.80, zurichMigros: 22.80, amsterdamAH: 14.90 },
      { id: "dining-05", category: "dining", name: "Dinner main (mid-range)", unit: "each", viennaBillaCurso: 18.90, zurichGlobus: 33.25, zurichMigros: 33.25, amsterdamAH: 21.90 },
    ],
  },
];

/** Return the store key with the lowest price for a given item */
export function getCheapestStore(item: PriceItem): StoreKey {
  let cheapest: StoreKey = "viennaBillaCurso";
  let minPrice = item.viennaBillaCurso;
  for (const key of STORE_KEYS) {
    if (item[key] < minPrice) {
      minPrice = item[key];
      cheapest = key;
    }
  }
  return cheapest;
}

/** Return the store key with the highest price for a given item */
export function getMostExpensiveStore(item: PriceItem): StoreKey {
  let expensive: StoreKey = "viennaBillaCurso";
  let maxPrice = item.viennaBillaCurso;
  for (const key of STORE_KEYS) {
    if (item[key] > maxPrice) {
      maxPrice = item[key];
      expensive = key;
    }
  }
  return expensive;
}

/** Compute average price per store for a category */
export function getCategoryAverages(
  category: PriceCategory
): Record<StoreKey, number> {
  const sums: Record<StoreKey, number> = {
    viennaBillaCurso: 0,
    zurichGlobus: 0,
    zurichMigros: 0,
    amsterdamAH: 0,
  };
  for (const item of category.items) {
    for (const key of STORE_KEYS) {
      sums[key] += item[key];
    }
  }
  const n = category.items.length;
  return {
    viennaBillaCurso: sums.viennaBillaCurso / n,
    zurichGlobus: sums.zurichGlobus / n,
    zurichMigros: sums.zurichMigros / n,
    amsterdamAH: sums.amsterdamAH / n,
  };
}

/** Compute total cost of all items in a category per store */
export function getCategoryTotals(
  category: PriceCategory
): Record<StoreKey, number> {
  const sums: Record<StoreKey, number> = {
    viennaBillaCurso: 0,
    zurichGlobus: 0,
    zurichMigros: 0,
    amsterdamAH: 0,
  };
  for (const item of category.items) {
    for (const key of STORE_KEYS) {
      sums[key] += item[key];
    }
  }
  return sums;
}

// ─── Monthly Basket Estimate ───────────────────────────────────────────────

export interface BasketItem {
  name: string;
  unit: string;
  quantity: number; // how many times per month
  subtotal: number;
}

export interface BasketEstimate {
  store: StoreKey;
  label: string;
  city: string;
  monthlyTotal: number;
  items: BasketItem[];
}

/**
 * Monthly grocery basket for a single professional.
 * Based on realistic consumption: cooking 4-5 times/week, eating out 2-3 times,
 * coffee daily, modest alcohol, standard household supplies.
 */
const BASKET_QUANTITIES: { itemId: string; qtyPerMonth: number }[] = [
  // Dairy
  { itemId: "dairy-01", qtyPerMonth: 8 },    // 8L milk
  { itemId: "dairy-03", qtyPerMonth: 2 },    // 2x butter
  { itemId: "dairy-04", qtyPerMonth: 3 },    // 30 eggs
  { itemId: "dairy-05", qtyPerMonth: 6 },    // 6 yogurts
  { itemId: "dairy-06", qtyPerMonth: 2 },    // cheese
  { itemId: "dairy-09", qtyPerMonth: 1 },    // parmesan
  // Bread
  { itemId: "bread-01", qtyPerMonth: 3 },    // 3 loaves
  { itemId: "bread-03", qtyPerMonth: 4 },    // weekend croissants
  // Meat
  { itemId: "meat-01", qtyPerMonth: 4 },     // 2kg chicken
  { itemId: "meat-02", qtyPerMonth: 2 },     // 1kg mince
  { itemId: "meat-04", qtyPerMonth: 3 },     // salmon
  { itemId: "meat-08", qtyPerMonth: 2 },     // bacon
  // Produce
  { itemId: "produce-01", qtyPerMonth: 2 },  // 2kg bananas
  { itemId: "produce-02", qtyPerMonth: 2 },  // 2kg apples
  { itemId: "produce-03", qtyPerMonth: 4 },  // 4 avocados
  { itemId: "produce-04", qtyPerMonth: 4 },  // 2kg tomatoes
  { itemId: "produce-05", qtyPerMonth: 3 },  // broccoli
  { itemId: "produce-06", qtyPerMonth: 3 },  // spinach
  { itemId: "produce-07", qtyPerMonth: 1 },  // onions
  { itemId: "produce-08", qtyPerMonth: 1 },  // potatoes
  { itemId: "produce-09", qtyPerMonth: 4 },  // bell peppers
  { itemId: "produce-10", qtyPerMonth: 4 },  // lemons
  // Beverages
  { itemId: "bev-01", qtyPerMonth: 4 },      // 6L water
  { itemId: "bev-02", qtyPerMonth: 4 },      // sparkling
  { itemId: "bev-03", qtyPerMonth: 3 },      // OJ
  { itemId: "bev-05", qtyPerMonth: 2 },      // coffee beans 1kg
  { itemId: "bev-07", qtyPerMonth: 3 },      // oat milk
  { itemId: "bev-08", qtyPerMonth: 4 },      // red bull
  // Pantry
  { itemId: "pantry-01", qtyPerMonth: 1 },   // olive oil
  { itemId: "pantry-02", qtyPerMonth: 3 },   // pasta
  { itemId: "pantry-03", qtyPerMonth: 1 },   // rice
  { itemId: "pantry-04", qtyPerMonth: 3 },   // canned tomatoes
  { itemId: "pantry-05", qtyPerMonth: 1 },   // peanut butter
  { itemId: "pantry-10", qtyPerMonth: 2 },   // chocolate
  // Household (amortized monthly)
  { itemId: "house-01", qtyPerMonth: 1 },    // toilet paper
  { itemId: "house-02", qtyPerMonth: 1 },    // paper towels
  { itemId: "house-03", qtyPerMonth: 0.5 },  // dish soap
  { itemId: "house-04", qtyPerMonth: 0.5 },  // laundry
  { itemId: "house-05", qtyPerMonth: 0.5 },  // shampoo
  { itemId: "house-06", qtyPerMonth: 0.5 },  // toothpaste
  // Snacks
  { itemId: "snack-01", qtyPerMonth: 2 },    // chips
  { itemId: "snack-02", qtyPerMonth: 2 },    // nuts
  { itemId: "snack-04", qtyPerMonth: 3 },    // hummus
  // Ready meals
  { itemId: "ready-01", qtyPerMonth: 2 },    // pizza
  { itemId: "ready-05", qtyPerMonth: 2 },    // salad
  // Alcohol
  { itemId: "alc-01", qtyPerMonth: 6 },      // 6 beers
  { itemId: "alc-02", qtyPerMonth: 2 },      // 2 bottles wine
  { itemId: "alc-05", qtyPerMonth: 2 },      // craft IPAs
];

function findItem(id: string): PriceItem | undefined {
  for (const cat of PRICE_CATEGORIES) {
    const item = cat.items.find((i) => i.id === id);
    if (item) return item;
  }
  return undefined;
}

export function getMonthlyBasketEstimate(): BasketEstimate[] {
  const estimates: BasketEstimate[] = STORE_KEYS.map((key) => ({
    store: key,
    label: STORE_LABELS[key].name,
    city: STORE_LABELS[key].city,
    monthlyTotal: 0,
    items: [],
  }));

  for (const bq of BASKET_QUANTITIES) {
    const item = findItem(bq.itemId);
    if (!item) continue;

    for (const est of estimates) {
      const price = item[est.store];
      const subtotal = price * bq.qtyPerMonth;
      est.items.push({
        name: item.name,
        unit: item.unit,
        quantity: bq.qtyPerMonth,
        subtotal,
      });
      est.monthlyTotal += subtotal;
    }
  }

  return estimates;
}

/** Count how many items each store is cheapest for */
export function getCheapestWinCounts(): Record<StoreKey, number> {
  const counts: Record<StoreKey, number> = {
    viennaBillaCurso: 0,
    zurichGlobus: 0,
    zurichMigros: 0,
    amsterdamAH: 0,
  };
  for (const cat of PRICE_CATEGORIES) {
    for (const item of cat.items) {
      counts[getCheapestStore(item)]++;
    }
  }
  return counts;
}

/** Compute overall average markup of each store vs the cheapest store (Amsterdam/Vienna) */
export function getOverallMarkup(): Record<StoreKey, number> {
  let totalVienna = 0;
  let totalGlobus = 0;
  let totalMigros = 0;
  let totalAH = 0;
  let count = 0;

  for (const cat of PRICE_CATEGORIES) {
    // Skip dining out from grocery markup calculation
    if (cat.id === "dining") continue;
    for (const item of cat.items) {
      totalVienna += item.viennaBillaCurso;
      totalGlobus += item.zurichGlobus;
      totalMigros += item.zurichMigros;
      totalAH += item.amsterdamAH;
      count++;
    }
  }

  const baseline = totalAH; // Amsterdam is generally cheapest
  return {
    viennaBillaCurso: ((totalVienna - baseline) / baseline) * 100,
    zurichGlobus: ((totalGlobus - baseline) / baseline) * 100,
    zurichMigros: ((totalMigros - baseline) / baseline) * 100,
    amsterdamAH: 0,
  };
}
