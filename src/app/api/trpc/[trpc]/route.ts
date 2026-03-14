import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";

const handler = async (req: Request) => {
  // Get session from auth() within the Next.js route handler context
  const session = await auth();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ session, db }),
  });
};

export { handler as GET, handler as POST };
