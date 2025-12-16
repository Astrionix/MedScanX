
import { createClient } from '@supabase/supabase-js'

// Note: SUPABASE_SERVICE_ROLE_KEY should be in your .env.local
// If missing, this will fail for admin operations.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})
