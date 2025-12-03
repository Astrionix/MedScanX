# MedScanX Setup Instructions

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following content:

```env

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
