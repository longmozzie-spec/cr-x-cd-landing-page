import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client dùng SERVICE ROLE — CHỈ chạy phía server.
 * Tuyệt đối không import file này vào client component.
 * Service role bỏ qua RLS nên mọi truy cập DB phải đi qua API routes.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong biến môi trường."
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
