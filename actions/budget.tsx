"use server";

import { Decimal } from "@/lib/generated/prisma/runtime/library";
import { getCurrentUser } from "@/lib/get-current-user";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget(accountId: string) {
  try {
    const user = await getCurrentUser();

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      budget: budget ? { ...budget, amount: Number(budget.amount) } : null,
      currentExpenses: expenses._sum.amount ? Number(expenses._sum.amount) : 0,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount: number | Decimal) {
  try {
    const user = await getCurrentUser();

    const normalizedAmount = new Decimal(amount);

    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: {
        amount: normalizedAmount,
      },
      create: {
        userId: user.id,
        amount: normalizedAmount,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...budget, amount: Number(budget.amount) },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: (error as Error).message };
  }
}
