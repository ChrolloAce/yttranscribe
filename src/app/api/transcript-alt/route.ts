import { NextResponse } from 'next/server';

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
    } catch {
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

    console.log('Fetching transcript for video ID (alternative method):', videoId);
    
    try {
      // Using a publicly available API proxy for YouTube transcripts
      const response = await fetch(`https://yt-transcript-api.vercel.app/api?id=${videoId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API responded with ${response.status}: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      
      if (!data.transcript) {
        return NextResponse.json(
          { error: 'No transcript found for this video' },
          { status: 404 }
        );
      }

      return NextResponse.json({ transcript: data.transcript });
    } catch (transcriptError) {
      console.error('Error in alternative transcript fetch:', transcriptError);
      return NextResponse.json(
        { error: 'Failed to fetch transcript from alternative source', details: String(transcriptError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error in alternative transcript API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript', details: String(error) },
      { status: 500 }
    );
  }
} 