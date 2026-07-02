import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, AUTH_COOKIE } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Registration } from "@/types/registration";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="reg-page">
        <main className="reg-wrap">
          <div className="reg-card">
            <h1 className="reg-title" style={{ fontSize: 30 }}>
              Lỗi tải dữ liệu
            </h1>
            <p className="reg-sub">{error.message}</p>
          </div>
        </main>
      </div>
    );
  }

  return <AdminDashboard rows={(data ?? []) as Registration[]} />;
}
