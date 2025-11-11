import type { Metadata } from "next";
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
  let user = null;
  try {
    user = await getUser();
  } catch (error) {
    console.error("Error fetching user in admin layout:", error);
    // Continuar mesmo se houver erro ao buscar usuário
  }

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
