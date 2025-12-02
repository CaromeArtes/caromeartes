
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uompmspsrpswwofrrfwv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbXBtc3BzcnBzd3dvZnJyZnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODYwMDcsImV4cCI6MjA3MjA2MjAwN30.XNAePDBBPZWgSb_QxspvpDKfktXqLuOgT4Nk6aKgDNI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
