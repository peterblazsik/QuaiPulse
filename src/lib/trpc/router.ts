import { router } from "./server";
import { neighborhoodsRouter } from "@/lib/routers/neighborhoods";
import { budgetRouter } from "@/lib/routers/budget";

export const appRouter = router({
  neighborhoods: neighborhoodsRouter,
  budget: budgetRouter,
});

export type AppRouter = typeof appRouter;
