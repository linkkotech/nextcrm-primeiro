import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { HeaderProvider } from "@/context/HeaderContext";
import { getUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "NextCRM | Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  let user = null;
  try {
    user = await getUser();
  } catch (error: unknown) {
    console.error("Error fetching user in admin layout:", error);
    // Continuar mesmo se houver erro ao buscar usuário
  }

  return (
    <HeaderProvider>
      <AdminLayoutClient
        userName={user?.name || null}
        userEmail={user?.email || null}
        userImage={user?.image || null}
      >
        {children}
      </AdminLayoutClient>
    </HeaderProvider>
  );
}
