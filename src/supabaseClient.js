import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpycnqyymglghyxcugqu.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweWNucXl5bWdsZ2h5eGN1Z3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODcxNzYsImV4cCI6MjA2Njk2MzE3Nn0.JTGoIdziPKtK2YoRBEsAvAQryEj4F3aachQdYoBX9sc"

export const supabase = createClient(supabaseUrl, supabaseKey)