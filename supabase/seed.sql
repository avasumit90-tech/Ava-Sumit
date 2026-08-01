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
