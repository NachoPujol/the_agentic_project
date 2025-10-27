// One-time setup script to create your admin user in Supabase
// Run this once with: node setup-admin.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdmin() {
  console.log('🔐 Setting up admin user...');
  console.log(`Email: ${adminEmail}`);

  if (!adminEmail || !adminPassword) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    process.exit(1);
  }

  if (adminEmail === 'your-email@example.com') {
    console.error('❌ Error: Please update ADMIN_EMAIL in .env.local with your actual email');
    process.exit(1);
  }

  try {
    // Try to sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ Admin user already exists! You can log in with your credentials.');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log('🔑 Password: (stored in .env.local)');
      console.log('\n⚠️  IMPORTANT: If you see a message about email confirmation:');
      console.log('   1. Go to your Supabase dashboard');
      console.log('   2. Navigate to Authentication → Users');
      console.log('   3. Find your user and click the three dots');
      console.log('   4. Click "Confirm email" to activate the account');
    }

    console.log('\n🎉 Setup complete! You can now:');
    console.log('   1. Visit http://localhost:3001/admin/login');
    console.log(`   2. Log in with: ${adminEmail}`);
    console.log('   3. Start managing your podcast episodes!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error('\n💡 Alternative setup:');
    console.error('   Go to your Supabase dashboard → Authentication → Users');
    console.error('   Click "Add user" and create a user manually with your credentials.');
  }
}

setupAdmin();
