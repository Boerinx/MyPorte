import React, { ReactNode } from "react";

type props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: props) => {
  return <div className="flex justify-center pt-40">{children}</div>;
};

export default AuthLayout;
