import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yubcvsbusjszgtcnwncd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YmN2c2J1c2pzemd0Y253bmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NzI5NzUsImV4cCI6MjA5MzU0ODk3NX0.icjRpV-ugY31tv3GZB9oXueNOgifQiZUDGrve7l029U'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)