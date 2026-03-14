import { z } from "zod";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { router, protectedProcedure } from "../trpc";
import { chatMessages } from "../db/schema";

export const chatRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, ctx.userId));
  }),

  create: protectedProcedure
    .input(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await ctx.db.insert(chatMessages).values({
        id,
        userId: ctx.userId,
        role: input.role,
        content: input.content,
      });
      const rows = await ctx.db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.id, id))
        .limit(1);
      return rows[0]!;
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .delete(chatMessages)
      .where(eq(chatMessages.userId, ctx.userId));
    return { success: true };
  }),
});
