import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { router, protectedProcedure } from "../trpc";
import { katieVisits } from "../db/schema";
import { TRPCError } from "@trpc/server";

export const katieRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(katieVisits)
      .where(eq(katieVisits.userId, ctx.userId));
  }),

  create: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
        transportMode: z.string().optional(),
        notes: z.string().nullable().optional(),
        isConfirmed: z.boolean().optional(),
        isSpecial: z.boolean().optional(),
        specialLabel: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await ctx.db.insert(katieVisits).values({
        id,
        userId: ctx.userId,
        startDate: input.startDate,
        endDate: input.endDate,
        transportMode: input.transportMode ?? "flight",
        notes: input.notes ?? null,
        isConfirmed: input.isConfirmed ?? false,
        isSpecial: input.isSpecial ?? false,
        specialLabel: input.specialLabel ?? null,
      });
      const rows = await ctx.db
        .select()
        .from(katieVisits)
        .where(eq(katieVisits.id, id))
        .limit(1);
      return rows[0]!;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        transportMode: z.string().optional(),
        notes: z.string().nullable().optional(),
        isConfirmed: z.boolean().optional(),
        isSpecial: z.boolean().optional(),
        specialLabel: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;

      const existingRows = await ctx.db
        .select()
        .from(katieVisits)
        .where(and(eq(katieVisits.id, id), eq(katieVisits.userId, ctx.userId)))
        .limit(1);

      if (!existingRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Visit not found" });
      }

      await ctx.db
        .update(katieVisits)
        .set({ ...fields, updatedAt: new Date() })
        .where(and(eq(katieVisits.id, id), eq(katieVisits.userId, ctx.userId)));

      const updatedRows = await ctx.db
        .select()
        .from(katieVisits)
        .where(eq(katieVisits.id, id))
        .limit(1);
      return updatedRows[0]!;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingRows = await ctx.db
        .select()
        .from(katieVisits)
        .where(and(eq(katieVisits.id, input.id), eq(katieVisits.userId, ctx.userId)))
        .limit(1);

      if (!existingRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Visit not found" });
      }

      await ctx.db
        .delete(katieVisits)
        .where(and(eq(katieVisits.id, input.id), eq(katieVisits.userId, ctx.userId)));

      return { success: true };
    }),
});
