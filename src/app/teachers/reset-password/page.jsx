"use client"
import React from 'react'
import ResetPassword from '@/components/ResetPassword'
import { useSearchParams } from "next/navigation";
const page = () => {
  const searchParams = useSearchParams();
  const redirectToLogin = searchParams.get("redirectToLogin");
 console.log(`r->`,redirectToLogin)
  console.log("Search Params:", searchParams.toString())
  return (
    <div>
        <ResetPassword redirectToLogin={redirectToLogin}/>
    </div>
  )
}

export default page