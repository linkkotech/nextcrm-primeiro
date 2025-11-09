import type { Metadata } from "next";
import { SidebarNavigation } from "@/components/admin/SidebarNavigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { getUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "NextCRM | Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <AdminLayoutClient
      userName={user?.name || null}
      userEmail={user?.email || null}
      userImage={user?.image || null}
    >
      {children}
    </AdminLayoutClient>
  );
}
