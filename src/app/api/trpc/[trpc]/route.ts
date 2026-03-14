import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { headers } from "next/headers";

const handler = async (req: Request) => {
  await headers();
  const session = await auth();

  // Debug log to help diagnose 401s
  console.log("[tRPC] session:", JSON.stringify({
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
    name: session?.user?.name,
  }));

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ session, db }),
  });
};

export const dynamic = "force-dynamic";

export { handler as GET, handler as POST };
