import React from "react";

type props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: props) => {
  return <div className="container mx-auto my-32">{children}</div>;
};

export default MainLayout;
