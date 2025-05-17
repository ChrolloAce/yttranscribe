import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }
    
    // Extract video ID from the URL
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = videoIdMatch?.[1];
    
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    
    // Get transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Format the transcript as a single text
    const fullText = transcript.map(item => item.text).join(' ');
    
    return NextResponse.json({ 
      transcript: transcript,
      fullText: fullText,
      videoId: videoId
    });
    
  } catch (error: any) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch transcript', 
      details: error.message 
    }, { status: 500 });
  }
} 