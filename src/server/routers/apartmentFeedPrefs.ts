import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { userApartmentFeedPrefs } from "../db/schema";
import { DismissedIdsSchema, FeedFiltersSchema } from "../schemas";

export const apartmentFeedPrefsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userApartmentFeedPrefs)
      .where(eq(userApartmentFeedPrefs.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        dismissedIdsJson: DismissedIdsSchema,
        filtersJson: FeedFiltersSchema,
        sortKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(userApartmentFeedPrefs)
        .values({ userId: ctx.userId, ...input })
        .onConflictDoUpdate({
          target: userApartmentFeedPrefs.userId,
          set: { ...input, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
