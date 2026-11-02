-- ============================================
-- ROLES: USER AND ADMIN
-- Make yourself admin in the Table Editor afterwards.
-- ============================================

ALTER TABLE users
ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- ============================================
-- USERS CAN'T CHANGE THEIR OWN ROLE
-- RLS decides which rows you can change – the grant decides which columns.
-- ============================================

REVOKE UPDATE ON users FROM anon, authenticated;
GRANT UPDATE (name, title, image) ON users TO authenticated;

-- ============================================
-- ADMINS CAN DELETE ALL POSTS
-- Policies for the same action are combined with OR:
-- you can delete a post if it's yours, or if you are admin.
-- ============================================

CREATE POLICY "Admins can delete all posts"
ON posts FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
);
