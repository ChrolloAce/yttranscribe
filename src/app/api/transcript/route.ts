import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    let videoId = '';
    
    try {
      const url = new URL(videoUrl);
      if (url.hostname === 'youtu.be') {
        videoId = url.pathname.substring(1);
      } else if (url.hostname.includes('youtube.com')) {
        videoId = url.searchParams.get('v') || '';
      }
    } catch (_e) {
      // If URL parsing fails, check if the input is already a video ID
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl)) {
        videoId = videoUrl;
      }
    }

    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract YouTube video ID from the provided URL' },
        { status: 400 }
      );
    }

    // Fetch transcript using youtube-transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: 'No transcript found for this video' },
        { status: 404 }
      );
    }

    // Format transcript
    const formattedTranscript = transcript
      .map((item) => item.text)
      .join(' ');

    return NextResponse.json({ transcript: formattedTranscript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
} 