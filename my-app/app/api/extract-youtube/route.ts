import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();

    // Extract video ID from URL
    let videoId = youtubeUrl.trim();
    const shortMatch = videoId.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (shortMatch) videoId = shortMatch[1];
    const longMatch = videoId.match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if (longMatch) videoId = longMatch[1];
    videoId = videoId.split('?')[0];

    // Fetch YouTube data using oEmbed for basic info
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedResponse = await fetch(oembedUrl);

    if (!oembedResponse.ok) {
      throw new Error('Failed to fetch YouTube data');
    }

    const oembedData = await oembedResponse.json();

    // Fetch full video details including description using YouTube Data API
    let description = '';
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (apiKey) {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
        const apiResponse = await fetch(apiUrl);

        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          if (apiData.items && apiData.items.length > 0) {
            description = apiData.items[0].snippet.description;
          }
        }
      } catch (error) {
        console.error('YouTube API error (will continue with title parsing only):', error);
      }
    }

    // Get high-quality thumbnail
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // Parse the title and description using AI-like pattern matching
    const title = oembedData.title;
    const parsedData = parseYouTubeContent(title, description);

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        title: parsedData.title,
        episodeNumber: parsedData.episodeNumber,
        guestName: parsedData.guestName,
        guestTitle: parsedData.guestTitle,
        guestCompany: parsedData.guestCompany,
        guestBio: parsedData.guestBio,
        guestWebsite: parsedData.guestWebsite,
        guestLinkedIn: parsedData.guestLinkedIn,
        thumbnail,
        channelName: oembedData.author_name,
      }
    });

  } catch (error: any) {
    console.error('Error extracting YouTube data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Smart parsing function to extract info from YouTube title and description
function parseYouTubeContent(title: string, description: string) {
  let episodeNumber = null;
  let guestName = null;
  let guestTitle = null;
  let guestCompany = null;
  let guestBio = null;
  let guestWebsite = null;
  let guestLinkedIn = null;
  let cleanTitle = title;

  // === PARSE TITLE ===
  // Extract episode number
  const epPatterns = [
    /(?:Ep\.?\s*|Episode\s*|E)(\d+)/i,
    /#(\d+)/,
  ];

  for (const pattern of epPatterns) {
    const match = title.match(pattern);
    if (match) {
      episodeNumber = parseInt(match[1]);
      cleanTitle = cleanTitle.replace(match[0], '').trim();
      break;
    }
  }

  // Extract guest name and company from title
  const fromMatch = cleanTitle.match(/^(.+?)\s+(?:from|@)\s+(.+?)(?:\s*[-:|]|$)/i);
  if (fromMatch) {
    guestName = fromMatch[1].trim();
    guestCompany = fromMatch[2].trim();
    cleanTitle = cleanTitle.replace(fromMatch[0], '').trim();
  } else {
    const parenMatch = cleanTitle.match(/^(.+?)\s*\((.+?)\)/);
    if (parenMatch) {
      guestName = parenMatch[1].trim();
      guestCompany = parenMatch[2].trim();
      cleanTitle = cleanTitle.replace(parenMatch[0], '').trim();
    } else {
      const dashMatch = cleanTitle.match(/^(.+?)\s*[-–—]\s*(.+?)(?:\s*[-:|]|$)/);
      if (dashMatch) {
        guestName = dashMatch[1].trim();
        const secondPart = dashMatch[2].trim();
        if (secondPart.split(' ').length <= 4) {
          guestCompany = secondPart;
        }
        cleanTitle = cleanTitle.replace(dashMatch[0], '').trim();
      }
    }
  }

  // Clean up title
  cleanTitle = cleanTitle.replace(/^[-:|]\s*/, '').replace(/\s*[-:|]$/, '').trim();
  if (cleanTitle.length < 10) {
    cleanTitle = title;
  }

  // === PARSE DESCRIPTION ===
  if (description) {
    const lines = description.split('\n');
    const firstParagraph = lines.slice(0, 10).join(' ').trim();

    // Look for common patterns in description
    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      const line = lines[i].trim();

      // Extract guest name patterns from structured lines
      if (!guestName) {
        const guestPatterns = [
          /(?:Guest|Today|Featuring|with|Speaker):\s*(.+?)(?:\n|$)/i,
        ];
        for (const pattern of guestPatterns) {
          const match = line.match(pattern);
          if (match) {
            guestName = match[1].trim().split(/[-–—(]/)[0].trim();
            break;
          }
        }
      }
    }

    // If no guest name found yet, analyze first paragraph more intelligently
    if (!guestName && firstParagraph.length > 20) {
      // Pattern: "In this episode, we talk with NAME"
      let match = firstParagraph.match(/(?:talk|speak|chat|interview|join|welcome|meet)(?:ing|ed)?\s+(?:with|to)?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
      if (match) {
        guestName = match[1].trim();
      }

      // Pattern: "NAME is a/an/the [title] at/of [company]"
      if (!guestName) {
        match = firstParagraph.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+is\s+(?:a|an|the)\s+(.+?)\s+(?:at|of|for)\s+([A-Z][^.,]+)/);
        if (match) {
          guestName = match[1].trim();
          if (!guestTitle) guestTitle = match[2].trim();
          if (!guestCompany) guestCompany = match[3].trim();
        }
      }

      // Pattern: "NAME, [title] at [company]"
      if (!guestName) {
        match = firstParagraph.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+),\s+(.+?)\s+(?:at|of)\s+([A-Z][^.,]+)/);
        if (match) {
          guestName = match[1].trim();
          if (!guestTitle) guestTitle = match[2].trim();
          if (!guestCompany) guestCompany = match[3].trim();
        }
      }

      // Pattern: "Join NAME from COMPANY"
      if (!guestName) {
        match = firstParagraph.match(/(?:Join|Meet|Welcome)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+from\s+([A-Z][^.,]+)/i);
        if (match) {
          guestName = match[1].trim();
          if (!guestCompany) guestCompany = match[2].trim();
        }
      }
    }

    // Continue with other extractions
    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      const line = lines[i].trim();

      // Extract title/position
      if (!guestTitle && (line.toLowerCase().includes('title:') || line.toLowerCase().includes('position:') || line.toLowerCase().includes('role:'))) {
        const titleMatch = line.match(/(?:Title|Position|Role):\s*(.+?)(?:\n|$)/i);
        if (titleMatch) {
          guestTitle = titleMatch[1].trim();
        }
      }

      // Extract company from structured lines
      if (!guestCompany && line.toLowerCase().includes('company:')) {
        const companyMatch = line.match(/Company:\s*(.+?)(?:\n|$)/i);
        if (companyMatch) {
          guestCompany = companyMatch[1].trim();
        }
      }
    }

    // If still no company, extract from first paragraph context
    if (!guestCompany && guestName && firstParagraph.includes(guestName)) {
      // Pattern: "NAME... at/of COMPANY"
      let match = firstParagraph.match(new RegExp(`${guestName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^.]*?\\s+(?:at|of|from|with|for)\\s+([A-Z][A-Za-z0-9\\s&]+?)(?:,|\\.|\\s+(?:where|and|to|in|is|has))`, 'i'));
      if (match) {
        guestCompany = match[1].trim();
      }

      // Pattern: "NAME... CEO/Founder of COMPANY"
      if (!guestCompany) {
        match = firstParagraph.match(new RegExp(`${guestName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^.]*?(?:CEO|Founder|Co-founder|Director|Head|VP|President)\\s+(?:of|at)\\s+([A-Z][A-Za-z0-9\\s&]+?)(?:,|\\.)`, 'i'));
        if (match) {
          guestCompany = match[1].trim();
        }
      }
    }

    // Continue with other structured extractions
    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      const line = lines[i].trim();

      // Extract bio
      if (!guestBio && (line.toLowerCase().includes('bio:') || line.toLowerCase().includes('about'))) {
        const bioMatch = line.match(/(?:Bio|About):\s*(.+?)(?:\n\n|$)/i);
        if (bioMatch) {
          guestBio = bioMatch[1].trim().substring(0, 500); // Limit to 500 chars
        }
      }

      // Extract website
      if (!guestWebsite) {
        const websiteMatch = line.match(/(?:Website|Site|Web):\s*(https?:\/\/[^\s]+)/i);
        if (websiteMatch) {
          guestWebsite = websiteMatch[1].trim();
        } else if (line.match(/^https?:\/\/(?!.*(?:linkedin|twitter|instagram|facebook|youtube))/i)) {
          // Look for standalone URLs that aren't social media
          guestWebsite = line.match(/https?:\/\/[^\s]+/)?.[0];
        }
      }

      // Extract LinkedIn
      if (!guestLinkedIn && line.includes('linkedin.com')) {
        const linkedInMatch = line.match(/(https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+)/i);
        if (linkedInMatch) {
          guestLinkedIn = linkedInMatch[1].trim();
        }
      }

      // Look for structured format like "Name - Title at Company"
      if (!guestTitle && !guestCompany && guestName && line.includes(guestName)) {
        const structuredMatch = line.match(new RegExp(`${guestName}\\s*[-–—]\\s*(.+?)\\s+(?:at|@)\\s+(.+?)(?:\\n|$)`, 'i'));
        if (structuredMatch) {
          guestTitle = structuredMatch[1].trim();
          guestCompany = structuredMatch[2].trim();
        }
      }
    }

    // If still no bio, extract first paragraph that mentions the guest
    if (!guestBio && guestName) {
      const paragraphs = description.split('\n\n');
      for (const para of paragraphs) {
        if (para.toLowerCase().includes(guestName.toLowerCase()) && para.length > 50) {
          guestBio = para.trim().substring(0, 500);
          break;
        }
      }
    }
  }

  return {
    title: cleanTitle || title,
    episodeNumber,
    guestName,
    guestTitle,
    guestCompany,
    guestBio,
    guestWebsite,
    guestLinkedIn,
  };
}
