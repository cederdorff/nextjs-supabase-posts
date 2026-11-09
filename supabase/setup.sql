-- ============================================
-- POST APP: USERS + POSTS
-- Run the whole file in the SQL Editor in Supabase.
-- It deletes everything and creates it again, so you can run it again to start over.
-- ============================================

-- A trigger from an earlier version of this file
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- The 5 demo logins from an earlier run of this file
DELETE FROM auth.users WHERE id IN (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8000-000000000004',
    '00000000-0000-4000-8000-000000000005'
);

-- ============================================
-- 5 DEMO LOGINS
-- The 5 users from Post App get a real login, so you can log in as them.
-- Password for all of them: postapp123
-- ============================================

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new,
    email_change_token_current, phone_change_token, reauthentication_token
)
SELECT
    '00000000-0000-0000-0000-000000000000', demo.id, 'authenticated', 'authenticated', demo.email,
    extensions.crypt('postapp123', extensions.gen_salt('bf')), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW(),
    '', '', '', '', '', '', ''
FROM (
    VALUES
        ('00000000-0000-4000-8000-000000000001'::uuid, 'rasmus@example.com'),
        ('00000000-0000-4000-8000-000000000002'::uuid, 'maria@example.com'),
        ('00000000-0000-4000-8000-000000000003'::uuid, 'birgitte@example.com'),
        ('00000000-0000-4000-8000-000000000004'::uuid, 'lars@example.com'),
        ('00000000-0000-4000-8000-000000000005'::uuid, 'nikolaj@example.com')
) AS demo (id, email);

INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
SELECT
    gen_random_uuid(), id, id::text, 'email',
    jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
    NOW(), NOW(), NOW()
FROM auth.users
WHERE id IN (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8000-000000000004',
    '00000000-0000-4000-8000-000000000005'
);

-- ============================================
-- USERS
-- The same columns as in Post App – plus role.
-- id is the same id as the login in auth.users (the foreign key).
-- The app creates the row when someone signs up (app/signup/page.js).
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    mail TEXT NOT NULL,
    title TEXT,
    image TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- ============================================
-- POSTS
-- The same columns as in Post App. posts.userId -> users.id
-- ============================================

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    caption TEXT NOT NULL,
    image TEXT NOT NULL,
    "userId" UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================
-- IS_ADMIN()
-- true if the logged-in user has the role admin. Used in the policies for admins below.
-- ============================================

CREATE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (SELECT auth.uid()) AND role = 'admin'
    );
$$;

-- ============================================
-- ACCESS
-- Users can only change name, title and image – never their own role.
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON users, posts TO anon, authenticated;
REVOKE UPDATE ON users FROM anon, authenticated;
GRANT UPDATE (name, title, image) ON users TO anon, authenticated;

-- ============================================
-- POLICIES
-- The rules are ready, but Row Level Security is off,
-- so anyone with the publishable key can still change everything.
-- You turn it on in task 4: Authentication → Policies → Enable RLS.
-- ============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read users"
ON users FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Users can create their own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Everyone can read posts"
ON posts FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Users can create posts as themselves"
ON posts FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = "userId");

CREATE POLICY "Owners can update their posts"
ON posts FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = "userId")
WITH CHECK ((SELECT auth.uid()) = "userId");

CREATE POLICY "Owners can delete their posts"
ON posts FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = "userId");

CREATE POLICY "Admins can update all posts"
ON posts FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete all posts"
ON posts FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================
-- USERS SEED DATA
-- The same 5 users as in Post App – with the same id as their demo login.
-- The first one is CURRENT_USER_ID in lib/current-user.js.
-- ============================================

INSERT INTO users (id, name, mail, title, image)
VALUES
    ('00000000-0000-4000-8000-000000000001', 'Rasmus Cederdorff', 'rasmus@example.com', 'Senior Lecturer', 'https://raw.githubusercontent.com/cederdorff/race/master/images/users/race.webp'),
    ('00000000-0000-4000-8000-000000000002', 'Maria Louise Bendixen', 'maria@example.com', 'Senior Lecturer', 'https://raw.githubusercontent.com/cederdorff/race/master/images/users/mlbe.webp'),
    ('00000000-0000-4000-8000-000000000003', 'Birgitte Kirk Iversen', 'birgitte@example.com', 'Senior Lecturer', 'https://raw.githubusercontent.com/cederdorff/race/master/images/users/bki.webp'),
    ('00000000-0000-4000-8000-000000000004', 'Lars Bøge Eskildsen', 'lars@example.com', 'Senior Lecturer', 'https://raw.githubusercontent.com/cederdorff/race/master/images/users/laes.webp'),
    ('00000000-0000-4000-8000-000000000005', 'Nikolaj Krogh Kjær-Rasmussen', 'nikolaj@example.com', 'Lecturer', 'https://raw.githubusercontent.com/cederdorff/race/master/images/users/nkkr.webp');

-- ============================================
-- POSTS SEED DATA
-- The same 10 posts as in Post App
-- ============================================

INSERT INTO posts (caption, image, "userId")
VALUES
    ('Exploring the streets of Aarhus.', 'https://images.unsplash.com/photo-1559070169-a3077159ee16?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000001'),
    ('Modern architecture at Aarhus Ø.', 'https://images.unsplash.com/photo-1625773842107-7e842ff1db2f?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000001'),
    ('A quiet evening around Dokk1.', 'https://images.unsplash.com/photo-1537177080923-1fb15084a8cb?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000001'),
    ('A summer afternoon in Aarhus.', 'https://images.unsplash.com/photo-1573997953524-efed43db70a0?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000002'),
    ('Architecture and city life at Aarhus Ø.', 'https://images.unsplash.com/photo-1558443336-dbb3de50b8b2?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000002'),
    ('A walk through the centre of Aarhus.', 'https://images.unsplash.com/photo-1612624629424-ddde915d3dc5?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000003'),
    ('A view across the rooftops of Aarhus.', 'https://images.unsplash.com/photo-1661505216710-32316e7b5bb3?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000003'),
    ('Enjoying a quiet moment in the city.', 'https://images.unsplash.com/photo-1545319261-f3760f9dd64d?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000004'),
    ('Summer by the water in Aarhus.', 'https://images.unsplash.com/photo-1566241832378-917a0f30db2c?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000004'),
    ('Colourful reflections across the city.', 'https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=1200&q=80', '00000000-0000-4000-8000-000000000005');

-- ============================================
-- YOUR USERS FROM 30 OCTOBER
-- Everyone who can already log in gets a row in users with the same id.
-- New users get their row from the app when they sign up.
-- ============================================

INSERT INTO users (id, name, mail)
SELECT id, split_part(email, '@', 1), email
FROM auth.users
ON CONFLICT (id) DO NOTHING;
