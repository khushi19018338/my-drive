const { createClient } = require('@supabase/supabase-js');

// Create Supabase client using backend-only service role
const supabase = createClient(
  process.env.SUPABASE_URL,           // Supabase Project URL
  process.env.SUPABASE_KEY            // Your service role key (NOT anon)
);

module.exports = supabase;
