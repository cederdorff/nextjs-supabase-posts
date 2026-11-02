-- ============================================
-- CONNECT USERS TO AUTH.USERS
-- Every new user in auth.users gets a row in users with the same id.
-- ============================================

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.users (id, name, mail)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- USERS WHO SIGNED UP BEFORE THE TRIGGER
-- The trigger only runs for new users, so copy the existing ones once.
-- ============================================

INSERT INTO public.users (id, name, mail)
SELECT id, split_part(email, '@', 1), email
FROM auth.users
ON CONFLICT (id) DO NOTHING;
