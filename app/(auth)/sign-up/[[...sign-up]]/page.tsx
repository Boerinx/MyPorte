import { SignUp } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div>
      <SignUp forceRedirectUrl="/dashboard" />
    </div>
  );
};

export default Page;
