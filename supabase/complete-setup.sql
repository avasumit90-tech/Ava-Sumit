-- ============================================================================
-- ASTHA FOUNDATION — COMPLETE SUPABASE SETUP (SCHEMA + SEED)
-- ----------------------------------------------------------------------------
-- 👉 ONE FILE, ONE CLICK: paste the whole file into
--    Supabase Dashboard → SQL Editor → New query → Run
--    (idempotent — safe to re-run)
--
-- Creates: 16 tables, 10 enum types, 24 indexes, 6 triggers, 44+ RLS
-- policies, 6 storage buckets, 2 public safe views, and demo seed data.
-- Includes fixes verified by live testing (profiles privacy, own-view
-- policy, registration_status security_invoker, public_members view).
-- ============================================================================

-- ============================================================================
-- ASTHA FOUNDATION — COMPLETE SUPABASE DATABASE SCHEMA
-- ----------------------------------------------------------------------------
-- This is the FULL database for the Ava-Sumit / Astha Foundation web app.
-- Run this file in:  Supabase Dashboard → SQL Editor → New query → Run
-- (Then run seed.sql separately for demo data, or just run complete-setup.sql
--  which contains both.)
--
-- Covers: Auth-linked profiles, registrations (applications), education,
-- experience, documents, projects, donations, certificates, gallery,
-- partners, legal documents, audit logs, CMS content, settings, activities,
-- + Storage buckets with policies + Row Level Security (RLS).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;   -- gen_random_uuid()

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================
do $$ begin
  create type public.user_role as enum ('didi', 'maa', 'teacher', 'student', 'coordinator', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.member_status as enum ('Active', 'Pending', 'Inactive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.application_status as enum ('Under Review', 'Approved', 'Action Required', 'Rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_category as enum ('Education', 'Health', 'Environment', 'Community');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_status as enum ('Active', 'Completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.activity_type as enum ('volunteer', 'donation', 'project', 'status');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.donation_status as enum ('Success', 'Pending', 'Refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.certificate_type as enum ('Training Certificate', 'Internship Certificate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.partner_status as enum ('Active', 'Inactive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_status as enum ('Pending', 'Verified', 'Rejected');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 2.1 PROFILES  (one row per member / user; links to Supabase Auth)
--     Matches the app's UserRecord interface.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                uuid primary key default gen_random_uuid(),
  auth_user_id      uuid unique references auth.users(id) on delete cascade,
  member_id         text unique not null,          -- e.g. AST-2024-8902
  full_name         text not null,
  email             text unique not null,
  phone             text,
  role              public.user_role not null default 'student',
  status            public.member_status not null default 'Pending',
  gender            text,
  dob               date,
  blood_group       text,
  location          text,                          -- e.g. "Mumbai, MH"
  address           text,
  avatar_url        text,
  qualification     text,
  field_of_study    text,
  institution       text,
  completion_year   text,
  organization      text,
  designation       text,
  department        text,
  skills            text[] not null default '{}',
  languages         text[] not null default '{}',
  volunteering_interests text[] not null default '{}',
  availability      text,
  valid_until       date,
  last_active_at    timestamptz,
  registration_date timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.2 REGISTRATIONS  (application forms — matches ApplicationStatus +
--     RegistrationFormData in the app)
-- ---------------------------------------------------------------------------
create table if not exists public.registrations (
  id                    uuid primary key default gen_random_uuid(),
  profile_id            uuid references public.profiles(id) on delete set null,
  member_id             text unique,               -- application reference, e.g. AST-DID-9012
  applicant_name        text not null,
  role                  public.user_role not null,
  email                 text not null,
  phone                 text,
  gender                text,
  dob                   text,
  address               text,
  location              text,
  status                public.application_status not null default 'Under Review',
  step_completed        int not null default 1,
  total_steps           int not null default 4,
  remarks               text,
  motivation            text,
  experience_years      text,
  availability          text,
  identity_proof_type   text,
  address_proof_type    text,
  terms_accepted        boolean not null default false,
  declaration_signed_at timestamptz,
  submitted_at          timestamptz not null default now(),
  reviewed_by           uuid references public.profiles(id) on delete set null,
  reviewed_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.3 EDUCATION  (one row per qualification entry inside a registration)
-- ---------------------------------------------------------------------------
create table if not exists public.education (
  id              uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  degree          text not null,
  institution     text not null,
  period          text,
  honours         text
);

-- ---------------------------------------------------------------------------
-- 2.4 EXPERIENCE  (one row per work / volunteer entry inside a registration)
-- ---------------------------------------------------------------------------
create table if not exists public.experience (
  id              uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  role            text not null,
  organization    text not null,
  period          text,
  description     text
);

-- ---------------------------------------------------------------------------
-- 2.5 DOCUMENTS  (identity / education / address proofs uploaded by applicant)
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id              uuid primary key default gen_random_uuid(),
  registration_id uuid references public.registrations(id) on delete cascade,
  profile_id      uuid references public.profiles(id) on delete cascade,
  title           text not null,          -- e.g. "National ID (Aadhaar)"
  doc_type        text,                   -- e.g. "PDF", "JPG"
  file_path       text,                   -- storage path e.g. documents/abc.pdf
  file_name       text,
  size_bytes      bigint,
  status          public.document_status not null default 'Pending',
  verified_by     uuid references public.profiles(id) on delete set null,
  verified_at     timestamptz,
  uploaded_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.6 PROJECTS  (matches ProjectItem interface)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    public.project_category not null default 'Education',
  description text,
  raised      numeric(12,2) not null default 0,
  goal        numeric(12,2) not null default 0,
  image_url   text,
  status      public.project_status not null default 'Active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.7 DONATIONS  (matches DonationRecord in AdminDonationsPage)
-- ---------------------------------------------------------------------------
create table if not exists public.donations (
  id                uuid primary key default gen_random_uuid(),
  donor_name        text not null,
  email             text,
  phone             text,
  amount            numeric(12,2) not null,
  transaction_id    text unique,
  payment_gateway   text not null default 'Razorpay',
  status            public.donation_status not null default 'Pending',
  reg_80g_number    text,
  receipt_number    text unique,          -- e.g. ASTHA/REC/2026/089
  receipt_pdf_path  text,
  donated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.8 CERTIFICATES  (admin-generated + user-visible certificates)
--     category is optional (Community / Skills / Mentorship / Health /
--     Leadership) — used on the user certificates wall.
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  recipient_name     text not null,
  certificate_type   public.certificate_type not null default 'Training Certificate',
  certificate_number text unique not null,  -- e.g. ASTHA/TRN/2026/401
  issue_date         date not null default current_date,
  category           text,
  description        text,
  project_name       text,
  badge_type         text,
  featured           boolean not null default false,
  qr_code            text,
  pdf_path           text,
  created_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.9 GALLERY ITEMS  (matches GalleryItem)
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  category   text,
  image_url  text not null,
  item_date  date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.10 PARTNERS  (matches PartnerItem)
-- ---------------------------------------------------------------------------
create table if not exists public.partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  logo_url      text,
  website       text,
  display_order int not null default 0,
  status        public.partner_status not null default 'Active',
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.11 LEGAL DOCUMENTS  (matches LegalDoc — trust deed, 80G, 12A, PAN etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.legal_documents (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  category        text not null,
  file_path       text,
  file_name       text,
  file_size_bytes bigint,
  upload_date     date not null default current_date,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.12 AUDIT LOGS  (matches AuditLogRecord)
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.profiles(id) on delete set null,
  actor_name  text,
  actor_role  text,
  action      text not null,
  ip_address  text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.13 CMS CONTENT  (website hero banner etc. — key/value jsonb)
-- ---------------------------------------------------------------------------
create table if not exists public.cms_content (
  key        text primary key,             -- e.g. 'home_hero'
  value      jsonb not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.14 SETTINGS  (org info + membership fees — key/value jsonb)
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  key        text primary key,             -- e.g. 'org', 'fees'
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2.15 ACTIVITIES  (recent-activity feed — matches ActivityItem)
-- ---------------------------------------------------------------------------
create table if not exists public.activities (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  activity_type public.activity_type not null default 'volunteer',
  icon          text,
  occurred_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- 3. INDEXES  (for fast lookups / searches used in the app)
-- ============================================================================
create index if not exists idx_profiles_member_id     on public.profiles (member_id);
create index if not exists idx_profiles_email         on public.profiles (email);
create index if not exists idx_profiles_status        on public.profiles (status);
create index if not exists idx_profiles_role          on public.profiles (role);
create index if not exists idx_profiles_auth_user     on public.profiles (auth_user_id);

create index if not exists idx_registrations_status   on public.registrations (status);
create index if not exists idx_registrations_email    on public.registrations (email);
create index if not exists idx_registrations_member   on public.registrations (member_id);
create index if not exists idx_registrations_profile  on public.registrations (profile_id);

create index if not exists idx_education_reg          on public.education (registration_id);
create index if not exists idx_experience_reg         on public.experience (registration_id);
create index if not exists idx_documents_reg          on public.documents (registration_id);
create index if not exists idx_documents_profile      on public.documents (profile_id);

create index if not exists idx_projects_status        on public.projects (status);
create index if not exists idx_projects_category      on public.projects (category);

create index if not exists idx_donations_status       on public.donations (status);
create index if not exists idx_donations_receipt      on public.donations (receipt_number);
create index if not exists idx_donations_txn          on public.donations (transaction_id);

create index if not exists idx_certificates_user      on public.certificates (user_id);
create index if not exists idx_certificates_number    on public.certificates (certificate_number);

create index if not exists idx_gallery_date           on public.gallery_items (item_date desc);
create index if not exists idx_partners_order         on public.partners (display_order);

create index if not exists idx_audit_created          on public.audit_logs (created_at desc);
create index if not exists idx_activities_created     on public.activities (occurred_at desc);

-- ============================================================================
-- 4. TRIGGERS
-- ============================================================================

-- 4.1 Auto-update "updated_at" on any row change
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_registrations_updated on public.registrations;
create trigger trg_registrations_updated before update on public.registrations
  for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists trg_cms_updated on public.cms_content;
create trigger trg_cms_updated before update on public.cms_content
  for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated on public.settings;
create trigger trg_settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

-- 4.2 Auto-create a profile when a new user signs up via Supabase Auth
--     If a demo profile already exists with the same email (e.g. seeded data),
--     the new Auth account is linked to that profile instead.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_member_id text;
begin
  -- 1) If a profile already exists with this email, just link the auth id
  update public.profiles
     set auth_user_id = new.id,
         updated_at   = now()
   where email = new.email
     and auth_user_id is null;

  -- 2) Otherwise create a brand-new profile (member id like AST-AB12CD34)
  if not found then
    new_member_id := 'AST-' || upper(substr(replace(new.id::text, '-', ''), 1, 8));
    insert into public.profiles (auth_user_id, member_id, email, full_name, role, status)
    values (
      new.id,
      new_member_id,
      new.email,
      coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
      'student',
      'Pending'
    )
    on conflict (auth_user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 5. HELPER FUNCTIONS FOR ROW LEVEL SECURITY
-- ============================================================================

-- Is the current user an Admin / Super Admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and p.role in ('admin', 'super_admin')
  );
$$;

-- Is the current user a Super Admin only?
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and p.role = 'super_admin'
  );
$$;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 6.1 PROFILES
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- NOTE: profiles table is NOT public-readable (privacy: emails/phones/addresses).
-- Public visitors see only safe fields via the public_members view below.
-- ⚠️ Members MUST be able to SELECT their own row, otherwise PostgreSQL also
--    blocks their own UPDATE (verified in live tests) — so the own-view policy
--    is REQUIRED alongside the own-update policy.

drop policy if exists "Public profiles are viewable by everyone"   on public.profiles;
drop policy if exists "Users can view own profile"                 on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = auth_user_id);

drop policy if exists "Users can insert their own profile"          on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = auth_user_id);

drop policy if exists "Users can update own profile"                on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = auth_user_id);

drop policy if exists "Admins can manage all profiles"              on public.profiles;
create policy "Admins can manage all profiles"
  on public.profiles for all
  using (public.is_admin());

-- Safe public members directory view (no email/phone/dob/address!)
create or replace view public.public_members as
  select member_id, full_name, role, status, location, avatar_url, registration_date
  from public.profiles
  where status <> 'Inactive';

grant select on public.public_members to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6.2 REGISTRATIONS
-- ---------------------------------------------------------------------------
alter table public.registrations enable row level security;

-- NOTE: public write endpoints (registration, donate, document upload) should
-- be called with plain .insert() (NOT .insert().select()) — PostgreSQL rejects
-- INSERT ... RETURNING unless the inserted row also passes the SELECT policies.
-- The app already generates the member ID client-side, so no RETURNING needed.
drop policy if exists "Anyone can submit a registration"            on public.registrations;
create policy "Anyone can submit a registration"
  on public.registrations for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Applicants can view own registration"        on public.registrations;
create policy "Applicants can view own registration"
  on public.registrations for select
  using (
    email = auth.email()
    or auth.uid() = (select p.auth_user_id from public.profiles p where p.id = profile_id)
  );

drop policy if exists "Admins can manage registrations"             on public.registrations;
create policy "Admins can manage registrations"
  on public.registrations for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.3 EDUCATION / EXPERIENCE / DOCUMENTS
-- ---------------------------------------------------------------------------
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.documents enable row level security;

drop policy if exists "Admins can manage education"                 on public.education;
create policy "Admins can manage education"
  on public.education for all
  using (public.is_admin());

drop policy if exists "Applicants can view own education"           on public.education;
create policy "Applicants can view own education"
  on public.education for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.registrations r
      where r.id = education.registration_id
        and (r.email = auth.email()
             or auth.uid() = (select p.auth_user_id from public.profiles p where p.id = r.profile_id))
    )
  );

drop policy if exists "Admins can manage experience"                on public.experience;
create policy "Admins can manage experience"
  on public.experience for all
  using (public.is_admin());

drop policy if exists "Applicants can view own experience"          on public.experience;
create policy "Applicants can view own experience"
  on public.experience for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.registrations r
      where r.id = experience.registration_id
        and (r.email = auth.email()
             or auth.uid() = (select p.auth_user_id from public.profiles p where p.id = r.profile_id))
    )
  );

drop policy if exists "Applicants can upload own documents"         on public.documents;
create policy "Applicants can upload own documents"
  on public.documents for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Applicants can view own documents"           on public.documents;
create policy "Applicants can view own documents"
  on public.documents for select
  using (
    public.is_admin()
    or auth.uid() = (select p.auth_user_id from public.profiles p where p.id = documents.profile_id)
    or exists (
      select 1 from public.registrations r
      where r.id = documents.registration_id
        and r.email = auth.email()
    )
  );

drop policy if exists "Admins can manage documents"                 on public.documents;
create policy "Admins can manage documents"
  on public.documents for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.4 PROJECTS
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "Projects are public"                         on public.projects;
create policy "Projects are public"
  on public.projects for select
  using (true);

drop policy if exists "Admins can manage projects"                  on public.projects;
create policy "Admins can manage projects"
  on public.projects for all
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.5 DONATIONS
-- ---------------------------------------------------------------------------
alter table public.donations enable row level security;

drop policy if exists "Anyone can donate"                           on public.donations;
create policy "Anyone can donate"
  on public.donations for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Donors can view own donations"               on public.donations;
create policy "Donors can view own donations"
  on public.donations for select
  using (email = auth.email());

drop policy if exists "Admins can manage donations"                 on public.donations;
create policy "Admins can manage donations"
  on public.donations for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.6 CERTIFICATES
-- ---------------------------------------------------------------------------
alter table public.certificates enable row level security;

drop policy if exists "Users can view own certificates"             on public.certificates;
create policy "Users can view own certificates"
  on public.certificates for select
  using (
    public.is_admin()
    or auth.uid() = (select p.auth_user_id from public.profiles p where p.id = certificates.user_id)
  );

drop policy if exists "Admins can manage certificates"              on public.certificates;
create policy "Admins can manage certificates"
  on public.certificates for all
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.7 GALLERY / PARTNERS / LEGAL DOCUMENTS / ACTIVITIES  (public read)
-- ---------------------------------------------------------------------------
alter table public.gallery_items enable row level security;
alter table public.partners enable row level security;
alter table public.legal_documents enable row level security;
alter table public.activities enable row level security;

drop policy if exists "Gallery is public"                           on public.gallery_items;
create policy "Gallery is public"
  on public.gallery_items for select using (true);

drop policy if exists "Admins can manage gallery"                   on public.gallery_items;
create policy "Admins can manage gallery"
  on public.gallery_items for all using (public.is_admin());

drop policy if exists "Partners are public"                         on public.partners;
create policy "Partners are public"
  on public.partners for select using (true);

drop policy if exists "Admins can manage partners"                  on public.partners;
create policy "Admins can manage partners"
  on public.partners for all using (public.is_admin());

drop policy if exists "Legal documents are public"                  on public.legal_documents;
create policy "Legal documents are public"
  on public.legal_documents for select using (true);

drop policy if exists "Admins can manage legal documents"           on public.legal_documents;
create policy "Admins can manage legal documents"
  on public.legal_documents for all using (public.is_admin());

drop policy if exists "Activity feed is public"                     on public.activities;
create policy "Activity feed is public"
  on public.activities for select using (true);

drop policy if exists "Admins can manage activities"                on public.activities;
create policy "Admins can manage activities"
  on public.activities for all using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.8 AUDIT LOGS  (admin only)
-- ---------------------------------------------------------------------------
alter table public.audit_logs enable row level security;

drop policy if exists "Only admins can view audit logs"             on public.audit_logs;
create policy "Only admins can view audit logs"
  on public.audit_logs for select
  using (public.is_admin());

drop policy if exists "Only admins can write audit logs"            on public.audit_logs;
create policy "Only admins can write audit logs"
  on public.audit_logs for insert
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.9 CMS CONTENT  (public read, admin write)
-- ---------------------------------------------------------------------------
alter table public.cms_content enable row level security;

drop policy if exists "CMS content is public"                       on public.cms_content;
create policy "CMS content is public"
  on public.cms_content for select using (true);

drop policy if exists "Admins can manage CMS"                       on public.cms_content;
create policy "Admins can manage CMS"
  on public.cms_content for all using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.10 SETTINGS  (public read, admin write)
-- ---------------------------------------------------------------------------
alter table public.settings enable row level security;

drop policy if exists "Settings are public"                         on public.settings;
create policy "Settings are public"
  on public.settings for select using (true);

drop policy if exists "Admins can manage settings"                  on public.settings;
create policy "Admins can manage settings"
  on public.settings for all using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6.11 PUBLIC STATUS VIEW  (safe "Check Application Status" lookup)
--     Exposes ONLY status fields by reference number — no emails/phones/
--     addresses. Works with the app's CheckStatusModal.
--
--     ⚠️ IMPORTANT: Supabase's SQL Editor creates views with
--     security_invoker=on by default, which makes the view obey the caller's
--     RLS (so anon would see 0 rows). We reset it to owner privileges so the
--     view itself is queryable by anyone, while still exposing only safe
--     columns (defense-in-depth: view exposes no PII).
-- ---------------------------------------------------------------------------
create or replace view public.registration_status as
  select member_id, applicant_name, role, status, step_completed, total_steps,
         remarks, submitted_at
  from public.registrations
  where member_id is not null;

alter view public.registration_status reset (security_invoker);

grant select on public.registration_status to anon, authenticated;

-- ============================================================================
-- 7. STORAGE BUCKETS (for file uploads: photos, documents, images)
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',          'avatars',          true,  5242880,  array['image/png','image/jpeg','image/webp']::text[]),
  ('documents',        'documents',        false, 10485760, array['application/pdf','image/png','image/jpeg']::text[]),
  ('gallery-images',   'gallery-images',   true,  10485760, array['image/png','image/jpeg','image/webp']::text[]),
  ('partner-logos',    'partner-logos',    true,  2097152,  array['image/png','image/jpeg','image/svg+xml','image/webp']::text[]),
  ('legal-documents',  'legal-documents',  true,  20971520, array['application/pdf']::text[]),
  ('certificates',     'certificates',     true,  5242880,  array['application/pdf','image/png','image/jpeg']::text[])
on conflict (id) do nothing;

-- Public read on public buckets
drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Public read gallery" on storage.objects;
create policy "Public read gallery"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

drop policy if exists "Public read partner logos" on storage.objects;
create policy "Public read partner logos"
  on storage.objects for select
  using (bucket_id = 'partner-logos');

drop policy if exists "Public read legal docs" on storage.objects;
create policy "Public read legal docs"
  on storage.objects for select
  using (bucket_id = 'legal-documents');

drop policy if exists "Public read certificates" on storage.objects;
create policy "Public read certificates"
  on storage.objects for select
  using (bucket_id = 'certificates');

-- Authenticated users can upload avatars + their own documents
drop policy if exists "Authenticated users can upload avatars" on storage.objects;
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

drop policy if exists "Authenticated users can upload documents" on storage.objects;
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents');

-- Admins can manage everything in storage
drop policy if exists "Admins can manage storage" on storage.objects;
create policy "Admins can manage storage"
  on storage.objects for all
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- 8. GRANTS  (Supabase adds these by default, but keeping them makes the
--    script work even on projects with restricted default grants)
-- ============================================================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;

-- ============================================================================
-- 9. DONE ✅
-- ============================================================================
-- Next step: run seed.sql (or run complete-setup.sql which includes both).
-- Then create your first Admin user in Auth → Users → Invite user,
-- and set that user's role to 'super_admin' in the profiles table.


-- ============================================================================
-- ASTHA FOUNDATION — SEED DATA
-- ----------------------------------------------------------------------------
-- Demo data matching the app's INITIAL_* arrays (users, projects, applications,
-- activities, donations, certificates, gallery, partners, legal docs, etc.)
-- Run AFTER schema.sql — or just run complete-setup.sql which contains both.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES  (from src/data.ts → INITIAL_USERS)
--    auth_user_id is NULL → these are demo members, not Auth accounts.
-- ---------------------------------------------------------------------------
insert into public.profiles
  (id, auth_user_id, member_id, full_name, email, phone, role, status, gender, dob, blood_group,
   location, qualification, organization, department, registration_date, valid_until, last_active_at)
values
  ('11111111-1111-4111-8111-111111111101', null, 'AST-2024-8902', 'Rahul Sharma',    'rahul.sharma@example.com',  '+91 98765 43210', 'coordinator', 'Active',  'Male',   '1998-08-15', 'O+',  'Mumbai, MH',   'B.Tech Computer Science',     'Tech Mahindra Foundation',    'Education',            '2024-10-12', '2026-12-31', now()),
  ('11111111-1111-4111-8111-111111111102', null, 'AST-DID-9012', 'Priya Verma',     'priya.v@example.com',       '+91 98123 45678', 'didi',        'Active',  'Female', '1999-04-22', 'B+',  'Pune, MH',     'M.A. Social Work',            'Fergusson College',           'Health - Rural',       '2024-10-14', '2026-12-31', now()),
  ('11111111-1111-4111-8111-111111111103', null, 'AST-MAA-1024', 'Sunita Devi',     'sunita.devi@example.com',   '+91 97654 32109', 'maa',         'Active',  'Female', '1975-11-12', 'A+',  'Nagpur, MH',   'Higher Secondary',            'Self Employed / Community Leader', 'Community - Women', '2024-10-10', '2026-12-31', now()),
  ('11111111-1111-4111-8111-111111111104', null, 'AST-TCH-3341', 'Anil Kumar',      'anil.k@example.com',        '+91 95432 10987', 'teacher',     'Pending', 'Male',   '1988-01-05', 'AB+', 'Nashik, MH',   'B.Ed Mathematics',            'Zilla Parishad High School',  'Education',            '2024-10-08', '2025-12-31', now()),
  ('11111111-1111-4111-8111-111111111105', null, 'AST-STD-5512', 'Aarav Patel',     'aarav.p@example.com',       '+91 91234 56789', 'student',     'Pending', 'Male',   '2006-06-10', 'O+',  'Thane, MH',    '12th Grade Student',          'Thane Model School',          'Events',               '2024-10-18', '2025-12-31', null),
  ('11111111-1111-4111-8111-111111111106', null, 'AST-COORD-88', 'Rajesh Deshmukh', 'rajesh.d@example.com',      '+91 98888 77766', 'coordinator', 'Active', 'Male',   '1982-03-18', 'B+',  'Chhatrapati Sambhajinagar, MH', 'M.B.A. Public Administration', 'Astha Foundation Regional Wing', 'Management',       '2024-09-28', '2027-12-31', now())
on conflict (member_id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. PROJECTS  (from INITIAL_PROJECTS)
-- ---------------------------------------------------------------------------
insert into public.projects (id, title, category, description, raised, goal, image_url, status, created_at)
values
  ('22222222-2222-4222-8222-222222222201', 'Rural Education Initiative',  'Education', 'Providing digital classrooms, stationery, and dedicated mentors for over 500 children in remote villages.', 45000, 60000, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800', 'Active',    now() - interval '40 days'),
  ('22222222-2222-4222-8222-222222222202', 'Clean Water & Sanitation',    'Health',    'Installing solar-powered water purification units and building sanitation facilities in underprivileged schools.', 20000, 50000, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800', 'Active',    now() - interval '25 days')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. REGISTRATIONS / APPLICATIONS  (from INITIAL_APPLICATIONS)
-- ---------------------------------------------------------------------------
insert into public.registrations
  (id, profile_id, member_id, applicant_name, role, email, phone, gender, location, status, step_completed, total_steps, remarks, submitted_at)
values
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111101', 'AST-2024-8902', 'Rahul Sharma',  'coordinator', 'rahul.sharma@example.com', '+91 98765 43210', 'Male',   'Mumbai, MH', 'Approved',      4, 4, 'Identity verified. Training badge issued.',  '2024-10-12'),
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111102', 'AST-DID-9012', 'Priya Verma',   'didi',        'priya.v@example.com',      '+91 98123 45678', 'Female', 'Pune, MH',    'Approved',      4, 4, 'Community screening complete.',               '2024-10-14'),
  ('33333333-3333-4333-8333-333333333303', '11111111-1111-4111-8111-111111111103', 'AST-MAA-1024', 'Sunita Devi',   'maa',         'sunita.devi@example.com',  '+91 97654 32109', 'Female', 'Nagpur, MH',  'Approved',      4, 4, 'Maternal health certification verified.',     '2024-10-10'),
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111104', 'AST-TCH-3341', 'Anil Kumar',    'teacher',     'anil.k@example.com',       '+91 95432 10987', 'Male',   'Nashik, MH',  'Under Review',  3, 4, 'Awaiting B.Ed certificate verification.',     '2024-10-08')
on conflict (id) do nothing;

-- Sample education + experience rows for Priya Verma's application
insert into public.education (id, registration_id, degree, institution, period, honours) values
  ('44444444-4444-4444-8444-444444444401', '33333333-3333-4333-8333-333333333302', 'Master of Social Work (MSW)', 'University of Rajasthan', '2020 - 2022', 'First Class Honours'),
  ('44444444-4444-4444-8444-444444444402', '33333333-3333-4333-8333-333333333302', 'B.A. Sociology',              'Maharani College',        '2017 - 2020', null)
on conflict (id) do nothing;

insert into public.experience (id, registration_id, role, organization, period, description) values
  ('55555555-5555-4555-8555-555555555501', '33333333-3333-4333-8333-333333333302', 'Community Outreach Coordinator', 'Pratham NGO',      'Jan 2023 - Present', 'Led rural education initiatives impacting 500+ children.'),
  ('55555555-5555-4555-8555-555555555502', '33333333-3333-4333-8333-333333333302', 'Volunteer Teacher',              'Teach for India',  '2021 - 2022',       'Guided primary students in foundational literacy and arithmetic.')
on conflict (id) do nothing;

-- Sample documents for Priya's application (admin review screen)
insert into public.documents (id, registration_id, title, doc_type, file_name, size_bytes, status) values
  ('66666666-6666-4666-8666-666666666601', '33333333-3333-4333-8333-333333333302', 'National ID (Aadhaar)',     'PDF', 'aadhaar.pdf',  1258291, 'Verified'),
  ('66666666-6666-4666-8666-666666666602', '33333333-3333-4333-8333-333333333302', 'MSW Degree Certificate',    'PDF', 'msw.pdf',      2516582, 'Pending'),
  ('66666666-6666-4666-8666-666666666603', '33333333-3333-4333-8333-333333333302', 'Reference Letter',          'PDF', 'ref_letter.pdf', 838860, 'Pending')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 4. DONATIONS  (from AdminDonationsPage)
-- ---------------------------------------------------------------------------
insert into public.donations (id, donor_name, email, amount, transaction_id, status, reg_80g_number, receipt_number, donated_at)
values
  ('77777777-7777-4777-8777-777777777701', 'Rajesh Sharma', 'rajesh.sharma@example.com', 5000,  'TXN983427182', 'Success', 'AAATA1234F/80G/2025', 'ASTHA/REC/2026/089', '2026-07-28 14:20'),
  ('77777777-7777-4777-8777-777777777702', 'Priya Verma',   'priya.v@example.com',      12000, 'TXN983427183', 'Success', 'AAATA1234F/80G/2025', 'ASTHA/REC/2026/090', '2026-07-29 11:05'),
  ('77777777-7777-4777-8777-777777777703', 'Amit Patel',    'amit.patel@example.com',   2500,  'TXN983427184', 'Success', 'AAATA1234F/80G/2025', 'ASTHA/REC/2026/091', '2026-07-30 09:45'),
  ('77777777-7777-4777-8777-777777777704', 'Sunita Gupta',  'sunita.g@example.com',     10000, 'TXN983427185', 'Pending', 'AAATA1234F/80G/2025', 'ASTHA/REC/2026/092', '2026-07-31 08:30')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 5. CERTIFICATES  (admin certificates + user-visible certificate wall)
-- ---------------------------------------------------------------------------
insert into public.certificates
  (id, user_id, recipient_name, certificate_type, certificate_number, issue_date, category, description, project_name, badge_type, featured, qr_code)
values
  ('88888888-8888-4888-8888-888888888801', '11111111-1111-4111-8111-111111111102', 'Anita Deshmukh', 'Training Certificate',   'ASTHA/TRN/2026/401', '2026-07-15', 'Training', null, null, null, false, 'VERIFIED-QR-401'),
  ('88888888-8888-4888-8888-888888888802', '11111111-1111-4111-8111-111111111102', 'Pooja Verma',    'Internship Certificate', 'ASTHA/INT/2026/402', '2026-07-20', 'Skills',   null, null, null, false, 'VERIFIED-QR-402'),
  ('88888888-8888-4888-8888-888888888803', '11111111-1111-4111-8111-111111111105', 'Aarav Patel',    'Training Certificate',   'AST-24-091',         '2024-10-01', 'Community', 'Awarded for completing over 100 hours of dedicated community outreach and support.', 'Winter Warmth Drive', 'verified', true, 'VERIFIED-QR-091')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 6. GALLERY  (from AdminGalleryPage)
-- ---------------------------------------------------------------------------
insert into public.gallery_items (id, title, category, image_url, item_date)
values
  ('99999999-9999-4999-8999-999999999901', 'Astha Didi Skill Training Camp',     'Training',     'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', '2026-07-28'),
  ('99999999-9999-4999-8999-999999999902', 'Women Empowerment Workshop',         'Empowerment',  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800', '2026-07-25'),
  ('99999999-9999-4999-8999-999999999903', 'Rural Student Digital Literacy Camp','Education',    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800', '2026-07-20')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 7. PARTNERS  (from AdminPartnersPage)
-- ---------------------------------------------------------------------------
insert into public.partners (id, name, logo_url, website, display_order, status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'NABARD Rural Dev',      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200', 'https://nabard.org',       1, 'Active'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Skill India Mission',   'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=200', 'https://skillindia.gov.in', 2, 'Active'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Ministry of Women & Child', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200', 'https://wcd.nic.in',      3, 'Active')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 8. LEGAL DOCUMENTS  (from AdminLegalPage)
-- ---------------------------------------------------------------------------
insert into public.legal_documents (id, title, category, file_name, file_size_bytes, upload_date)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb01', 'Trust Deed & Registration Certificate', 'Registration',   'trust-deed.pdf',   2516582, '2025-01-10'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02', '80G Tax Exemption Certificate',         'Tax Exemption',  '80g-cert.pdf',     1153434, '2025-04-15'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb03', '12A Registration Certificate',           'Tax Exemption',  '12a-cert.pdf',     1003520, '2025-04-15'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb04', 'PAN Card of Astha Foundation',           'Tax & Financial','pan-card.pdf',     471859,  '2025-01-12')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 9. AUDIT LOGS  (from AdminAuditLogsPage)
-- ---------------------------------------------------------------------------
insert into public.audit_logs (actor_name, actor_role, action, ip_address, created_at)
values
  ('Super Admin',  'SuperAdmin', 'Approved registration for Astha Didi #ASTHA-109',          '192.168.1.45', '2026-07-31 13:10:22'),
  ('Admin Suresh', 'Admin',      'Generated ID Card for Teacher #ASTHA-204',                  '192.168.1.88', '2026-07-31 11:45:12'),
  ('System',       'Automated',  'Verified Razorpay donation transaction TXN983427182',       '10.0.0.1',     '2026-07-30 14:20:05'),
  ('Admin Priya',  'Admin',      'Uploaded new legal document: 80G Certificate 2026',          '192.168.1.12', '2026-07-29 09:15:30')
;

-- ---------------------------------------------------------------------------
-- 10. CMS CONTENT  (home banner — from AdminCMSPage)
-- ---------------------------------------------------------------------------
insert into public.cms_content (key, value)
values
  ('home_hero', jsonb_build_object(
      'heroTitle',    'Empowering Rural Women & Transforming Grassroots Communities',
      'heroSubtitle', 'Join Astha Foundation as an Astha Didi, Astha Maa, or Teacher. Together we build self-reliance and education across India.'
  ))
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ---------------------------------------------------------------------------
-- 11. SETTINGS  (org info + membership fees — from AdminSettingsPage)
-- ---------------------------------------------------------------------------
insert into public.settings (key, value)
values
  ('org', jsonb_build_object(
      'orgName',  'Astha Foundation',
      'orgEmail', 'contact@asthafoundation.org',
      'orgPhone', '+91 98765 43210'
  )),
  ('fees', jsonb_build_object(
      'didiFee',    500,
      'maaFee',     500,
      'teacherFee', 1000
  ))
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ---------------------------------------------------------------------------
-- 12. ACTIVITIES  (from INITIAL_ACTIVITIES)
-- ---------------------------------------------------------------------------
insert into public.activities (title, activity_type, icon, occurred_at)
values
  ('Rahul Sharma registered as Volunteer',           'volunteer', 'person_add',  now() - interval '10 minutes'),
  ('Received ₹250 donation for Rural Education',     'donation',  'payments',    now() - interval '25 minutes'),
  ('Clean Water Project reached 40% funding target', 'project',   'water_drop',  now() - interval '2 hours'),
  ('Priya Verma (Astha Didi) ID card generated',     'status',    'badge',       now() - interval '4 hours')
;

-- ============================================================================
-- Done ✅  (all demo data inserted)
-- ============================================================================
