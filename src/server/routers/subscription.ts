import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { userSubscriptionState } from "../db/schema";
import { DecisionsSchema, CustomSubsSchema } from "../schemas";

export const subscriptionRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userSubscriptionState)
      .where(eq(userSubscriptionState.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        decisionsJson: DecisionsSchema,
        customSubsJson: CustomSubsSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(userSubscriptionState)
        .values({ userId: ctx.userId, ...input })
        .onConflictDoUpdate({
          target: userSubscriptionState.userId,
          set: { ...input, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
