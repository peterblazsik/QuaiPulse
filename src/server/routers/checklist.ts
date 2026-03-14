import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { userChecklistState } from "../db/schema";

export const checklistRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userChecklistState)
      .where(eq(userChecklistState.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        completedIdsJson: z.unknown(),
        customItemsJson: z.unknown(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(userChecklistState)
        .values({ userId: ctx.userId, ...input })
        .onConflictDoUpdate({
          target: userChecklistState.userId,
          set: { ...input, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
