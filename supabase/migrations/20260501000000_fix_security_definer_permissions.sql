-- handle_new_user() is a trigger-only function and must not be callable
-- via the REST API (/rest/v1/rpc/handle_new_user).
-- Revoke EXECUTE from all roles that receive it by default.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- update_updated_at_column() is also trigger-only; revoke it as well.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
