import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { router, protectedProcedure } from "../trpc";
import { savedApartments, apartmentInteractions } from "../db/schema";
import { TRPCError } from "@trpc/server";

export const apartmentsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const apartments = await ctx.db
      .select()
      .from(savedApartments)
      .where(eq(savedApartments.userId, ctx.userId));

    // Eager-load interactions for all apartments
    const interactions = await ctx.db
      .select()
      .from(apartmentInteractions)
      .where(eq(apartmentInteractions.userId, ctx.userId));

    const interactionsByApt = new Map<string, typeof interactions>();
    for (const interaction of interactions) {
      const existing = interactionsByApt.get(interaction.apartmentId) ?? [];
      existing.push(interaction);
      interactionsByApt.set(interaction.apartmentId, existing);
    }

    return apartments.map((apt) => ({
      ...apt,
      interactions: interactionsByApt.get(apt.id) ?? [],
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        address: z.string().optional(),
        kreis: z.number().int().optional(),
        rent: z.number().optional(),
        rooms: z.number().optional(),
        sqm: z.number().optional(),
        sourceUrl: z.string().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await ctx.db.insert(savedApartments).values({
        id,
        userId: ctx.userId,
        title: input.title,
        address: input.address ?? "",
        kreis: input.kreis ?? 0,
        rent: input.rent ?? 0,
        rooms: input.rooms ?? 0,
        sqm: input.sqm ?? 0,
        sourceUrl: input.sourceUrl ?? "",
        status: input.status ?? "new",
        notes: input.notes ?? "",
      });
      const rows = await ctx.db
        .select()
        .from(savedApartments)
        .where(eq(savedApartments.id, id))
        .limit(1);
      return rows[0]!;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        address: z.string().optional(),
        kreis: z.number().int().optional(),
        rent: z.number().optional(),
        rooms: z.number().optional(),
        sqm: z.number().optional(),
        sourceUrl: z.string().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;

      // Verify ownership
      const existingRows = await ctx.db
        .select()
        .from(savedApartments)
        .where(and(eq(savedApartments.id, id), eq(savedApartments.userId, ctx.userId)))
        .limit(1);

      if (!existingRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Apartment not found" });
      }

      await ctx.db
        .update(savedApartments)
        .set({ ...fields, updatedAt: new Date() })
        .where(and(eq(savedApartments.id, id), eq(savedApartments.userId, ctx.userId)));

      const updatedRows = await ctx.db
        .select()
        .from(savedApartments)
        .where(eq(savedApartments.id, id))
        .limit(1);
      return updatedRows[0]!;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingRows = await ctx.db
        .select()
        .from(savedApartments)
        .where(and(eq(savedApartments.id, input.id), eq(savedApartments.userId, ctx.userId)))
        .limit(1);

      if (!existingRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Apartment not found" });
      }

      // Cascade handles interactions via FK, but explicit delete for safety
      await ctx.db
        .delete(apartmentInteractions)
        .where(eq(apartmentInteractions.apartmentId, input.id));
      await ctx.db
        .delete(savedApartments)
        .where(and(eq(savedApartments.id, input.id), eq(savedApartments.userId, ctx.userId)));

      return { success: true };
    }),

  addInteraction: protectedProcedure
    .input(
      z.object({
        apartmentId: z.string(),
        type: z.string(),
        date: z.string(),
        summary: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify apartment ownership
      const aptRows = await ctx.db
        .select()
        .from(savedApartments)
        .where(
          and(eq(savedApartments.id, input.apartmentId), eq(savedApartments.userId, ctx.userId)),
        )
        .limit(1);

      if (!aptRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Apartment not found" });
      }

      const id = nanoid();
      await ctx.db.insert(apartmentInteractions).values({
        id,
        apartmentId: input.apartmentId,
        userId: ctx.userId,
        type: input.type,
        date: input.date,
        summary: input.summary ?? "",
      });

      const rows = await ctx.db
        .select()
        .from(apartmentInteractions)
        .where(eq(apartmentInteractions.id, id))
        .limit(1);
      return rows[0]!;
    }),

  removeInteraction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingRows = await ctx.db
        .select()
        .from(apartmentInteractions)
        .where(
          and(
            eq(apartmentInteractions.id, input.id),
            eq(apartmentInteractions.userId, ctx.userId),
          ),
        )
        .limit(1);

      if (!existingRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Interaction not found" });
      }

      await ctx.db
        .delete(apartmentInteractions)
        .where(
          and(
            eq(apartmentInteractions.id, input.id),
            eq(apartmentInteractions.userId, ctx.userId),
          ),
        );

      return { success: true };
    }),
});
