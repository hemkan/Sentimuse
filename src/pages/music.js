// components/MusicSearch.js
import { useState } from "react";

export default function MusicSearch() {
  // User prompt
  const [prompt, setPrompt] = useState("");
  // Result from the API
  const [result, setResult] = useState(null);
  // Loading status and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calls the API route
  const searchMusic = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/createMusic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Music search failed");
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl mb-4">Music Test</h1>
      <input
        type="text"
        placeholder="Enter a music prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 rounded w-80"
      />
      <button
        onClick={searchMusic}
        disabled={loading}
        className="mt-5 bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Searching..." : "Search Music"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-10 text-center">
          <p>
            <strong>{result.title}</strong> by {result.artist}
          </p>
          <audio controls className="mt-2">
            <source src={result.trackUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
