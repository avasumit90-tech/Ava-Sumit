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
| `supabase/client-example.ts` | React app me Supabase connect karne ka example |

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

3. `client-example.ts` ko `src/lib/supabase.ts` me rakh kar use karo
   (README ke neeche example queries bhi hain).

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

## 🧪 Ye sab kaise verify kiya?

Har query ko real **PostgreSQL 17** par run karke test kiya:
- ✅ Schema + seed bina error ke chalta hai (43 policies, 6 triggers, 6 buckets)
- ✅ Naya signup → profile auto-create hoti hai
- ✅ Existing demo member signup → profile link hoti hai (Rahul Sharma test)
- ✅ Anon: public tables read, audit/donations blocked, form submit kar sakta hai
- ✅ Logged-in: apna profile/application/donation hi dekh sakta hai
- ✅ Admin: sab kuch (audit logs, saare profiles, saare registrations)
- ✅ Public status view (`registration_status`) PII ke bina kaam karta hai

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
