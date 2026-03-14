import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { router, protectedProcedure } from "../trpc";
import { languageCardStates, userLanguageMeta } from "../db/schema";

export const languageRouter = router({
  getCardStates: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(languageCardStates)
      .where(eq(languageCardStates.userId, ctx.userId));
  }),

  getMeta: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userLanguageMeta)
      .where(eq(userLanguageMeta.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsertCard: protectedProcedure
    .input(
      z.object({
        phraseId: z.string(),
        easeFactor: z.number(),
        interval: z.number().int(),
        repetitions: z.number().int(),
        nextReview: z.string(),
        lastReview: z.string().nullable().optional(),
        lastQuality: z.number().int().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if card state already exists for this user+phrase combo
      const existingRows = await ctx.db
        .select()
        .from(languageCardStates)
        .where(
          and(
            eq(languageCardStates.userId, ctx.userId),
            eq(languageCardStates.phraseId, input.phraseId),
          ),
        )
        .limit(1);
      const existing = existingRows[0];

      if (existing) {
        const { phraseId: _, ...updateFields } = input;
        await ctx.db
          .update(languageCardStates)
          .set(updateFields)
          .where(eq(languageCardStates.id, existing.id));
        const updatedRows = await ctx.db
          .select()
          .from(languageCardStates)
          .where(eq(languageCardStates.id, existing.id))
          .limit(1);
        return updatedRows[0]!;
      }

      const id = nanoid();
      await ctx.db.insert(languageCardStates).values({
        id,
        userId: ctx.userId,
        phraseId: input.phraseId,
        easeFactor: input.easeFactor,
        interval: input.interval,
        repetitions: input.repetitions,
        nextReview: input.nextReview,
        lastReview: input.lastReview ?? null,
        lastQuality: input.lastQuality ?? null,
      });
      const rows = await ctx.db
        .select()
        .from(languageCardStates)
        .where(eq(languageCardStates.id, id))
        .limit(1);
      return rows[0]!;
    }),

  upsertMeta: protectedProcedure
    .input(
      z.object({
        reviewStreak: z.number().int(),
        lastReviewDate: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(userLanguageMeta)
        .values({
          userId: ctx.userId,
          reviewStreak: input.reviewStreak,
          lastReviewDate: input.lastReviewDate,
        })
        .onConflictDoUpdate({
          target: userLanguageMeta.userId,
          set: { ...input, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
