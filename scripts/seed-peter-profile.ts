/**
 * Run with: npx tsx scripts/seed-peter-profile.ts
 * Seeds Peter Blazsik's profile so his data is preserved during multi-user migration.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/server/db/schema";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  // Find Peter's user record
  const users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, "peterblazsik@gmail.com"))
    .limit(1);

  if (users.length === 0) {
    console.log("Peter's user record not found. Sign in first, then re-run.");
    return;
  }

  const userId = users[0].id;

  await db
    .insert(schema.userProfile)
    .values({
      userId,
      displayName: "Peter Blazsik",
      originCity: "Amsterdam",
      originCountry: "Netherlands",
      destinationCity: "Zurich",
      moveDate: "2026-07-01",
      employerName: "Zurich Insurance Group",
      officeName: "Quai Zurich Campus",
      officeAddress: "Mythenquai 2, 8002 Zürich",
      officeLat: 47.3629,
      officeLng: 8.5318,
      jobTitle: "Finance AI & Innovation Lead",
      hasChildren: true,
      childName: "Katie",
      childAge: 9,
      childCity: "Vienna",
      childCountry: "Austria",
      grossMonthlySalary: 15000,
      has13thSalary: true,
      targetRentMin: 2000,
      targetRentMax: 2800,
      healthNotes: "Bilateral meniscus damage + torn ACL left knee. No running. Gym proximity critical.",
      primaryLanguages: "EN, HU",
      germanLevel: "basic",
      onboardingComplete: true,
    })
    .onConflictDoUpdate({
      target: schema.userProfile.userId,
      set: {
        displayName: "Peter Blazsik",
        originCity: "Amsterdam",
        originCountry: "Netherlands",
        moveDate: "2026-07-01",
        employerName: "Zurich Insurance Group",
        officeName: "Quai Zurich Campus",
        officeAddress: "Mythenquai 2, 8002 Zürich",
        officeLat: 47.3629,
        officeLng: 8.5318,
        jobTitle: "Finance AI & Innovation Lead",
        hasChildren: true,
        childName: "Katie",
        childAge: 9,
        childCity: "Vienna",
        childCountry: "Austria",
        grossMonthlySalary: 15000,
        has13thSalary: true,
        targetRentMin: 2000,
        targetRentMax: 2800,
        healthNotes: "Bilateral meniscus damage + torn ACL left knee. No running. Gym proximity critical.",
        primaryLanguages: "EN, HU",
        germanLevel: "basic",
        onboardingComplete: true,
        updatedAt: new Date(),
      },
    });

  console.log(`✓ Profile seeded for ${userId} (peterblazsik@gmail.com)`);
}

main().catch(console.error);
