import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { userPriorityConfig } from "../db/schema";

export const priorityRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userPriorityConfig)
      .where(eq(userPriorityConfig.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        weightsJson: z.unknown(),
        profilesJson: z.unknown(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(userPriorityConfig)
        .values({ userId: ctx.userId, ...input })
        .onConflictDoUpdate({
          target: userPriorityConfig.userId,
          set: { ...input, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
