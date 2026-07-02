import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ysqbwmvrwsftbtvfbmbi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcWJ3bXZyd3NmdGJ0dmZibWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDI3MTYsImV4cCI6MjA5ODI3ODcxNn0.BlYCEkNgOt6Z9m0I2V15iqhMu-nupKipN4kI7CBFMWE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
