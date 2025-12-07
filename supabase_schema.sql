-- Create a table for files
create table files (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  size bigint not null,
  type text not null,
  download_url text not null,
  storage_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  download_count integer default 0,
  offer text,
  answer text
);

-- Enable Row Level Security (RLS)
alter table files enable row level security;

-- Create a policy to allow public access (for this demo app)
create policy "Public Access"
  on files for all
  using ( true )
  with check ( true );

-- Create a storage bucket for uploads
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true);

-- Create a policy to allow public access to the storage bucket
create policy "Public Access"
  on storage.objects for all
  using ( bucket_id = 'uploads' )
  with check ( bucket_id = 'uploads' );
