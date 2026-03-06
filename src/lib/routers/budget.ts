import { router, publicProcedure } from "@/lib/trpc/server";
import { budgetScenarios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

export const budgetRouter = router({
  listScenarios: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(budgetScenarios);
  }),

  getScenario: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(budgetScenarios)
        .where(eq(budgetScenarios.id, input.id));
      return result[0] ?? null;
    }),
});
