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

-- ============================================
-- USERS
-- The same columns as in Post App – plus role.
-- id is the same id as the user's login in auth.users.
-- The app creates the row when someone signs up (task 2).
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
-- true if the logged-in user has the role admin. Used in the policy for admins below.
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
-- You turn it on in task 5: Authentication → Policies → Enable RLS.
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

CREATE POLICY "Admins can delete all posts"
ON posts FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================
-- SEED DATA
-- Everyone who can already log in gets a row in users – new users get it from the app.
-- The 10 posts from Post App belong to the first user who signed up.
-- ============================================

INSERT INTO users (id, name, mail)
SELECT id, COALESCE(raw_user_meta_data ->> 'name', split_part(email, '@', 1)), email
FROM auth.users;

INSERT INTO posts (caption, image, "userId")
SELECT post.caption, post.image, first_user.id
FROM (
    VALUES
        ('Exploring the streets of Aarhus.', 'https://images.unsplash.com/photo-1559070169-a3077159ee16?auto=format&fit=crop&w=1200&q=80'),
        ('Modern architecture at Aarhus Ø.', 'https://images.unsplash.com/photo-1625773842107-7e842ff1db2f?auto=format&fit=crop&w=1200&q=80'),
        ('A quiet evening around Dokk1.', 'https://images.unsplash.com/photo-1537177080923-1fb15084a8cb?auto=format&fit=crop&w=1200&q=80'),
        ('A summer afternoon in Aarhus.', 'https://images.unsplash.com/photo-1573997953524-efed43db70a0?auto=format&fit=crop&w=1200&q=80'),
        ('Architecture and city life at Aarhus Ø.', 'https://images.unsplash.com/photo-1558443336-dbb3de50b8b2?auto=format&fit=crop&w=1200&q=80'),
        ('A walk through the centre of Aarhus.', 'https://images.unsplash.com/photo-1612624629424-ddde915d3dc5?auto=format&fit=crop&w=1200&q=80'),
        ('A view across the rooftops of Aarhus.', 'https://images.unsplash.com/photo-1661505216710-32316e7b5bb3?auto=format&fit=crop&w=1200&q=80'),
        ('Enjoying a quiet moment in the city.', 'https://images.unsplash.com/photo-1545319261-f3760f9dd64d?auto=format&fit=crop&w=1200&q=80'),
        ('Summer by the water in Aarhus.', 'https://images.unsplash.com/photo-1566241832378-917a0f30db2c?auto=format&fit=crop&w=1200&q=80'),
        ('Colourful reflections across the city.', 'https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=1200&q=80')
) AS post (caption, image)
CROSS JOIN (SELECT id FROM auth.users ORDER BY created_at LIMIT 1) AS first_user;
