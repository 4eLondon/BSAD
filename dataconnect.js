const { createClient } = require('@supabase/supabase-js')

// creates one Supabase connection that every file can share
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

module.exports = supabase
