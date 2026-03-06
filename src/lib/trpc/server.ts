import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { db } from "@/lib/db";

export const createTRPCContext = () => {
  return { db };
};

export type TRPCContext = ReturnType<typeof createTRPCContext>;

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
