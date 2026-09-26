import { supabase } from './supabase'

export async function testSupabaseConnection() {
  const { error } = await supabase
    .from('user_preferences')
    .select('email')
    .limit(1)

  return {
    connected: !error,
    error: error?.message ?? null,
  }
}
