import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { userProfile } from "../db/schema";

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, ctx.userId))
      .limit(1);
    return rows[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
        originCity: z.string().optional(),
        originCountry: z.string().optional(),
        destinationCity: z.string().optional(),
        moveDate: z.string().nullable().optional(),
        employerName: z.string().optional(),
        officeName: z.string().optional(),
        officeAddress: z.string().optional(),
        officeLat: z.number().nullable().optional(),
        officeLng: z.number().nullable().optional(),
        jobTitle: z.string().optional(),
        hasChildren: z.boolean().optional(),
        childName: z.string().nullable().optional(),
        childAge: z.number().int().nullable().optional(),
        childCity: z.string().nullable().optional(),
        childCountry: z.string().nullable().optional(),
        grossMonthlySalary: z.number().nullable().optional(),
        has13thSalary: z.boolean().optional(),
        targetRentMin: z.number().nullable().optional(),
        targetRentMax: z.number().nullable().optional(),
        healthNotes: z.string().nullable().optional(),
        primaryLanguages: z.string().optional(),
        germanLevel: z.string().optional(),
        onboardingComplete: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Build only the fields that were actually provided
      const fields: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(input)) {
        if (value !== undefined) {
          fields[key] = value;
        }
      }

      await ctx.db
        .insert(userProfile)
        .values({ userId: ctx.userId, ...fields })
        .onConflictDoUpdate({
          target: userProfile.userId,
          set: { ...fields, updatedAt: new Date() },
        });

      const rows = await ctx.db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, ctx.userId))
        .limit(1);
      return rows[0]!;
    }),
});
