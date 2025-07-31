import Header from "@/components/header";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto my-32">{children}</div>
    </div>
  );
};

export default MainLayout;
