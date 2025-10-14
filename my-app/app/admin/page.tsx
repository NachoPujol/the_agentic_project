'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image_url?: string;
  amazon_url?: string;
}

export default function AdminPanel() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleCompleteEpisodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      // Extract YouTube ID from URL if needed
      let videoId = formData.get('youtube_video_id') as string;
      if (videoId && videoId.includes('youtube.com')) {
        const urlMatch = videoId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        if (urlMatch) videoId = urlMatch[1];
      }

      // 1. Create or find the guest
      let guestId = null;
      const guestName = formData.get('guest_name') as string;

      if (guestName) {
        const { data: existingGuest } = await supabase
          .from('guests')
          .select('id')
          .eq('name', guestName)
          .single();

        if (existingGuest) {
          guestId = existingGuest.id;
          
          // Update guest info if provided
          const guestUpdateData: any = {};
          if (formData.get('guest_company')) guestUpdateData.company = formData.get('guest_company');
          if (formData.get('guest_title')) guestUpdateData.title = formData.get('guest_title');
          if (formData.get('guest_bio')) guestUpdateData.bio = formData.get('guest_bio');
          if (formData.get('guest_website')) guestUpdateData.website_url = formData.get('guest_website');
          if (formData.get('guest_linkedin')) guestUpdateData.linkedin_url = formData.get('guest_linkedin');

          if (Object.keys(guestUpdateData).length > 0) {
            await supabase.from('guests').update(guestUpdateData).eq('id', guestId);
          }
        } else {
          // Create new guest
          const { data: newGuest, error: guestError } = await supabase
            .from('guests')
            .insert({
              name: guestName,
              company: formData.get('guest_company') as string || null,
              title: formData.get('guest_title') as string || null,
              bio: formData.get('guest_bio') as string || null,
              website_url: formData.get('guest_website') as string || null,
              linkedin_url: formData.get('guest_linkedin') as string || null,
            })
            .select('id')
            .single();

          if (guestError) throw guestError;
          guestId = newGuest.id;
        }
      }

      // 2. Create the episode
      const episodeData = {
        episode_number: parseInt(formData.get('episode_number') as string),
        title: formData.get('title') as string,
        youtube_video_id: videoId || null,
        thumbnail_url: formData.get('thumbnail_url') as string || null,
        guest_id: guestId,
        published_date: formData.get('published_date') as string || null,
        spotify_url: formData.get('spotify_url') as string || null,
        is_published: formData.get('is_published') === 'on',
      };

      const { data: newEpisode, error: episodeError } = await supabase
        .from('episodes')
        .insert(episodeData)
        .select('id')
        .single();

      if (episodeError) throw episodeError;

      // 3. Handle book recommendation
      const bookChoice = formData.get('book_choice') as string;
      const bookTitle = formData.get('book_title') as string;
      const bookAuthor = formData.get('book_author') as string;

      if (bookChoice === 'existing' && formData.get('existing_book_id')) {
        // Link to existing book
        await supabase.from('guest_book_recommendations').insert({
          guest_id: guestId,
          book_id: parseInt(formData.get('existing_book_id') as string),
          episode_id: newEpisode.id,
        });
      } else if (bookChoice === 'new' && bookTitle && bookAuthor) {
        // Create new book and link it
        const { data: newBook, error: bookError } = await supabase
          .from('books')
          .insert({
            title: bookTitle,
            author: bookAuthor,
            cover_image_url: formData.get('book_cover') as string || null,
            amazon_url: formData.get('book_amazon') as string || null,
          })
          .select('id')
          .single();

        if (!bookError) {
          await supabase.from('guest_book_recommendations').insert({
            guest_id: guestId,
            book_id: newBook.id,
            episode_id: newEpisode.id,
          });
        }
      }

      // 4. Handle FMK ranking
      const fuckTool = formData.get('fuck_tool') as string;
      const marryTool = formData.get('marry_tool') as string;
      const killTool = formData.get('kill_tool') as string;

      if (fuckTool && marryTool && killTool && guestId) {
        await supabase.from('fmk_rankings').insert({
          guest_id: guestId,
          fuck_tool: fuckTool,
          marry_tool: marryTool,
          kill_tool: killTool,
        });
      }

      showMessage('Complete episode with guest, book, and FMK ranking created successfully!');
      e.currentTarget.reset();
      loadBooks(); // Refresh books list in case we added a new one
      
    } catch (error: any) {
      showMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '10px' }}>Complete Episode Creator</h1>
        <p style={{ color: '#6b7280' }}>Add everything for a new episode in one place: guest info, book recommendation, and FMK ranking</p>
        <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>← Back to Website</a>
      </div>
      
      {message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
          color: message.includes('Error') ? '#dc2626' : '#16a34a',
          border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleCompleteEpisodeSubmit} style={{ display: 'grid', gap: '30px' }}>
        
        {/* Episode Information */}
        <div style={{ padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginTop: '0', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Episode Information</h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Episode Number *
                </label>
                <input
                  name="episode_number"
                  type="number"
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Episode Title *
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Sarah from DataCorp - How AI is transforming customer service"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  YouTube URL or Video ID
                </label>
                <input
                  name="youtube_video_id"
                  type="text"
                  placeholder="https://youtube.com/watch?v=abc123 or just abc123"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Published Date
                </label>
                <input
                  name="published_date"
                  type="date"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Spotify URL
                </label>
                <input
                  name="spotify_url"
                  type="url"
                  placeholder="https://open.spotify.com/episode/..."
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Thumbnail URL
                </label>
                <input
                  name="thumbnail_url"
                  type="url"
                  placeholder="Leave empty to auto-generate from YouTube"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input name="is_published" type="checkbox" id="is_published" />
              <label htmlFor="is_published" style={{ fontWeight: 'bold' }}>
                Publish immediately (show on website)
              </label>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div style={{ padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginTop: '0', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Guest Information</h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Guest Name *
                </label>
                <input
                  name="guest_name"
                  type="text"
                  required
                  placeholder="Sarah Johnson"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Title
                </label>
                <input
                  name="guest_title"
                  type="text"
                  placeholder="CEO & Co-founder"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Company
                </label>
                <input
                  name="guest_company"
                  type="text"
                  placeholder="DataCorp AI"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Guest Bio
              </label>
              <textarea
                name="guest_bio"
                rows={3}
                placeholder="Brief description of the guest's background and expertise..."
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Website URL
                </label>
                <input
                  name="guest_website"
                  type="url"
                  placeholder="https://datacorp.ai"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  LinkedIn URL
                </label>
                <input
                  name="guest_linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/sarah-johnson"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Book Recommendation */}
        <div style={{ padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginTop: '0', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Book Recommendation</h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Book Choice
              </label>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="book_choice" value="none" defaultChecked />
                  No book recommendation
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="book_choice" value="existing" />
                  Choose from existing books
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="book_choice" value="new" />
                  Add new book
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Existing Book (if choosing from existing)
              </label>
              <select
                name="existing_book_id"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select a book</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  New Book Title (if adding new)
                </label>
                <input
                  name="book_title"
                  type="text"
                  placeholder="Atomic Habits"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Author
                </label>
                <input
                  name="book_author"
                  type="text"
                  placeholder="James Clear"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Book Cover Image URL
                </label>
                <input
                  name="book_cover"
                  type="url"
                  placeholder="https://images.amazon.com/..."
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Amazon URL
                </label>
                <input
                  name="book_amazon"
                  type="url"
                  placeholder="https://amazon.com/..."
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FMK Ranking */}
        <div style={{ padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginTop: '0', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>F*ck, Marry, Kill Ranking</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
            Add the guest's AI tool preferences (optional)
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#dc2626' }}>
                F*CK
              </label>
              <input
                name="fuck_tool"
                type="text"
                placeholder="ChatGPT"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#16a34a' }}>
                Marry
              </label>
              <input
                name="marry_tool"
                type="text"
                placeholder="Claude"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6b7280' }}>
                Kill
              </label>
              <input
                name="kill_tool"
                type="text"
                placeholder="Legacy CRM"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '16px 32px',
            backgroundColor: loading ? '#ccc' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creating Complete Episode...' : 'Create Complete Episode'}
        </button>
      </form>
    </div>
  );
}