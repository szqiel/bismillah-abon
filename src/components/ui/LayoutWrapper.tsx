"use client";

import { usePathname } from "next/navigation";
import { TopNavBar } from "@/components/ui/TopNavBar";
import { Footer } from "@/components/ui/Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/4dminabon");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <TopNavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
