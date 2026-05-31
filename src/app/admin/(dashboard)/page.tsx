import AdminDashboard, { Order } from "@/components/admin-dashboard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminDashboard initialOrders={(data as Order[]) ?? []} />;
}
