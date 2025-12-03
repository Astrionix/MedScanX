# MedScanX Setup Instructions

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ojghwswuwgjhvbifdlyu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ2h3c3d1d2dqaHZiaWZkbHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTYzMjksImV4cCI6MjA4MDI3MjMyOX0.ZfhitiUtRo8bAuIU_VAk5kZbuvK6uIzBmlFmUA5SqzI

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyCbGcqBzlZAMvmXAzjZ9lzEAKeqJPgPuQk
```

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Get Gemini API Key**
   - Go to https://makersuite.google.com/app/apikey
   - Create a new API key
   - Replace `your_gemini_api_key_here` in `.env.local`

3. **Set up Supabase Database**
   - Go to your Supabase project: https://supabase.com/dashboard/project/sjgrjzvpgfkopkymotp
   - Navigate to SQL Editor
   - Run the SQL from `supabase/schema.sql`

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the Application**
   - Navigate to http://localhost:3000
