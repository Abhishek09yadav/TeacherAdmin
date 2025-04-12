"use client";
import React, { Suspense } from "react";
import ResetPassword from "@/components/ResetPassword";
import { useSearchParams } from "next/navigation";

// A wrapper component that uses the params
function ResetPasswordWithParams() {
  const searchParams = useSearchParams();
  const redirectToLogin = searchParams.get("redirectToLogin");
  console.log(`r->`, redirectToLogin);
  console.log("Search Params:", searchParams.toString());

  return <ResetPassword redirectToLogin={redirectToLogin} />;
}

// The main page component
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordWithParams />
    </Suspense>
  );
};

export default Page;
