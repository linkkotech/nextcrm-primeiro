"use client";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeaderBar } from "./AdminHeaderBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

export function AdminLayoutClient({
  children,
  userName,
  userEmail,
  userImage,
}: AdminLayoutClientProps) {
  return (
    <SidebarProvider>
      <AdminSidebar
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
      />
      <SidebarInset>
        <AdminHeaderBar />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


