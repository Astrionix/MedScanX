# 🚀 Quick Setup Guide - MedScanX

## ⚠️ IMPORTANT: Database Setup Required

The application is running, but you need to set up the Supabase database first!

## Step 1: Set Up Supabase Database

### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/ojghwswuwgjhvbifdlyu/sql/new
   
2. **Run the Schema**
   - Open the file: `supabase/schema.sql`
   - Copy ALL the SQL code
   - Paste it into the Supabase SQL Editor
   - Click **"Run"** button
   
3. **Verify Tables Created**
   - Go to: https://supabase.com/dashboard/project/ojghwswuwgjhvbifdlyu/editor
   - You should see a `scans` table
   
4. **Verify Storage Bucket**
   - Go to: https://supabase.com/dashboard/project/ojghwswuwgjhvbifdlyu/storage/buckets
   - You should see a `scans` bucket

### Option B: Quick SQL (Copy-Paste This)

If you prefer, here's the complete SQL to run:

```sql
-- Create scans table
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scan_url TEXT NOT NULL,
  scan_name TEXT NOT NULL,
  analysis TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  abnormalities JSONB DEFAULT '[]'::jsonb,
  precautions JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own scans" ON public.scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scans" ON public.scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scans" ON public.scans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scans" ON public.scans FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('scans', 'scans', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload scans" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'scans' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view scans (public bucket)" ON storage.objects FOR SELECT USING (bucket_id = 'scans');

-- Create indexes
CREATE INDEX IF NOT EXISTS scans_user_id_idx ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS scans_created_at_idx ON public.scans(created_at DESC);
```

## Step 2: Test the Connection

After running the SQL schema:

1. **Visit the health check endpoint:**
   - Open: http://localhost:3000/api/health
   - You should see: `{"status":"success",...}`
   
2. **If you see an error:**
   - Check that you ran the SQL schema
   - Verify the environment variables in `.env.local`
   - Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

## Step 3: Register and Test

1. **Go to:** http://localhost:3000/register
2. **Create an account** with any email/password
3. **Upload a CT scan** image
4. **View the AI analysis**

## 🔍 Troubleshooting

### Error: "relation public.scans does not exist"
**Solution:** You haven't run the SQL schema yet. Go to Step 1.

### Error: "Failed to upload file"
**Solution:** The storage bucket wasn't created. Make sure you ran the complete SQL schema including the storage bucket creation.

### Error: "Unauthorized"
**Solution:** Make sure you're logged in. Try registering a new account.

### Error: "Failed to analyze scan"
**Solution:** Check that your Gemini API key is correct in `.env.local`

## 📝 Current Configuration

✅ Supabase URL: `https://ojghwswuwgjhvbifdlyu.supabase.co`
✅ Supabase Anon Key: Configured
✅ Gemini API Key: Configured
✅ Development Server: Running on http://localhost:3000

## 🎯 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/ojghwswuwgjhvbifdlyu
- **SQL Editor:** https://supabase.com/dashboard/project/ojghwswuwgjhvbifdlyu/sql/new
- **Storage:** https://supabase.com/dashboard/project/ojghwswuwgjhvbifdlyu/storage/buckets
- **Authentication:** https://supabase.com/dashboard/project/ojghwswuwgjhvbifdlyu/auth/users

---

**Once you've completed Step 1, refresh the registration page and try again!**
