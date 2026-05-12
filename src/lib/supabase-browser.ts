import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Trả về null nếu chưa cấu hình Supabase
  if (!url || url === 'your_supabase_url' || !key || key === 'your_supabase_anon_key') {
    return null
  }

  return createBrowserClient(url, key)
}
