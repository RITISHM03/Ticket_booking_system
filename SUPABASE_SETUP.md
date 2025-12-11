# Supabase Database Setup Guide

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign up with GitHub (recommended) or email

## Step 2: Create a New Project

1. Click **New Project**
2. Fill in the details:
   - **Name**: `ticket-booking-system` (or any name you like)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free (0$/month)
3. Click **Create new project**
4. Wait 2-3 minutes for the database to be provisioned

## Step 3: Get Your Database Connection String

1. Once the project is created, go to **Project Settings** (gear icon in sidebar)
2. Click **Database** in the left menu
3. Scroll down to **Connection string**
4. Select **URI** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password you created in Step 2

## Step 4: Add to Vercel Backend

1. Go to your **backend** project in Vercel (https://vercel.com/dashboard)
2. Click on the project name
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the connection string from Step 3 (with your password)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**

## Step 5: Redeploy Backend

1. Go to **Deployments** tab in Vercel
2. Click the three dots (⋮) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Step 6: Run Database Migrations

Since Supabase is a fresh database, you need to create the tables:

1. Open your terminal in the `backend` folder
2. Create a `.env` file with your Supabase connection string:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"
   ```
3. Run the migration:
   ```bash
   npx prisma db push
   ```
4. You should see: "Your database is now in sync with your Prisma schema"

## Step 7: Test Your Application

1. Go to your deployed frontend URL
2. Try creating a show in Admin Mode
3. It should work now! ✅

## Troubleshooting

**Error: "Can't reach database server"**
- Check that you replaced `[YOUR-PASSWORD]` with your actual password
- Make sure there are no extra spaces in the connection string

**Error: "SSL connection required"**
- Add `?sslmode=require` to the end of your connection string

**Error: "Table does not exist"**
- You forgot to run `npx prisma db push` (Step 6)
