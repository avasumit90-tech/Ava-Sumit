# AVA Foundation — Vercel Deploy Guide

## ✅ Kya ho gaya
- `vercel.json` (Vite framework, `dist` output, SPA rewrite) repo ke `main` branch par push ho gaya.
- App build test hua aur clean build hota hai (React + Vite + TypeScript, pure state-based SPA — koi URL router nahi, isliye Vercel auto-detect perfectly kaam karega).

## 🚀 Vercel par deploy — step by step

1. **Vercel kholo:** https://vercel.com  → GitHub se login karo (same account jo repo ka owner hai).

2. **Import karo:**
   - **Add New… → Project** (ya **New Project**).
   - **Import Git Repository** section mein `avasumit90-tech/Ava-Sumit` ko **Import** karo.
   - Agar repo list mein nahi dikh raha → **Adjust GitHub App Permissions** par click karke repo access dena padega.

3. **Project settings check** (default theek hain, sirf verify karo):
   - Framework Preset: **Vite** (auto-detect)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install` (leave blank/default)

4. **Environment Variables add karo** (Import ke baad, **Settings → Environment Variables**, ya Deploy se pehle **Environment Variables** section mein):
   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | `https://gljogylhawwhlakyduzx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsam9neWxoYXd3aGxha3lkdXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MDUxNTMsImV4cCI6MjEwMTA4MTE1M30.HLLIvrwUQHVbn2IkrgqoRJvbY05QQyeEeCX7OC5NchA` |

   > **Production** aur **Preview** dono environments ke liye set karo. (Values jo tune di thi.)

5. **Deploy** karo → kuch hi second mein live ho jayega.
   - Production URL dikhega jaise: `ava-sumit-xxxx.vercel.app`

## 🔒 IMPORTANT — Token revoke karo!
Tune GitHub token is chat mein share kiya. Deploy confirm ho jaane ke baad use **revoke** kar do:
- GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic)** → jo token diya tha, usse **Delete/Revoke** karo.

## 🔁 Baad ka updates
Har baar jab aap `main` branch par push karte ho, Vercel **auto-deploy** karega. Kuch bhi change karo → push → live.

## ℹ️ Backend note
Agar Supabase tables (`donations`, `users`, etc.) banaye nahi hain, toh repo ke root mein `supabase_schema.sql` hai — use Supabase SQL Editor mein chalao. Agar tables missing hain, app local-fallback mode mein chalega (site to load hogi, par data persist nahi hoga).
