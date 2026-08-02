-- ====================================================================
-- AVA FOUNDATION - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- ====================================================================
-- Execute this script directly in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- TABLE 1: DONATIONS & 80G RECEIPT VERIFICATION DATABASE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.donations (
    id TEXT PRIMARY KEY DEFAULT ('DON-' || floor(1000 + random() * 9000)::text),
    donor_name TEXT NOT NULL,
    email TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    transaction_id TEXT NOT NULL UNIQUE,
    screenshot_url TEXT,
    payment_method TEXT CHECK (payment_method IN ('upi', 'card', 'netbanking')) DEFAULT 'upi',
    status TEXT CHECK (status IN ('Pending (24 Hours)', 'Approved', 'Rejected')) DEFAULT 'Pending (24 Hours)',
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reg_80g_number TEXT DEFAULT 'AAATA5416F/80G/2026',
    receipt_number TEXT UNIQUE,
    donor_pan TEXT,
    donor_phone TEXT,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for fast search and admin filters
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_email ON public.donations(email);
CREATE INDEX IF NOT EXISTS idx_donations_txn ON public.donations(transaction_id);

-- --------------------------------------------------------------------
-- TABLE 2: COMMUNITY USERS & DIDI/MAA/TEACHER DIRECTORY
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('didi', 'maa', 'teacher', 'student', 'coordinator', 'admin')) DEFAULT 'didi',
    location TEXT,
    registration_date DATE DEFAULT CURRENT_DATE,
    status TEXT CHECK (status IN ('Active', 'Pending', 'Inactive')) DEFAULT 'Active',
    avatar TEXT,
    phone TEXT,
    dob DATE,
    blood_group TEXT,
    valid_until DATE,
    qualification TEXT,
    organization TEXT,
    department TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- --------------------------------------------------------------------
-- TABLE 3: COMMUNITY PROJECTS & FUNDRAISING GOALS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('Education', 'Health', 'Environment', 'Community')) NOT NULL,
    description TEXT NOT NULL,
    raised NUMERIC(12,2) DEFAULT 0,
    goal NUMERIC(12,2) NOT NULL CHECK (goal > 0),
    image TEXT,
    status TEXT CHECK (status IN ('Active', 'Completed')) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- TABLE 4: REGISTRATION APPLICATIONS & REVIEW PIPELINE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY DEFAULT ('APP-' || floor(1000 + random() * 9000)::text),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT,
    dob DATE,
    address TEXT,
    gram_panchayat TEXT,
    district_name TEXT,
    block_name TEXT,
    mother_name TEXT,
    village TEXT,
    post_office TEXT,
    state TEXT,
    father_husband_name TEXT,
    pan_number TEXT,
    bank_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    passport_photo TEXT,
    status TEXT CHECK (status IN ('Under Review', 'Approved', 'Action Required', 'Rejected')) DEFAULT 'Under Review',
    step_completed INT DEFAULT 1,
    total_steps INT DEFAULT 4,
    remarks TEXT,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- TABLE 5: SYSTEM ACTIVITY LOGS & AUDIT TRAIL
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    activity_time TEXT NOT NULL,
    type TEXT CHECK (type IN ('volunteer', 'donation', 'project', 'status')) NOT NULL,
    icon TEXT DEFAULT 'Heart',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- VIEW: MONTHLY DONATION TRENDS (For Recharts Dashboard Analytics)
-- --------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_monthly_donation_trends AS
SELECT 
    TO_CHAR(date, 'Mon') AS month,
    EXTRACT(MONTH FROM date) AS month_num,
    SUM(CASE WHEN status = 'Approved' THEN amount ELSE 0 END) AS total_approved,
    SUM(CASE WHEN status = 'Pending (24 Hours)' THEN amount ELSE 0 END) AS total_pending,
    COUNT(id) AS total_count
FROM public.donations
GROUP BY TO_CHAR(date, 'Mon'), EXTRACT(MONTH FROM date)
ORDER BY month_num;

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable anonymous read & insert access for web app API operations
-- --------------------------------------------------------------------
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo/application operation
CREATE POLICY "Allow anonymous read donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update donations" ON public.donations FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert users" ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous read activity_logs" ON public.activity_logs FOR SELECT USING (true);

-- --------------------------------------------------------------------
-- SEED INITIAL SEED DATA
-- --------------------------------------------------------------------
INSERT INTO public.donations (id, donor_name, email, amount, transaction_id, screenshot_url, payment_method, status, receipt_number, donor_pan, donor_phone, remarks)
VALUES 
('DON-1004', 'Sunita Gupta', 'sunita.g@example.com', 10000, 'UPI-983427185204', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600', 'upi', 'Pending (24 Hours)', 'AVA/REC/2026/104', 'ABCDE1234F', '+91 98765 11223', 'Awaiting admin verification of UPI transaction ID.'),
('DON-1003', 'Amit Patel', 'amit.patel@example.com', 2500, 'ICICI-883491029311', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600', 'upi', 'Approved', 'AVA/REC/2026/103', 'BGHKP9921M', '+91 98123 45678', 'Bank credit verified.'),
('DON-1002', 'Priya Verma', 'priya.v@example.com', 12000, 'TXN983427183', NULL, 'card', 'Approved', 'AVA/REC/2026/102', 'CKLPM8812K', '+91 99887 76655', '80G Tax receipt issued.'),
('DON-1001', 'Rajesh Sharma', 'rajesh.sharma@example.com', 5000, 'TXN983427182', NULL, 'netbanking', 'Approved', 'AVA/REC/2026/101', 'AAHTA5416F', '+91 91234 56789', 'Verified.')
ON CONFLICT (transaction_id) DO NOTHING;

INSERT INTO public.projects (id, title, category, description, raised, goal, image, status)
VALUES 
('proj-1', 'Astha Digital Shiksha Kendra', 'Education', 'Equipping 5 village centres with tablets and digital learning modules for rural girls.', 18500, 25000, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', 'Active'),
('proj-2', 'Maa Health & Nutrition Kit', 'Health', 'Distributing essential nutrition kits and maternal care guidebooks to young mothers.', 32000, 40000, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800', 'Active'),
('proj-3', 'Green Village Solar Lamps', 'Environment', 'Installing clean solar study lamps in homes with unstable grid power.', 15000, 15000, 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800', 'Completed')
ON CONFLICT (id) DO NOTHING;

-- Complete Database Schema Ready for Supabase!
