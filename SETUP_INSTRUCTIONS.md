# 🏥 MedScanX Setup Instructions

You have successfully updated the project with new Supabase credentials! Here are the steps to get everything running:

## 1. Database Setup (Crucial Step!)

Since you are using a **new Supabase project**, the database is currently empty. You need to create the required tables.

1.  Copy the content of the file `supabase/schema.sql`.
2.  Go to your **Supabase Dashboard** for project `qfomqftxnbjrsygpjbfi`.
3.  Navigate to the **SQL Editor**.
4.  Paste the SQL code and click **Run**.

This will create:
- The `scans` table for storing analysis results.
- The `scans` storage bucket for images.
- Security policies (RLS) to protect user data.

## 2. Create a New Account

Your old login credentials will **not work** on this new project.

1.  Go to [http://localhost:3000/register](http://localhost:3000/register).
2.  Sign up with a new email and password.
3.  You should be redirected to the Dashboard.

## 3. Verify AI Model

We have updated the AI model to **Gemini 2.5 Pro** (`gemini-2.5-pro`) for the best medical analysis performance.

## Troubleshooting

- **401 Unauthorized on Login**: This is expected if you try to use old credentials. Please register a new account.
- **500 Error on Upload**: This usually means the `scans` table doesn't exist. Make sure you ran the SQL script in Step 1.
