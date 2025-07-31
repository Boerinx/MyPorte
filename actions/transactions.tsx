"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";
import { Transaction } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";
import serializeTransaction from "@/lib/serialize-transaction";

export async function createTransaction(data: Transaction) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    const balanceChange = data.type == "EXPENSE" ? -data.amount : data.amount;
    const newBalance = Number(account.balance) + Number(balanceChange);

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });
      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeTransaction(transaction) };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

function calculateNextRecurringDate(startDate: Date, interval: string) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setDate(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setDate(date.getFullYear() + 1);
      break;
  }

  return date;
}
