# YouTube Transcriber

A web application that extracts transcripts from YouTube videos.

## Features

- Extract transcripts from YouTube videos by URL
- Copy transcript to clipboard
- Download transcript as a text file
- RESTful API for transcript extraction

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- YouTube Transcript API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ChrolloAce/yttranscribe.git
   cd yttranscribe
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## API Documentation

The application provides a RESTful API that can be used to extract transcripts from YouTube videos.

### Extract Transcript

```
POST /api/transcript
```

#### Request Body

```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

#### Response

Success (200 OK):
```json
{
  "transcript": "The full transcript text from the video..."
}
```

Error (400 Bad Request):
```json
{
  "error": "Error message"
}
```

Error (404 Not Found):
```json
{
  "error": "No transcript found for this video"
}
```

Error (500 Internal Server Error):
```json
{
  "error": "Failed to fetch transcript"
}
```

#### Examples

Using cURL:
```bash
curl -X POST \
  http://localhost:3000/api/transcript \
  -H 'Content-Type: application/json' \
  -d '{"videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Using JavaScript (fetch):
```javascript
fetch('http://localhost:3000/api/transcript', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## License

MIT
