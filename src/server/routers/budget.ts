import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { userBudgetConfig } from "../db/schema";
import { BudgetValuesSchema } from "../schemas";

export const budgetRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userBudgetConfig)
      .where(eq(userBudgetConfig.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        grossMonthlySalary: z.number(),
        has13thSalary: z.boolean(),
        annualBonusPct: z.number(),
        expenseAllowance: z.number(),
        employerInsuranceContrib: z.number(),
        mobilityAllowance: z.number(),
        relocationBonus: z.number(),
        bvgMonthly: z.number(),
        pillar3aMonthly: z.number(),
        taxLocationId: z.string(),
        viennaRent: z.number(),
        childSupport: z.number(),
        viennaUtils: z.number(),
        carInsurance: z.number(),
        valuesJson: BudgetValuesSchema,
        setupCostsJson: z.record(z.string(), z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(userBudgetConfig)
        .values({ userId: ctx.userId, ...input })
        .onConflictDoUpdate({
          target: userBudgetConfig.userId,
          set: { ...input, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
