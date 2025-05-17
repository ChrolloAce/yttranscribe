"use client";

import { useState } from "react";

export default function YouTubeTranscriber() {
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setError("");
  };

  const getTranscript = async () => {
    if (!videoUrl) {
      setError("Please enter a YouTube video URL");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transcript');
      }
      
      const data = await response.json();
      setTranscript(data.transcript);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get transcript. Please check the URL and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    alert("Transcript copied to clipboard!");
  };

  const downloadTranscript = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "youtube-transcript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">YouTube Video Transcriber</h1>
          <p className="text-gray-600 mb-8">
            Enter a YouTube video URL to get its transcript
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="videoUrl"
                id="videoUrl"
                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 p-2 border"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={getTranscript}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Get Transcript"}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Transcript</h2>
            <div className="bg-gray-50 p-4 rounded-md h-64 overflow-y-auto">
              {transcript ? (
                <p className="text-gray-800 whitespace-pre-line">{transcript}</p>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  The transcript will appear here after you submit a valid YouTube URL.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={copyTranscript}
              disabled={!transcript}
            >
              Copy Transcript
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={downloadTranscript}
              disabled={!transcript}
            >
              Download as Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
