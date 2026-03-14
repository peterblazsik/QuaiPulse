import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { router, protectedProcedure } from "../trpc";
import { sleepEntries } from "../db/schema";
import { TRPCError } from "@trpc/server";

export const sleepRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(sleepEntries)
      .where(eq(sleepEntries.userId, ctx.userId));
  }),

  create: protectedProcedure
    .input(
      z.object({
        date: z.string(),
        hours: z.number(),
        quality: z.number().int().min(1).max(5),
        location: z.string().optional(),
        supplementsJson: z.array(z.string()).optional(),
        interventionsJson: z.array(z.string()).optional(),
        bedtime: z.string().nullable().optional(),
        waketime: z.string().nullable().optional(),
        sleepLatency: z.number().int().nullable().optional(),
        awakenings: z.number().int().nullable().optional(),
        notes: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await ctx.db.insert(sleepEntries).values({
        id,
        userId: ctx.userId,
        date: input.date,
        hours: input.hours,
        quality: input.quality,
        location: input.location ?? "zurich",
        supplementsJson: input.supplementsJson ?? [],
        interventionsJson: input.interventionsJson ?? [],
        bedtime: input.bedtime ?? null,
        waketime: input.waketime ?? null,
        sleepLatency: input.sleepLatency ?? null,
        awakenings: input.awakenings ?? null,
        notes: input.notes ?? null,
      });
      const rows = await ctx.db
        .select()
        .from(sleepEntries)
        .where(eq(sleepEntries.id, id))
        .limit(1);
      return rows[0]!;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.string().optional(),
        hours: z.number().optional(),
        quality: z.number().int().min(1).max(5).optional(),
        location: z.string().optional(),
        supplementsJson: z.array(z.string()).optional(),
        interventionsJson: z.array(z.string()).optional(),
        bedtime: z.string().nullable().optional(),
        waketime: z.string().nullable().optional(),
        sleepLatency: z.number().int().nullable().optional(),
        awakenings: z.number().int().nullable().optional(),
        notes: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;

      const existingRows = await ctx.db
        .select()
        .from(sleepEntries)
        .where(and(eq(sleepEntries.id, id), eq(sleepEntries.userId, ctx.userId)))
        .limit(1);

      if (!existingRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Sleep entry not found" });
      }

      await ctx.db
        .update(sleepEntries)
        .set(fields)
        .where(and(eq(sleepEntries.id, id), eq(sleepEntries.userId, ctx.userId)));

      const updatedRows = await ctx.db
        .select()
        .from(sleepEntries)
        .where(eq(sleepEntries.id, id))
        .limit(1);
      return updatedRows[0]!;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingRows = await ctx.db
        .select()
        .from(sleepEntries)
        .where(and(eq(sleepEntries.id, input.id), eq(sleepEntries.userId, ctx.userId)))
        .limit(1);

      if (!existingRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Sleep entry not found" });
      }

      await ctx.db
        .delete(sleepEntries)
        .where(and(eq(sleepEntries.id, input.id), eq(sleepEntries.userId, ctx.userId)));

      return { success: true };
    }),
});
