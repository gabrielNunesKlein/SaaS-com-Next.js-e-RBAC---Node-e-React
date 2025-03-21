import { isAutenticated } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  if(await isAutenticated()){
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
        <div className="w-full max-w-xs">
            {children}
        </div>
    </div>
  );
}
