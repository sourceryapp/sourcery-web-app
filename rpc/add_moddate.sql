create extension if not exists moddatetime schema extensions;

-- assuming the table name is "requests"
create trigger handle_updated_at before update on requests 
  for each row execute procedure moddatetime (updated_at);