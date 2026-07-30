import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { TicketView } from "./TicketView";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function TicketPage({ params }: Props) {
  const { code } = await params;
  const orderCode = code.toUpperCase();

  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from("registrations")
    .select("order_code, full_name, status, checked_in_at")
    .eq("order_code", orderCode)
    .eq("status", "paid")
    .maybeSingle();

  if (!order) notFound();

  return <TicketView order={order} />;
}
