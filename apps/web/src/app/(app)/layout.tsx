import { isAutenticated } from "@/auth/auth";
import Header from "@/components/header";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
  sheet
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode
}>) {
  
  if(!await isAutenticated()){
    redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  );
}