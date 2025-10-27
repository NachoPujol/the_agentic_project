# Admin Setup Instructions

## Step 1: Set Your Admin Credentials

Open `.env.local` and update these lines with your actual email and password:

```env
ADMIN_EMAIL=your-actual-email@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

**Important:**
- Choose a strong password (at least 8 characters)
- Keep this file secure and never commit it to Git (it's already in .gitignore)
- Only you will have access to these credentials

## Step 2: Create Your Admin User

Run the setup script:

```bash
node setup-admin.js
```

This will create your admin user in Supabase's authentication system.

### If Email Confirmation is Required

If Supabase requires email confirmation:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Authentication** → **Users** in the sidebar
4. Find your email in the list
5. Click the three dots (...) next to your user
6. Click **"Confirm email"** or **"Confirm user"**

### Alternative: Create User Manually in Supabase

If the script doesn't work, you can create the user manually:

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter your email and password
4. The user will be created and confirmed automatically

## Step 3: Disable Public Signup (Optional but Recommended)

To ensure only you can access the admin panel:

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Disable **"Enable Email Signup"**
4. Keep **"Enable Email Login"** enabled

This prevents anyone else from creating new accounts while allowing you to log in.

## Step 4: Update RLS Policies

Run this SQL in your Supabase SQL Editor to ensure only authenticated users can write to the database:

```sql
-- Enable RLS on all tables (if not already enabled)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_book_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fmk_rankings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for your website)
CREATE POLICY "Allow public read on guests" ON guests FOR SELECT USING (true);
CREATE POLICY "Allow public read on books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public read on episodes" ON episodes FOR SELECT USING (true);
CREATE POLICY "Allow public read on companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Allow public read on guest_book_recommendations" ON guest_book_recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read on fmk_rankings" ON fmk_rankings FOR SELECT USING (true);

-- Allow authenticated users to write (only you!)
CREATE POLICY "Allow authenticated insert on guests" ON guests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on books" ON books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on episodes" ON episodes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on companies" ON companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on guest_book_recommendations" ON guest_book_recommendations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on fmk_rankings" ON fmk_rankings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on guests" ON guests FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on books" ON books FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on episodes" ON episodes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on companies" ON companies FOR UPDATE TO authenticated USING (true);
```

## Step 5: Test Your Login

1. Visit http://localhost:3001/admin/login
2. Enter the email and password you set in `.env.local`
3. You should be logged in and redirected to the admin panel
4. Try creating a test episode to verify everything works

## Your Admin Credentials

Your credentials are stored in `.env.local`:
- **Email:** (the one you set in ADMIN_EMAIL)
- **Password:** (the one you set in ADMIN_PASSWORD)

Keep these secure and don't share them with anyone!

## Troubleshooting

### "Invalid login credentials"
- Make sure you ran `node setup-admin.js`
- Check that your user is confirmed in Supabase (Authentication → Users)
- Verify you're using the correct email/password from `.env.local`

### "Permission denied" errors when creating episodes
- Make sure you've run the RLS policies SQL above
- Check that you're logged in (you should see your email and "Sign Out" button)

### Can't access admin page
- Make sure your dev server is running: `npm run dev`
- Try going directly to: http://localhost:3001/admin/login

## Security Notes

✅ **What's Secure:**
- Only authenticated users can write to the database
- Your credentials are stored locally in `.env.local` (not committed to Git)
- Supabase handles password hashing and security
- Public signup can be disabled so only you can create accounts

⚠️ **For Production:**
- Consider adding 2FA (Two-Factor Authentication) in Supabase
- Use a password manager for your admin credentials
- Enable rate limiting in Supabase to prevent brute force attacks
- Consider IP whitelisting if you only admin from specific locations
