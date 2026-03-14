import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { headers } from "next/headers";

const handler = async (req: Request) => {
  // Force Next.js to treat this as a dynamic route by reading headers
  await headers();
  const session = await auth();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ session, db }),
  });
};

export const dynamic = "force-dynamic";

export { handler as GET, handler as POST };
