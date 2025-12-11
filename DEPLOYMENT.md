# Vercel Deployment Guide

Since your repository contains both `backend` and `frontend` folders, you must create **TWO separate projects** in Vercel.

## 1. Deploying Backend

1.  **Add New Project** in Vercel.
2.  Select your GitHub Code Repository.
3.  **CRITICAL STEP**: In the "Configure Project" screen, look for **Root Directory**.
    *   Click `Edit`.
    *   Select the `backend` folder.
    *   Click `Continue`.
4.  **Framework Preset**: It should say "Other" or "Node.js".
5.  **Environment Variables**:
    *   Add `DATABASE_URL` : `postgres://...` (Your actual Postgres connection string).
6.  Click **Deploy**.

## 2. Deploying Frontend

1.  **Add New Project** (Go back to dashboard).
2.  Select the **same** GitHub Repository.
3.  **CRITICAL STEP**: In "Configure Project":
    *   **Root Directory**: Click `Edit` -> Select `frontend`.
4.  **Framework Preset**: It should auto-detect **Vite**.
5.  **Environment Variables**:
    *   Add `VITE_API_URL` : The URL of your **deployed backend** (from step 1), e.g., `https://your-backend.vercel.app/api`.
    *   *Note: Do not add a trailing slash.*
6.  Click **Deploy**.

## Troubleshooting
- **Backend 404?**: Check that you are calling `/api/...`. Vercel functions live at `/api`.
- **Database Error?**: Ensure your `DATABASE_URL` is correct and your database accepts external connections (e.g. Neon, Railway, Supabase).
