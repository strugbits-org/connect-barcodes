import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";

function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  return cookieStore.get("admin_auth")?.value === "authenticated";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
