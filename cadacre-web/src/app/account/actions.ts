"use server";

import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db/client";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveProfileSettings(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const username = formData.get("username") as string;
  const isPortfolioPublic = formData.get("isPortfolioPublic") === "on";

  if (!username || username.trim() === "") {
    return { success: false, error: "Username is required" };
  }

  const db = getDb();
  if (!db) {
    return { success: false, error: "Database connection failed" };
  }

  try {
    const existingProfiles = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    // Ensure username is unique if it's changing
    const existingWithSameName = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.username, username));

    if (existingWithSameName.length > 0 && existingWithSameName[0].userId !== userId) {
      return { success: false, error: "Username is already taken" };
    }

    if (existingProfiles.length > 0) {
      await db
        .update(userProfiles)
        .set({
          username,
          isPortfolioPublic,
        })
        .where(eq(userProfiles.userId, userId));
    } else {
      await db.insert(userProfiles).values({
        userId,
        username,
        isPortfolioPublic,
      });
    }

    revalidatePath("/account");
    revalidatePath("/community");
    
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to save profile", err);
    return { success: false, error: "Failed to save profile. Username might be taken." };
  }
}
