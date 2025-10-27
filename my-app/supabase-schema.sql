-- Supabase Database Schema for The Agentic Project Podcast

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    bio TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image_url TEXT,
    amazon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
    id BIGSERIAL PRIMARY KEY,
    episode_number INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    youtube_video_id TEXT,
    thumbnail_url TEXT,
    guest_id BIGINT REFERENCES guests(id) ON DELETE SET NULL,
    published_date DATE,
    spotify_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    website_url TEXT,
    logo_url TEXT,
    guest_id BIGINT REFERENCES guests(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest Book Recommendations table (junction table)
CREATE TABLE IF NOT EXISTS guest_book_recommendations (
    id BIGSERIAL PRIMARY KEY,
    guest_id BIGINT NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    episode_id BIGINT REFERENCES episodes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guest_id, book_id, episode_id)
);

-- FMK Rankings table
CREATE TABLE IF NOT EXISTS fmk_rankings (
    id BIGSERIAL PRIMARY KEY,
    guest_id BIGINT NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    fuck_tool TEXT NOT NULL,
    marry_tool TEXT NOT NULL,
    kill_tool TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guest_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_episodes_guest_id ON episodes(guest_id);
CREATE INDEX IF NOT EXISTS idx_episodes_published ON episodes(is_published);
CREATE INDEX IF NOT EXISTS idx_episodes_number ON episodes(episode_number);
CREATE INDEX IF NOT EXISTS idx_companies_guest ON companies(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_book_recommendations_guest ON guest_book_recommendations(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_book_recommendations_book ON guest_book_recommendations(book_id);
CREATE INDEX IF NOT EXISTS idx_guest_book_recommendations_episode ON guest_book_recommendations(episode_id);
CREATE INDEX IF NOT EXISTS idx_fmk_rankings_guest ON fmk_rankings(guest_id);

-- Enable Row Level Security (RLS) - Important for Supabase
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_book_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fmk_rankings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust based on your needs)
-- These policies allow anyone to read the data, but you'll need authentication to write

-- Guests policies
CREATE POLICY "Allow public read access on guests" ON guests
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on guests" ON guests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on guests" ON guests
    FOR UPDATE USING (true);

-- Books policies
CREATE POLICY "Allow public read access on books" ON books
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on books" ON books
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on books" ON books
    FOR UPDATE USING (true);

-- Episodes policies
CREATE POLICY "Allow public read access on episodes" ON episodes
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on episodes" ON episodes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on episodes" ON episodes
    FOR UPDATE USING (true);

-- Companies policies
CREATE POLICY "Allow public read access on companies" ON companies
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on companies" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on companies" ON companies
    FOR UPDATE USING (true);

-- Guest book recommendations policies
CREATE POLICY "Allow public read access on guest_book_recommendations" ON guest_book_recommendations
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on guest_book_recommendations" ON guest_book_recommendations
    FOR INSERT WITH CHECK (true);

-- FMK rankings policies
CREATE POLICY "Allow public read access on fmk_rankings" ON fmk_rankings
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on fmk_rankings" ON fmk_rankings
    FOR INSERT WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE guests IS 'Stores information about podcast guests';
COMMENT ON TABLE books IS 'Stores book recommendations from guests';
COMMENT ON TABLE episodes IS 'Stores podcast episode information';
COMMENT ON TABLE guest_book_recommendations IS 'Links guests to their book recommendations for specific episodes';
COMMENT ON TABLE fmk_rankings IS 'Stores F*ck, Marry, Kill rankings from guests about AI tools';
