# MATS Deployment Guide for Vercel

## Prerequisites
- Vercel account
- Supabase project set up with the schema from `supabase/schema.sql`
- Google Gemini API key

## Deployment Steps

1. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Root Directory**
   - In project settings, set the root directory to: `mats-ambulance-system`

3. **Set Environment Variables**
   Add these environment variables in Vercel project settings:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

4. **Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

## Important Notes
- Make sure your Supabase database has the tables created using `supabase/schema.sql`
- The `.env.local` file is for local development only and is not pushed to GitHub
- All environment variables must be set in Vercel's dashboard for production
