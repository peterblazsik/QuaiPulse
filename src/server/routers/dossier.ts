import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { userDossierState } from "../db/schema";

export const dossierRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userDossierState)
      .where(eq(userDossierState.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        statusesJson: z.unknown(),
        notesJson: z.unknown(),
        urlsJson: z.unknown(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(userDossierState)
        .values({ userId: ctx.userId, ...input })
        .onConflictDoUpdate({
          target: userDossierState.userId,
          set: { ...input, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
