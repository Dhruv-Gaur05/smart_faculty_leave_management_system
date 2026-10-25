-- ==============================================================================
-- SMART FACULTY LEAVE MANAGEMENT AND APPROVAL SYSTEM
-- Initial Database Foundation Schema (Supabase PostgreSQL)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABLE: departments
-- Stores academic and administrative departments in the university.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_name TEXT NOT NULL UNIQUE,
    hod_id UUID, -- Foreign key constraint added after profiles table creation
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 2. TABLE: profiles
-- Stores faculty, HODs, and administrators linked to Supabase Auth.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    designation TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('faculty', 'hod', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add Foreign Key for departments.hod_id referencing profiles.id
ALTER TABLE departments 
    DROP CONSTRAINT IF EXISTS fk_departments_hod;

ALTER TABLE departments 
    ADD CONSTRAINT fk_departments_hod 
    FOREIGN KEY (hod_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- ==============================================================================
-- 3. TABLE: leave_types
-- Stores university-defined leave categories (e.g., Casual, Earned, Medical, Duty).
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    requires_document BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. TABLE: leave_applications
-- Stores leave requests submitted by faculty members.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leave_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    days NUMERIC(4, 1) NOT NULL CHECK (days > 0),
    reason TEXT NOT NULL,
    contact_during_leave TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'clarification')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_valid_date_range CHECK (to_date >= from_date)
);

-- ==============================================================================
-- 5. TABLE: approvals
-- Stores the audit trail of decisions made by HODs/Approvers for leave requests.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leave_id UUID NOT NULL REFERENCES leave_applications(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'clarification')),
    remarks TEXT,
    action_time TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON profiles(employee_id);

-- Leave applications indexes
CREATE INDEX IF NOT EXISTS idx_leave_applications_faculty_id ON leave_applications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_leave_type_id ON leave_applications(leave_type_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_leave_applications_dates ON leave_applications(from_date, to_date);

-- Approvals indexes
CREATE INDEX IF NOT EXISTS idx_approvals_leave_id ON approvals(leave_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver_id ON approvals(approver_id);

-- ==============================================================================
-- TRIGGER: Automatically update 'updated_at' on leave_applications
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_leave_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leave_applications_updated_at ON leave_applications;
CREATE TRIGGER trg_leave_applications_updated_at
BEFORE UPDATE ON leave_applications
FOR EACH ROW
EXECUTE FUNCTION update_leave_applications_updated_at();

-- ==============================================================================
-- SEED DATA: Standard University Leave Types
-- ==============================================================================
INSERT INTO leave_types (name, description, requires_document) VALUES
    ('Casual Leave (CL)', 'Leave for unforeseen personal circumstances and short absences.', FALSE),
    ('Earned Leave (EL)', 'Leaves earned through continuous service, usable for extended vacations or personal commitments.', FALSE),
    ('Medical Leave (ML)', 'Leave granted on health grounds, requiring medical documentation from a certified practitioner.', TRUE),
    ('Duty Leave (DL)', 'Leave granted for attending official conferences, symposia, examination duties, or university assignments.', TRUE),
    ('Special Casual Leave (SCL)', 'Leave for participating in academic governance, sports, or specialized research activities.', FALSE)
ON CONFLICT (name) DO NOTHING;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- Helper functions to get current user role and department
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_current_user_department()
RETURNS UUID AS $$
  SELECT department_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ------------------------------------------------------------------------------
-- POLICIES: leave_types (Read for all, write for admin)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read access to leave types" ON leave_types;
CREATE POLICY "Allow public read access to leave types"
ON leave_types FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Allow admins to manage leave types" ON leave_types;
CREATE POLICY "Allow admins to manage leave types"
ON leave_types FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- ------------------------------------------------------------------------------
-- POLICIES: departments (Read for all, write for admin)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow read access to departments" ON departments;
CREATE POLICY "Allow read access to departments"
ON departments FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Allow admins to manage departments" ON departments;
CREATE POLICY "Allow admins to manage departments"
ON departments FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- ------------------------------------------------------------------------------
-- POLICIES: profiles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
CREATE POLICY "Allow authenticated users to read profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid() OR get_current_user_role() = 'admin')
WITH CHECK (id = auth.uid() OR get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Allow users or service to insert profile" ON profiles;
CREATE POLICY "Allow users or service to insert profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR get_current_user_role() = 'admin');

-- ------------------------------------------------------------------------------
-- POLICIES: leave_applications
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow viewing leave applications based on role" ON leave_applications;
CREATE POLICY "Allow viewing leave applications based on role"
ON leave_applications FOR SELECT
TO authenticated
USING (
    faculty_id = auth.uid() 
    OR get_current_user_role() = 'admin'
    OR (
        get_current_user_role() = 'hod' 
        AND faculty_id IN (
            SELECT id FROM profiles WHERE department_id = get_current_user_department()
        )
    )
);

DROP POLICY IF EXISTS "Allow faculty to submit leave applications" ON leave_applications;
CREATE POLICY "Allow faculty to submit leave applications"
ON leave_applications FOR INSERT
TO authenticated
WITH CHECK (faculty_id = auth.uid());

DROP POLICY IF EXISTS "Allow updating leave applications" ON leave_applications;
CREATE POLICY "Allow updating leave applications"
ON leave_applications FOR UPDATE
TO authenticated
USING (
    (faculty_id = auth.uid() AND status = 'pending')
    OR get_current_user_role() = 'admin'
    OR (
        get_current_user_role() = 'hod' 
        AND faculty_id IN (
            SELECT id FROM profiles WHERE department_id = get_current_user_department()
        )
    )
)
WITH CHECK (
    (faculty_id = auth.uid() AND status = 'pending')
    OR get_current_user_role() IN ('hod', 'admin')
);

-- ------------------------------------------------------------------------------
-- POLICIES: approvals
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow reading approvals" ON approvals;
CREATE POLICY "Allow reading approvals"
ON approvals FOR SELECT
TO authenticated
USING (
    leave_id IN (SELECT id FROM leave_applications WHERE faculty_id = auth.uid())
    OR get_current_user_role() IN ('hod', 'admin')
);

DROP POLICY IF EXISTS "Allow HOD and Admin to insert approvals" ON approvals;
CREATE POLICY "Allow HOD and Admin to insert approvals"
ON approvals FOR INSERT
TO authenticated
WITH CHECK (
    approver_id = auth.uid() 
    AND get_current_user_role() IN ('hod', 'admin')
);
