# Amazing Viral Studios (AVS) Website

Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Supabase (Postgres, Auth, Storage) · Vercel

## Setup

1. `npm install`
2. Create a Supabase project, then run `supabase/schema.sql` in the SQL editor
   (creates tables, row-level security and the `portfolio` image bucket).
3. In Supabase → Authentication: **disable public sign-ups**, then add your admin user (email + password).
4. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
5. `npm run dev` → http://localhost:3000

Without Supabase keys the public site still renders with placeholder content; enquiries and the admin need Supabase.

## Admin

Visit `/admin` and sign in. Tabs: Enquiries (with status), Portfolio (image upload), Services, Pricing, Testimonials, Contact Details.
First visit to Services/Pricing offers a one-click "Load default…" to copy the built-in content into the database for editing.

Fill **Contact Details** (email, phone, WhatsApp number as digits with country code, Instagram, Facebook, address) to
activate the WhatsApp/call buttons, social links and Google Map. No contact data is hard-coded.

## Deploy

Push to GitHub, import into Vercel, add the three environment variables from `.env.example`.

## Security note

Any authenticated Supabase user has admin write access (see policies in `schema.sql`), so only create accounts for admins and keep sign-ups disabled.
