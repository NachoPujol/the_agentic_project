'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gbqzphhekdzhdjuxqync.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicXpwaGhla2R6aGRqdXhxeW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjM2NzYsImV4cCI6MjA3NDEzOTY3Nn0.Ay4CMb1yhosZeHGIIwlxDuTehRqilPu95svEzl72Gak';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
interface Guest {
  id: number;
  name: string;
  title?: string;
  company?: string;
  profile_picture_url?: string;
  bio?: string;
  website_url?: string;
  linkedin_url?: string;
}

interface Episode {
  id: number;
  episode_number: number;
  title: string;
  youtube_video_id?: string;
  thumbnail_url?: string;
  guest_id?: number;
  published_date?: string;
  spotify_url?: string;
  is_published: boolean;
  guest?: Guest;
}

interface Company {
  id: number;
  name: string;
  logo_url: string;
  website_url?: string;
  guest_id?: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image_url?: string;
  amazon_url?: string;
}

interface BookRecommendation {
  id: number;
  guest_id: number;
  book_id: number;
  episode_id: number;
  guest?: Guest;
  book?: Book;
}

interface FMKRanking {
  id: number;
  guest_id: number;
  fuck_tool: string;
  marry_tool: string;
  kill_tool: string;
  guest?: Guest;
}

export default function Page() {
  // --- state/refs ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  // Database state
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [bookRecommendations, setBookRecommendations] = useState<BookRecommendation[]>([]);
  const [fmkRankings, setFMKRankings] = useState<FMKRanking[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMsg, setApplyMsg] = useState<string>('');

  // Database functions
  // Fixed database functions - replace the existing ones in your page.tsx

// Database functions
const getPublishedEpisodes = async (limit: number = 8) => {
  try {
    const { data, error } = await supabase
      .from('episodes')
      .select(`
        id,
        episode_number,
        title,
        youtube_video_id,
        thumbnail_url,
        guest_id,
        published_date,
        spotify_url,
        is_published,
        guests (
          id,
          name,
          title,
          company,
          profile_picture_url,
          bio,
          website_url,
          linkedin_url
        )
      `)
      .eq('is_published', true)
      .order('published_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }

    // Fix the data structure to match your interface
    const episodesFixed = (data || []).map((episode: any) => ({
      ...episode,
      guest: episode.guests // Rename 'guests' to 'guest' to match your interface
    }));

    console.log('Episodes fetched successfully:', episodesFixed);
    return episodesFixed;
  } catch (error) {
    console.error('Error in getPublishedEpisodes:', error);
    return [];
  }
};

const getBookRecommendations = async (): Promise<BookRecommendation[]> => {
  try {
    const { data, error } = await supabase
      .from('guest_book_recommendations')
      .select(`
        id,
        guest_id,
        book_id,
        episode_id,
        guest:guest_id(
          id,
          name,
          title,
          company
        ),
        book:book_id(
          id,
          title,
          author,
          cover_image_url,
          amazon_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching book recommendations:', error);
      return [];
    }

    // Fix: If guest or book is returned as array, convert to single object
    const booksFixed = (data || []).map((rec: any) => ({
      ...rec,
      guest: Array.isArray(rec.guest) ? rec.guest[0] : rec.guest,
      book: Array.isArray(rec.book) ? rec.book[0] : rec.book,
    }));

    return booksFixed;
  } catch (error) {
    console.error('Error in getBookRecommendations:', error);
    return [];
  }
};

const getFMKRankings = async (limit: number = 10): Promise<FMKRanking[]> => {
  try {
    const { data, error } = await supabase
      .from('fmk_rankings')
      .select(`
        id,
        guest_id,
        fuck_tool,
        marry_tool,
        kill_tool,
        guest:guest_id(
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching FMK rankings:', error);
      return [];
    }

    // Fix: If guest is returned as array, convert to single object
    const rankingsFixed = (data || []).map((rec: any) => ({
      ...rec,
      guest: Array.isArray(rec.guest) ? rec.guest[0] : rec.guest,
    }));

    return rankingsFixed;
  } catch (error) {
    console.error('Error in getFMKRankings:', error);
    return [];
  }
};

const getCompanies = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCompanies:', error);
    return [];
  }
};
  // --- effects ---

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [episodesData, booksData, fmkData, companiesData] = await Promise.all([
          getPublishedEpisodes(8), // Get latest 8 episodes
          getBookRecommendations(),
          getFMKRankings(5), // Get latest 5 FMK rankings
          getCompanies()
        ]);

        setEpisodes(episodesData);
        setBookRecommendations(booksData);
        setFMKRankings(fmkData);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Drag-to-scroll for the horizontal episodes rail (mouse users)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => {
      isDown = true;
      (rail as HTMLElement).classList.add('grabbing');
      startX = e.pageX - rail.offsetLeft;
      scrollLeft = rail.scrollLeft;
    };
    const onLeaveOrUp = () => {
      isDown = false;
      (rail as HTMLElement).classList.remove('grabbing');
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - startX) * 1.1;
      rail.scrollLeft = scrollLeft - walk;
    };

    rail.addEventListener('mousedown', onDown);
    rail.addEventListener('mouseleave', onLeaveOrUp);
    rail.addEventListener('mouseup', onLeaveOrUp);
    rail.addEventListener('mousemove', onMove);
    return () => {
      rail.removeEventListener('mousedown', onDown);
      rail.removeEventListener('mouseleave', onLeaveOrUp);
      rail.removeEventListener('mouseup', onLeaveOrUp);
      rail.removeEventListener('mousemove', onMove);
    };
  }, []);

  // Seamless marquee: duplicate one set of logos once
  useEffect(() => {
    const track = marqueeRef.current;
    if (!track || companies.length === 0) return;
    if (!(track as HTMLElement).dataset.cloned) {
      track.innerHTML += track.innerHTML;
      (track as HTMLElement).dataset.cloned = 'true';
    }
  }, [companies]);

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setDrawerOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close modal on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // --- helpers ---
  const openVideo = (raw: string) => {
    // Accept full URLs or IDs; normalize to ID
    let id = raw.trim();
    // youtu.be/<id>
    const short = id.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
    if (short) id = short[1];
    // youtube.com/watch?v=<id>
    const long = id.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
    if (long) id = long[1];
    // strip any query bits like ?si=...
    id = id.split('?')[0];

    setVideoId(id);
    setModalOpen(true);
  };

  const submitApply = async (form: HTMLFormElement) => {
    const endpoint = 'https://formspree.io/f/xblanpvl'; // your Formspree id
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      job: (form.elements.namedItem('job') as HTMLInputElement).value.trim(),
      website: (form.elements.namedItem('website') as HTMLInputElement).value.trim(),
      _subject: 'New Guest Application — The Agentic Project',
      _template: 'table',
    };

    setApplyLoading(true);
    setApplyMsg('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Network error');
      setApplyMsg("Thanks! We'll get back to you soon.");
      form.reset();
    } catch {
      setApplyMsg('Application failed. Please try again.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading podcast data...</div>
      </div>
    );
  }

  return (
    <>
      {/* bring in your existing CSS (place /style.css in /public) */}
      <link rel="stylesheet" href="/style.css" />

      {/* ===== NAVBAR ===== */}
      <header className="nav">
        <div className="nav__inner container">
          <a className="brand" href="#">
            <img src="/assets/logos/Podcast_logo.png" className="brand__logo" alt="The Agentic Project logo" />
            The Agentic Project
          </a>

          <nav className="nav__links">
            <a href="#episodes">Episodes</a>
            <a href="#books">Books</a>
            <a href="#leaderboard">Leaderboard</a>
            <a className="btn glass" href="#cta">Apply to Speak</a>
          </nav>

          <button
            className="nav__menu"
            aria-label="Open menu"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            ☰
          </button>
        </div>

        {/* mobile drawer */}
        <div
          className="nav__drawer"
          id="drawer"
          style={{ display: drawerOpen ? 'flex' : 'none' }}
        >
          <a onClick={() => setDrawerOpen(false)} href="#episodes">Episodes</a>
          <a onClick={() => setDrawerOpen(false)} href="#books">Books</a>
          <a onClick={() => setDrawerOpen(false)} href="#leaderboard">Leaderboard</a>
          <a className="btn glass" onClick={() => setDrawerOpen(false)} href="#cta">Apply to Speak</a>
        </div>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section className="hero container">
          <div className="hero__card card">
            <div className="hero__copy">
              <h1>The Podcast Where Founders Open Up About Building AI</h1>
              <p>
                The Agentic Project is a weekly podcast where we interview the makers behind today's most
                exciting AI-native products.
              </p>
              <div className="actions">
                <a className="btn glass" href="#cta">Apply To Speak</a>
                <a className="btn btn--secondary" href="#episodes">Listen to Latest</a>
              </div>
            </div>

            <div className="hero__media">
              <img src="/assets/logos/podcast_cover.png" alt="Podcast cover / studio shot" />
            </div>
          </div>
        </section>

        {/* ===== LOGO STRIP ===== */}
        <section className="logos">
          <div className="container">
            <h3 className="logos__title">Founders from these companies have joined us:</h3>
            <div className="logos__viewport">
              <div className="logos__track" ref={marqueeRef}>
                {companies.map((company) => (
                  <img 
                    key={company.id} 
                    src={company.logo_url} 
                    alt={`${company.name} logo`}
                    title={company.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== EPISODES ===== */}
        <section className="cards-horizontal container" id="episodes" aria-label="Recent episodes">
          <h2>Recent episodes</h2>
          <div className="scroll-hint">Scroll for more →</div>

          <div className="cards__rail" ref={railRef}>
            {episodes.map((episode) => (
              <article key={episode.id} className="episode card">
                {episode.youtube_video_id ? (
                  <div
                    className="episode__media"
                    data-video-id={episode.youtube_video_id}
                    onClick={(e) => openVideo((e.currentTarget as HTMLElement).dataset.videoId || '')}
                  >
                    <img 
                      src={episode.thumbnail_url || `https://img.youtube.com/vi/${episode.youtube_video_id}/maxresdefault.jpg`} 
                      alt={`${episode.title} thumbnail`} 
                    />
                    <button className="play-badge" aria-label="Play video">▶</button>
                  </div>
                ) : (
                  <img 
                    src={episode.thumbnail_url || `https://picsum.photos/600/400?random=${episode.id}`} 
                    alt={`${episode.title} thumbnail`} 
                  />
                )}
                <div className="episode__body">
                  <h3>Ep. {episode.episode_number}: {episode.title}</h3>
                  <p>{episode.guest?.name && episode.guest?.company ? 
                    `${episode.guest.name} from ${episode.guest.company}` : 
                    episode.title}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===== BOOKS ===== */}
        <section className="books container" id="books">
          <article className="card books__card">
            <h2>Books recommended by our guests</h2>
            <ul className="books__list">
              {bookRecommendations.slice(0, 8).map((rec) => (
                <li key={rec.id} className="book">
                  <img 
                    src={rec.book?.cover_image_url || '/assets/books/default-book.jpg'} 
                    alt={`${rec.book?.title} cover`} 
                  />
                  <div className="book__info">
                    <h3>{rec.book?.title}</h3>
                    <p><strong>{rec.book?.author}</strong></p>
                    <small className="dim">Recommended by: {rec.guest?.name}</small>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        {/* ===== LEADERBOARD ===== */}
        <section className="leaderboard container" id="leaderboard">
          <h2>FMK AI Tools Leaderboard</h2>
          <div className="table card">
            <div className="table__row table__row--head">
              <div>F*CK</div>
              <div>Marry</div>
              <div>Kill</div>
            </div>
            {fmkRankings.map((ranking) => (
              <div key={ranking.id} className="table__row">
                <div>{ranking.fuck_tool}</div>
                <div>{ranking.marry_tool}</div>
                <div>{ranking.kill_tool}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== APPLY (CTA) ===== */}
        <section className="container" id="cta">
          <div className="card apply__card">
            <h2>Apply as a Guest</h2>
            <p className="dim">Founders building AI products, we'd love to hear your story.</p>

            <form
              id="guestForm"
              className="apply__form"
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.reportValidity()) return;
                await submitApply(form);
              }}
            >
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Ada Lovelace" required />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@company.com" required />
              </div>

              <div className="field">
                <label htmlFor="job">Job title</label>
                <input id="job" name="job" type="text" placeholder="Co-founder & CEO" required />
              </div>

              <div className="field">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" placeholder="https://yourproduct.com" required />
              </div>

              <button
                id="applyBtn"
                className={`btn glass${applyMsg.includes('failed') ? ' btn--error' : ''}`}
                type="submit"
                disabled={applyLoading}
              >
                {applyLoading ? 'Submitting…' : applyMsg ? (applyMsg.includes('failed') ? 'Try again' : 'Application submitted ✓') : 'Submit application'}
              </button>

              <p id="applyMsg" className="dim" aria-live="polite" style={{ marginTop: 8 }}>
                {applyMsg}
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer__grid">
          <div>
            <strong>The Agentic Project</strong>
            <p className="dim">Founder interviews on agentic AI, tools, and operations.</p>
          </div>
          <nav className="footer__links">
            <a href="#episodes">Episodes</a>
            <a href="#books">Books</a>
            <a href="#leaderboard">Leaderboard</a>
          </nav>
          <nav className="footer__socials">
            <a href="#" aria-label="YouTube">YouTube</a>
            <a href="#" aria-label="Spotify">Spotify</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </nav>
        </div>
        <div className="container footer__foot">
          <small className="dim">© 2025 The Agentic Project. All rights reserved.</small>
        </div>
      </footer>

      {/* ===== VIDEO MODAL ===== */}
      {modalOpen && (
        <div
          id="videoModal"
          className="modal"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.matches('[data-close-modal], .modal__backdrop')) setModalOpen(false);
          }}
        >
          <div className="modal__backdrop" data-close-modal="" />
          <div className="modal__dialog card">
            <button
              className="modal__close"
              aria-label="Close"
              data-close-modal=""
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <div className="modal__player">
              {videoId && (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
      
    </>
  );
}


