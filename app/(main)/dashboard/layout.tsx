import React, { lazy, Suspense } from "react";
import { BarLoader } from "react-spinners";

const DashboardPage = lazy(() => import("./page"));

const Dashboard = () => {
  return (
    <div className="px-5">
      <h1 className="text-6xl font-bold mb-5">Dashboard</h1>

      {/* Dashboard Page */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default Dashboard;
