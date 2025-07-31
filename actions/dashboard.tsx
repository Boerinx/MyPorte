"use server";

import { getCurrentUser } from "@/lib/get-current-user";
import db from "@/lib/prisma";
import serializeTransaction from "@/lib/serialize-transaction";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Input type based on your schema
type CreateAccountInput = {
  name: string;
  type: "CURRENT" | "SAVINGS";
  balance: string | number;
  isDefault?: boolean;
};

export async function createAccount(data: CreateAccountInput) {
  try {
    const user = await getCurrentUser();

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance as string);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error: any) {
    console.error("Create Account Error:", error);
    throw new Error(error?.message || "Unknown error occurred");
  }
}

export async function getUserAccount() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return [];

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  const serializedAccount = accounts.map(serializeTransaction);

  return serializedAccount;
}
