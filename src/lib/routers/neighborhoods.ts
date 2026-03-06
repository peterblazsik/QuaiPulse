import { router, publicProcedure } from "@/lib/trpc/server";
import { neighborhoods } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

export const neighborhoodsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(neighborhoods);
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(neighborhoods)
        .where(eq(neighborhoods.slug, input.slug));
      return result[0] ?? null;
    }),
});
