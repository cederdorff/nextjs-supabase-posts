-- ============================================
-- ROW LEVEL SECURITY
-- With RLS on and no policies, no one can read or change anything.
-- Each policy opens for exactly what is allowed.
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS
-- Everyone can see names and images. You can only change your own row.
-- New rows come from the trigger, so no one needs to insert or delete.
-- ============================================

CREATE POLICY "Everyone can read users"
ON users FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Users can update their own row"
ON users FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- ============================================
-- POSTS
-- Everyone can read posts. Logged-in users can create posts as themselves
-- and change and delete their own.
-- ============================================

CREATE POLICY "Everyone can read posts"
ON posts FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Users can create their own posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));
