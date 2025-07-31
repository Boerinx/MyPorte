import { getUserAccount } from "@/actions/dashboard";
import { defaultCategories } from "@/app/data/categories";
import React from "react";
import AddTransactionForm from "./_components/transaction-form";

const AddTransactionPage = async () => {
  const account = await getUserAccount();
  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-5xl mb-8">Add Transaction</h1>

      <AddTransactionForm accounts={account} categories={defaultCategories} />
    </div>
  );
};

export default AddTransactionPage;
