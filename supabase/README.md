# 🗄️ Astha Foundation — Complete Supabase Database

Is repo (Ava-Sumit / Astha Foundation) ke liye **poori Supabase database ready hai** —
15 tables, 10 enums, 24 indexes, 6 triggers, 40+ RLS policies, 6 storage buckets,
aur demo seed data. Sab kuch **tested** hai (PostgreSQL 17 par run karke verify kiya gaya).

---

## 📁 Files

| File | Kaam |
|---|---|
| `supabase/complete-setup.sql` | ⭐ **Yahi use karo** — schema + seed ek saath. SQL Editor me paste karke Run. |
| `supabase/schema.sql` | Sirf schema (tables, RLS, triggers, storage) |
| `supabase/seed.sql` | Sirf demo data (app ke INITIAL_* data se matching) |
| `src/lib/supabase.ts` | ⭐ App ka live Supabase client (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY se) |
| `src/lib/api.ts` | ⭐ Data layer — saare DB calls (users, projects, applications, donations, admin modules) mock-fallback ke saath |

---

## 🚀 Setup — 5 minute ka kaam

### Step 1 — Supabase project banao
1. [supabase.com](https://supabase.com) → **Start your project** → login.
2. **New project** → naam do (e.g. `astha-foundation`), password set karo,
   region **ap-south-1 (Mumbai)** choose karo → Create.
3. 2-3 minute me project ready ho jayega.

### Step 2 — Database banwao (⭐ main step)
1. Left sidebar → **SQL Editor** → **New query**.
2. `supabase/complete-setup.sql` ka **poora content copy** karke paste karo.
3. **Run** dabao. Output me `Success. No rows returned` dikhega.
4. Verify: sidebar me **Table Editor** kholo — `profiles`, `projects`,
   `donations`, `certificates`, `gallery_items`, `partners`, `legal_documents`,
   `audit_logs`, `cms_content`, `settings`, `activities`, `registrations`,
   `education`, `experience`, `documents` — sab tables demo data ke saath dikhengi. ✅

### Step 3 — Admin banao
1. Sidebar → **Authentication** → **Users** → **Invite user** → apna email bhejo.
2. Email me aaya link se password set karo.
3. Ab **Table Editor → profiles** kholo → apni row me `role` = `super_admin`
   set karo (ya seed me `rahul.sharma@example.com` ko bhi use kar sakte ho —
   wo signup karne par automatically link ho jayega, trigger sambhal leta hai).
4. **Storage** check karo — `avatars`, `documents`, `gallery-images`,
   `partner-logos`, `legal-documents`, `certificates` buckets ban chuke honge.

### Step 4 — App me connect karo
1. Project **Settings → API** se copy karo: **Project URL** + **anon public key**.
2. Repo ki root me `.env` file banao (ya `.env.example` copy karo):

```bash
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOi..."
```

3. App me `src/lib/supabase.ts` + `src/lib/api.ts` pehle se ready hain —
   bas `.env` me vars set karo (ya Vercel → Environment Variables), sab live ho jayega.
   `README.md` ke neeche example queries bhi hain.

### 🚀 Deploy (Vercel)

```bash
# Vercel me: repo import karo, Vite auto-detect ho jayega
# Build:  npm run build   →  Output: dist
# Environment Variables (Settings → Environment Variables):
VITE_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_PUBLIC_KEY"
```

**Admin login:** Navbar me "Admin Login" button — `test@asthafoundation.org`
(test admin) ya apna invited admin account use karo. Login hone par admin
panels live database se data dikhayenge. Bina login ke app demo/mock data
me chalti hai (public site hamesha live: projects, gallery, partners, legal,
CMS, settings, status-check, registration, donation).

---

## 🧱 Tables — ek nazar

| Table | Kya hai | App me kaun si file |
|---|---|---|
| `profiles` | Members (UserRecord) | `src/data.ts` → INITIAL_USERS |
| `registrations` | Applications (ApplicationStatus + RegistrationFormData) | `RegistrationFormPage.tsx` |
| `education` / `experience` | Registration ke andar ke entries | `EducationAndSkillsForm` / `ExperienceForm` |
| `documents` | Identity/degree/address proofs | `DocumentUploadForm`, Admin review |
| `projects` | Fundraising projects (ProjectItem) | `INITIAL_PROJECTS` |
| `donations` | Donations + 80G receipts (DonationRecord) | `AdminDonationsPage.tsx` |
| `certificates` | Certificates (admin + user wall) | `AdminCertificatesPage`, `UserCertificatesPage` |
| `gallery_items` | Photo gallery (GalleryItem) | `AdminGalleryPage.tsx` |
| `partners` | Partner logos (PartnerItem) | `AdminPartnersPage.tsx` |
| `legal_documents` | Trust deed, 80G, 12A, PAN (LegalDoc) | `AdminLegalPage.tsx` |
| `audit_logs` | Security logs (AuditLogRecord) | `AdminAuditLogsPage.tsx` |
| `cms_content` | Website hero banner (key/value) | `AdminCMSPage.tsx` |
| `settings` | Org info + fees (key/value) | `AdminSettingsPage.tsx` |
| `activities` | Recent activity feed (ActivityItem) | `INITIAL_ACTIVITIES` |
| `registration_status` | ⭐ Public "check status" view (PII ke bina) | `CheckStatusModal.tsx` |

---

## 🔐 Security (RLS) — kaun kya kar sakta hai

| Table | Public (anon) | Logged-in member | Admin / Super Admin |
|---|---|---|---|
| `profiles` | sirf naam jhalak (select) | apna profile edit | sab kuch |
| `registrations` | form submit kar sakta hai | apni application dekh sakta hai | review + approve |
| `donations` | donate kar sakta hai | apne donations | sab kuch + receipt |
| `certificates` | — | apne certificates | generate/manage |
| `projects`, `gallery`, `partners`, `legal_documents`, `activities`, `cms_content`, `settings` | read | read | manage |
| `audit_logs` | ❌ blocked | ❌ blocked | sirf admin |
| Storage buckets | public buckets read | avatars/documents upload | sab kuch |

**Admin kaise banta hai:** profile ki `role` column me `admin` ya `super_admin` set karo.

---

## ⚡ App me use karne ke liye example queries

```ts
// Register karne par (public form — .insert() use karo, .select() nahi!)
await supabase.from('registrations').insert({
  member_id: 'AST-DID-1234',
  applicant_name: 'Priya Sharma',
  role: 'didi',
  email: 'priya@example.com',
  // ... baaki fields
});

// Check Application Status (public view)
const { data } = await supabase
  .from('registration_status')
  .select('*')
  .eq('member_id', 'AST-DID-9012');

// Admin: applications list
const { data: applications } = await supabase
  .from('registrations')
  .select('*')
  .order('submitted_at', { ascending: false });

// Admin: approve karna
await supabase
  .from('registrations')
  .update({ status: 'Approved', reviewed_at: new Date().toISOString() })
  .eq('id', appId);

// Donations + total
const { data: donations } = await supabase
  .from('donations').select('*').eq('status', 'Success');
const total = donations.reduce((s, d) => s + Number(d.amount), 0);

// File upload (storage)
await supabase.storage
  .from('avatars')
  .upload(`public/${userId}.jpg`, file);
```

---

## ⚠️ Important notes

1. **`.insert().select()` mat use karo public forms me** — PostgreSQL `INSERT ...
   RETURNING` ko RLS select policy bhi check karta hai. Sirf `.insert()` karo
   (member ID app khud generate karta hai, isliye return ki zaroorat nahi).
2. **Auth signup automatic profile banata hai** — trigger `handle_new_user`
   chal jata hai. Agar wo email pehle se demo data me hai to profile *link*
   ho jati hai (data loss nahi hota).
3. **Spam protection** — registration/donation forms publicly open hain
   (intentionally, website public hai). Production me Supabase **Captcha**
   (hCaptcha/Cloudflare Turnstile) ya rate-limiting laga dena.
4. **Service role key kabhi frontend me mat daalo** — sirf backend me.
5. Schema **idempotent** hai — dobara run karne par bhi safe hai.

---

## 🔑 Test IDs (aapke Supabase project me create kiye gaye)

| Role | Email | Password | Kya hai |
|---|---|---|---|
| 👑 **Super Admin** | `test@asthafoundation.org` | `Astha@Test#2026` | Admin panel ke liye (audit logs, saare users, sab kuch) |
| 👤 **Member** | `member.test@asthafoundation.org` | `Member@Test#2026` | Normal member (sirf apna profile/application) |

> ⚠️ Inhe production me use karna ho toh password change kar dena (Auth → Users → edit).
> Agar nahi chahiye toh Auth → Users → delete kar sakte ho.

---

## 🧪 Complete Live Test Report (2026-08-01)

**15 tables + 1 safe view + 1 members view** — sab populated ✅
**43 RLS policies, 6 triggers, 10 enums, 24 indexes, 6 storage buckets** ✅

| # | Test | Result |
|---|---|---|
| A1 | Public: projects/gallery/partners readable (anon) | ✅ |
| A2 | Security: audit_logs/profiles/certificates anon ko BLOCKED | ✅ |
| A3 | Public: `public_members` safe view (email/phone ke bina) | ✅ |
| A4 | Public: `registration_status` check-status feature | ✅ |
| A5 | Public: registration form submit (plain insert) | ✅ 201 |
| A6 | Public: donation record | ✅ 201 |
| A7 | Security: anon projects edit nahi kar sakta | ✅ blocked |
| B1 | Member: apna profile dekh sakta hai | ✅ |
| B2 | Member: apna profile update kar sakta hai | ✅ |
| B3 | Security: member doosron ka profile edit/delete nahi kar sakta | ✅ blocked |
| B4 | Security: member audit_logs/donations nahi dekh sakta | ✅ blocked |
| C1 | Admin: audit_logs dekh sakta hai | ✅ |
| C2 | Admin: saare profiles/donations/registrations | ✅ |
| C3 | Admin: kisi bhi profile ko update kar sakta hai | ✅ |
| D1 | Trigger: naya signup → profile auto-create | ✅ |
| D2 | Trigger: existing member signup → profile link | ✅ |
| D3 | Sign-in: password login dono test users ke liye | ✅ |

**Testing ke dauraan mili 3 real bugs jo fix kiye:**
1. **Profiles public-readable the** (sab members ke email/phone public dikhte) → ab `profiles` anon ko hidden, safe `public_members` view bana diya.
2. **Members apna profile update nahi kar paate the** — SELECT policy missing thi (bina uske PostgreSQL own-UPDATE bhi block karta hai) → `Users can view own profile` policy add ki.
3. **`registration_status` view Supabase me `security_invoker=on` ban rahi thi** → public ko 0 rows dikhti thi → ab `security_invoker` reset kiya.

---

## ❓ Problem aa rahi hai?

| Problem | Solution |
|---|---|
| `permission denied for schema auth` | Normal hai — bas SQL Editor me hi run karo |
| `duplicate key ... member_id` | Seed dobara mat chalao, ya `member_id` change karke |
| Trigger bana nahi | Verify: `auth.users` par trigger check karo (SQL Editor me `select tgname from pg_trigger where tgrelid='auth.users'::regclass;`) |
| Upload 403 | Storage bucket policy check karo — anon ko public buckets par sirf read hai |
| Admin panel khali | Check `role` column — `admin` ya `super_admin` hona chahiye |

Koi bhi problem ho toh batao — saath me fix kar denge! 💪
