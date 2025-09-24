const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbqzphhekdzhdjuxqync.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicXpwaGhla2R6aGRqdXhxeW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjM2NzYsImV4cCI6MjA3NDEzOTY3Nn0.Ay4CMb1yhosZeHGIIwlxDuTehRqilPu95svEzl72Gak';// populate.js - Complete script to populate your Supabase database


const supabase = createClient(supabaseUrl, supabaseAnonKey);

const podcastData = {
  guests: [
    {
      name: "Nico",
      title: "Founding Community Marketer",
      company: "Scribe",
      website_url: "https://scribehow.com",
      linkedin_url: "https://www.linkedin.com/company/scribehow/",
      bio: "Founding Community Marketer at Scribe, expert on building thriving communities around B2B companies and community management evolution.",
    },
    {
      name: "Carolina",
      title: "Solo Agency Owner", 
      company: "Flowgent",
      website_url: "https://flowgent.ai",
      bio: "Powerhouse solo agency owner who achieved over 3x LinkedIn growth, expert in personal branding and AI-powered agency operations.",
    },
    {
      name: "Scott Meyer",
      title: "CEO",
      company: "Chipp.ai", 
      website_url: "https://chipp.ai",
      bio: "Serial entrepreneur and visionary CEO of Chipp.ai, building tools to democratize AI for businesses with powerful, private, no-code AI agent tools.",
    },
    {
      name: "Mikita Martynau",
      title: "CEO and Co-founder",
      company: "Skarbe",
      linkedin_url: "https://www.linkedin.com/in/mikita-martynau/",
      bio: "CEO and Co-founder of Skarbe, expert in AI-powered deal-closing and founder-led sales. Previously involved in PandaDoc's $10M → $100M growth.",
    },
    {
      name: "Benjamin Bekken",
      title: "CEO and Co-founder",
      company: "We Post",
      bio: "CEO and Co-founder of We Post with background in media science and agency work, revolutionizing AI-powered content creation and social media marketing.",
    },
    {
      name: "Bolun",
      title: "Entrepreneur",
      company: "Zogo (sold)",
      bio: "Seasoned entrepreneur who sold his company Zogo at 23, now building new ventures with unique perspective on AI-era entrepreneurship.",
    },
    {
      name: "Martin",
      title: "CTO",
      company: "DataButton",
      website_url: "https://databutton.com",
      bio: "CTO of DataButton, a leading no-code AI app development platform, expert in democratizing app creation through AI.",
    },
    {
      name: "Vitaly",
      title: "CEO and Co-founder",
      company: "Dynamiq",
      bio: "CEO and co-founder of Dynamiq, building foundational infrastructure for agentic AI with developer-focused, open-source platform.",
    },
    {
      name: "Joel Etze",
      title: "Founder",
      company: "Humiris",
      bio: "Visionary founder behind Humiris, expert in Mixed AI development and creating AI systems that integrate diverse models for enhanced performance.",
    },
    {
      name: "Mert Davici",
      title: "Founder",
      company: "Godmode",
      website_url: "https://godmodehq.com",
      bio: "Founder of Godmode, an AI-powered platform revolutionizing sales prospecting and outreach. Background in investment banking and tech entrepreneurship.",
    },
    {
      name: "Robin Gupta",
      title: "CEO and Co-founder", 
      company: "TestZeus",
      bio: "CEO and co-founder of TestZeus, pioneering AI-driven test automation. Journey from door-to-door sales to engineering leadership and AI innovation.",
    },
  ],
  episodes: [
    {
      episode_number: 11,
      title: "Nico from Scribe - This is why your B2B needs a community. And how to stop AI from killing it.",
      youtube_video_id: "50JSjNQral4",
      guest_name: "Nico",
      published_date: "2024-07-29",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 10,
      title: "Carolina from Flowgent - 100 leads leave your website per day unnoticed, start converting those!",
      youtube_video_id: "uaxdRLsNPAk",
      guest_name: "Carolina", 
      published_date: "2024-07-25",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 9,
      title: "Scott from Chipp - This is Why Your Data is At Risk On the OpenAI",
      youtube_video_id: "kBsAjgd1Qdk",
      guest_name: "Scott Meyer",
      published_date: "2024-07-01", 
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 8,
      title: "Mikita from Skarbe - AI-powered deal-closing assistant",
      guest_name: "Mikita Martynau",
      published_date: "2024-06-17",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 7,
      title: "Benjamin from We Post - AI-powered content creation", 
      guest_name: "Benjamin Bekken",
      published_date: "2024-06-03",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 6,
      title: "Bolun - From selling a company at 23 to building in the AI era",
      guest_name: "Bolun",
      published_date: "2024-05-08",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 5,
      title: "Martin from DataButton - No-code AI app development",
      guest_name: "Martin",
      published_date: "2024-04-22",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 4,
      title: "Vitaly from Dynamiq - Foundational infrastructure of agentic AI",
      guest_name: "Vitaly",
      published_date: "2024-04-08",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 3,
      title: "Joel Etze from Humiris - Mixed AI and the future of artificial intelligence",
      guest_name: "Joel Etze",
      published_date: "2024-03-25", 
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 2,
      title: "Mert from Godmode - AI-powered sales prospecting and outreach",
      guest_name: "Mert Davici",
      published_date: "2024-03-11",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
    {
      episode_number: 1,
      title: "Robin from TestZeus - AI-driven test automation and open source",
      guest_name: "Robin Gupta",
      published_date: "2024-02-25",
      spotify_url: "https://open.spotify.com/episode/your-episode-id",
      is_published: true,
    },
  ],
  companies: [
    { name: "Scribe", website_url: "https://scribehow.com", logo_url: "/assets/logos/scribe_logo.png", guest_name: "Nico" },
    { name: "Flowgent", website_url: "https://flowgent.ai", logo_url: "/assets/logos/flowgent_logo.jpg", guest_name: "Carolina" },
    { name: "Chipp", website_url: "https://chipp.ai", logo_url: "/assets/logos/chipp_logo.svg", guest_name: "Scott Meyer" },
    { name: "Skarbe", logo_url: "/assets/logos/skarbe_logo.jpeg", guest_name: "Mikita Martynau" },
    { name: "DataButton", website_url: "https://databutton.com", logo_url: "/assets/logos/databutton_logo.png", guest_name: "Martin" },
    { name: "Dynamiq", logo_url: "/assets/logos/dynamiq_logo.svg", guest_name: "Vitaly" },
    { name: "Humiris", logo_url: "/assets/logos/humiris_logo.jpeg", guest_name: "Joel Etze" },
    { name: "Godmode", website_url: "https://godmodehq.com", logo_url: "/assets/logos/godmode_logo.webp", guest_name: "Mert Davici" },
  ],
  books: [
    {
      title: "Atomic Habits",
      author: "James Clear",
      cover_image_url: "/assets/books/atomichabits.jpg",
      amazon_url: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299"
    },
    {
      title: "Zero to One",
      author: "Peter Thiel",
      cover_image_url: "/assets/books/zerotoone.jpg", 
      amazon_url: "https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296"
    },
    {
      title: "The Dip",
      author: "Seth Godin",
      cover_image_url: "/assets/books/thedip.jpg",
      amazon_url: "https://www.amazon.com/Dip-Little-Book-Teaches-Stick/dp/1591841666"
    },
    {
      title: "Build",
      author: "Tony Fadell",
      cover_image_url: "/assets/books/build.jpg",
      amazon_url: "https://www.amazon.com/Build-Unorthodox-Guide-Making-Things/dp/0063046067"
    }
  ]
};

async function populateDatabase() {
  console.log('🚀 Starting database population...');
  
  try {
    // 1. Insert Guests
    console.log('📝 Inserting guests...');
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .insert(podcastData.guests)
      .select();
    
    if (guestError) throw guestError;
    console.log(`✅ Inserted ${guestData.length} guests`);

    // Create a mapping of guest names to IDs
    const guestMap = new Map();
    guestData.forEach(guest => {
      guestMap.set(guest.name, guest.id);
    });

    // 2. Insert Episodes with guest references (simplified schema)
    console.log('🎬 Inserting episodes...');
    const episodesWithGuestIds = podcastData.episodes.map(episode => ({
      episode_number: episode.episode_number,
      title: episode.title,
      youtube_video_id: episode.youtube_video_id,
      thumbnail_url: episode.thumbnail_url,
      published_date: episode.published_date,
      spotify_url: episode.spotify_url,
      is_published: episode.is_published,
      guest_id: guestMap.get(episode.guest_name) || null,
    }));

    const { data: episodeData, error: episodeError } = await supabase
      .from('episodes')
      .insert(episodesWithGuestIds)
      .select();
    
    if (episodeError) throw episodeError;
    console.log(`✅ Inserted ${episodeData.length} episodes`);

    // 3. Insert Companies (linking to guests)
    console.log('🏢 Inserting companies...');
    const companiesWithGuestIds = podcastData.companies.map(company => ({
      name: company.name,
      website_url: company.website_url,
      logo_url: company.logo_url,
      guest_id: guestMap.get(company.guest_name) || null,
    }));

    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert(companiesWithGuestIds)
      .select();
    
    if (companyError) throw companyError;
    console.log(`✅ Inserted ${companyData.length} companies`);

    // 4. Insert Books
    console.log('📚 Inserting books...');
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .insert(podcastData.books)
      .select();
    
    if (bookError) throw bookError;
    console.log(`✅ Inserted ${bookData.length} books`);

    // 5. Add sample FMK rankings
    console.log('🎯 Adding sample FMK rankings...');
    const sampleFMKRankings = [
      {
        guest_id: guestData[0]?.id,
        fuck_tool: "Gemini",
        marry_tool: "Claude",
        kill_tool: "n8n"
      },
      {
        guest_id: guestData[1]?.id,
        fuck_tool: "Lovable", 
        marry_tool: "OpenAI",
        kill_tool: "Claude"
      },
      {
        guest_id: guestData[2]?.id,
        fuck_tool: "Email Finder",
        marry_tool: "Gemini", 
        kill_tool: "Sales Managers"
      }
    ];

    const { data: fmkData, error: fmkError } = await supabase
      .from('fmk_rankings')
      .insert(sampleFMKRankings)
      .select();

    if (fmkError) {
      console.log('⚠️  FMK rankings failed (this is optional):', fmkError.message);
    } else {
      console.log(`✅ Added ${fmkData.length} FMK rankings`);
    }

    // 6. Add sample guest book recommendations
    console.log('📖 Adding guest book recommendations...');
    const sampleBookRecommendations = [
      {
        guest_id: guestData[0]?.id, // Nico
        book_id: bookData[0]?.id,   // Atomic Habits
        episode_id: episodeData[0]?.id
      },
      {
        guest_id: guestData[1]?.id, // Carolina
        book_id: bookData[1]?.id,   // Zero to One
        episode_id: episodeData[1]?.id
      },
      {
        guest_id: guestData[2]?.id, // Scott
        book_id: bookData[2]?.id,   // The Dip
        episode_id: episodeData[2]?.id
      },
      {
        guest_id: guestData[3]?.id, // Mikita
        book_id: bookData[3]?.id,   // Build
        episode_id: episodeData[3]?.id
      }
    ];

    const { data: bookRecData, error: bookRecError } = await supabase
      .from('guest_book_recommendations')
      .insert(sampleBookRecommendations)
      .select();

    if (bookRecError) {
      console.log('⚠️  Book recommendations failed (this is optional):', bookRecError.message);
    } else {
      console.log(`✅ Added ${bookRecData.length} book recommendations`);
    }

    console.log('🎉 Database population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${guestData.length} guests added`);
    console.log(`- ${episodeData.length} episodes added`);  
    console.log(`- ${companyData.length} companies added`);
    console.log(`- ${bookData.length} books added`);
    console.log(`- ${fmkData ? fmkData.length : 0} FMK rankings added`);
    console.log(`- ${bookRecData ? bookRecData.length : 0} book recommendations added`);

  } catch (error) {
    console.error('❌ Error populating database:', error);
    console.error('Full error details:', error.message);
  }
}

// Run the script
populateDatabase();