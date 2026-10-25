-- ==============================================================================
-- HELPER SCRIPT: Create Test Profiles & Auto-Profile Sync Trigger
-- ==============================================================================

-- 1. TRIGGER TO AUTOMATICALLY SYNC AUTH USERS TO PROFILES
-- Whenever a user is registered in Supabase Auth (auth.users), this trigger
-- will automatically generate an initial record in public.profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role TEXT := 'faculty';
    default_name TEXT := 'Academic Faculty';
    default_emp_id TEXT := 'FAC-' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 6);
    user_metadata JSONB := NEW.raw_user_meta_data;
BEGIN
    -- Extract role and metadata if provided during signup, or default to faculty
    IF user_metadata ? 'role' THEN
        default_role := user_metadata->>'role';
    END IF;
    
    IF user_metadata ? 'name' THEN
        default_name := user_metadata->>'name';
    ELSIF NEW.email IS NOT NULL THEN
        default_name := SPLIT_PART(NEW.email, '@', 1);
    END IF;

    IF user_metadata ? 'employee_id' THEN
        default_emp_id := user_metadata->>'employee_id';
    END IF;

    INSERT INTO public.profiles (
        id,
        employee_id,
        name,
        email,
        designation,
        role
    ) VALUES (
        NEW.id,
        default_emp_id,
        default_name,
        NEW.email,
        CASE 
            WHEN default_role = 'admin' THEN 'System Administrator'
            WHEN default_role = 'hod' THEN 'Head of Department'
            ELSE 'Assistant Professor'
        END,
        default_role
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        designation = EXCLUDED.designation;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 2. SQL SNIPPET TO UPDATE ROLES FOR EXISTING TEST USERS
-- If you create users manually in Supabase Dashboard (Auth -> Users -> Add User):
-- Replace 'user-email@university.edu' below and run to assign roles:
-- ==============================================================================

/*
-- Example: Assign Faculty Role
UPDATE public.profiles
SET 
    role = 'faculty',
    name = 'Dr. Rajesh Sharma',
    designation = 'Associate Professor',
    employee_id = 'FAC-2026-042'
WHERE email = 'faculty@university.edu';

-- Example: Assign HOD Role
UPDATE public.profiles
SET 
    role = 'hod',
    name = 'Prof. Ananya Sen',
    designation = 'Head of Department (CSE)',
    employee_id = 'HOD-CSE-001'
WHERE email = 'hod@university.edu';

-- Example: Assign Admin Role
UPDATE public.profiles
SET 
    role = 'admin',
    name = 'Dr. Vikramaditya Rao',
    designation = 'Dean of Academic Affairs',
    employee_id = 'ADM-2026-001'
WHERE email = 'admin@university.edu';
*/
