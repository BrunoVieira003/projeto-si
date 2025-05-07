'use client'
import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Home() {
  if(isLoggedIn()){
    redirect('/profile')
  }else{
    redirect('/login')
  }

}
