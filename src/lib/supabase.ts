import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is a simple client for server-side use. 
// For production next-auth / auth sessions, using @supabase/ssr is better.
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for backend tasks (service role)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey
);
