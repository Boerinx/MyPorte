import { SignIn } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div>
      <SignIn forceRedirectUrl="/dashboard" />
    </div>
  );
};

export default Page;
