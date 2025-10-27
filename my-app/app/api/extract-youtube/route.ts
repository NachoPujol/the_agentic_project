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

    // Fetch YouTube data using oEmbed (no API key needed!)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedResponse = await fetch(oembedUrl);

    if (!oembedResponse.ok) {
      throw new Error('Failed to fetch YouTube data');
    }

    const oembedData = await oembedResponse.json();

    // Get high-quality thumbnail
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // Parse the title using AI-like pattern matching
    const title = oembedData.title;
    const parsedData = parseYouTubeTitle(title);

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        title: parsedData.title,
        episodeNumber: parsedData.episodeNumber,
        guestName: parsedData.guestName,
        guestCompany: parsedData.guestCompany,
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

// Smart parsing function to extract info from YouTube title
function parseYouTubeTitle(title: string) {
  let episodeNumber = null;
  let guestName = null;
  let guestCompany = null;
  let cleanTitle = title;

  // Extract episode number
  // Patterns: "Ep. 5", "Episode 5", "#5", "E5"
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

  // Extract guest name and company
  // Common patterns:
  // "Guest Name from Company"
  // "Guest Name (Company)"
  // "Guest Name - Company"
  // "Guest Name, Company"
  // "Guest Name | Company"

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
        // Check if second part looks like a company or description
        const secondPart = dashMatch[2].trim();
        if (secondPart.split(' ').length <= 4) {
          guestCompany = secondPart;
        }
        cleanTitle = cleanTitle.replace(dashMatch[0], '').trim();
      }
    }
  }

  // Clean up any remaining separators
  cleanTitle = cleanTitle.replace(/^[-:|]\s*/, '').replace(/\s*[-:|]$/, '').trim();

  // If title is too short after parsing, use original
  if (cleanTitle.length < 10) {
    cleanTitle = title;
  }

  return {
    title: cleanTitle || title,
    episodeNumber,
    guestName,
    guestCompany,
  };
}
