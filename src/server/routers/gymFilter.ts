import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { userGymFilterState } from "../db/schema";
import { GymFilterSchema } from "../schemas";

export const gymFilterRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userGymFilterState)
      .where(eq(userGymFilterState.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        stateJson: GymFilterSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(userGymFilterState)
        .values({ userId: ctx.userId, ...input })
        .onConflictDoUpdate({
          target: userGymFilterState.userId,
          set: { ...input, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
