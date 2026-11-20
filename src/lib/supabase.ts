import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Supabase 접속. 주소와 공개 키는 .env.local의 NEXT_PUBLIC_ 값을 쓴다.
 * 값이 없으면 처음 쓸 때 알려 주고, 그 전까지는 화면이 깨지지 않게 만들지 않는다.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      ".env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 넣어 주세요.",
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
