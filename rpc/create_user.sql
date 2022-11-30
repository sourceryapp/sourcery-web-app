/** Not RPC, but triggers for user creation **/

DROP FUNCTION IF EXISTS public.create_user cascade;

CREATE OR REPLACE FUNCTION public.create_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user (id, email, name, phone) VALUES (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'phone')
  ON CONFLICT (id) DO UPDATE SET email = new.email;
  return new;
END;
$$ LANGUAGE plpgsql security definer;

drop trigger if exists create_user_on_signup on auth.users;
create trigger create_user_on_signup
  after update or insert on auth.users
  for each row execute procedure public.create_user();