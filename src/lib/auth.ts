import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    signIn({ profile }) {
      const allowed = process.env.ALLOWED_EMAIL;
      if (!allowed) return false;
      return profile?.email === allowed;
    },
    async jwt({ token, profile, trigger }) {
      // On sign-in, upsert user in DB and store userId in token
      if ((trigger === "signIn" || trigger === "signUp") && profile?.email) {
        try {
          const rows = await db
            .select()
            .from(users)
            .where(eq(users.email, profile.email))
            .limit(1);
          const existing = rows[0];

          if (existing) {
            token.userId = existing.id;
            await db
              .update(users)
              .set({
                name: profile.name ?? existing.name,
                image: (profile as Record<string, unknown>).picture as string ?? existing.image,
                updatedAt: new Date(),
              })
              .where(eq(users.id, existing.id));
          } else {
            const id = nanoid();
            await db.insert(users).values({
              id,
              email: profile.email,
              name: profile.name ?? null,
              image: (profile as Record<string, unknown>).picture as string ?? null,
            });
            token.userId = id;
          }
          if (process.env.NODE_ENV === "development") {
            console.log("[auth] jwt callback: userId set to", token.userId);
          }
        } catch (err) {
          console.error("[auth] jwt callback DB error:", err);
          // Still allow sign-in even if DB fails — use email as fallback id
          token.userId = `oauth_${token.sub}`;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // Use userId from our DB, or fall back to token.sub (OAuth provider ID)
        session.user.id = (token.userId as string) ?? token.sub ?? "";
      }
      return session;
    },
  },
});
