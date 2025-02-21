import { useState } from "react";

export default function MusicGenerator() {
  // State to store user input 
  const [prompt, setPrompt] = useState("");

  // State to store generated music 
  const [musicURL, setMusicURL] = useState(null);

  // State to handle loading status
  const [loading, setLoading] = useState(false);

  // State to handle any errors
  const [error, setError] = useState(null);

  // Function to send request to API route
  const generateMusic = async () => {
    setLoading(true); 
    setError(null); // Clear previous errors

    try {
      // Send a POST request to API
      const response = await fetch("/api/generateMusic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }), // Send user input as JSON
      });

      const data = await response.json(); // Parse response 

      if (response.ok) {
        setMusicURL(data.music_url); // Save generated music
      } else {
        throw new Error(data.error || "Music generation failed"); // Handle API errors
      }
    } catch (err) {
      setError(err.message); // error message
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Generate AI Music</h2>

      {/* Input field for user to enter music prompt */}
      <input
        type="text"
        placeholder="Enter music prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Button to trigger API for music generation */}
      <button onClick={generateMusic} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* Display error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* If music is generated, show an audio player (This part wont be implemented just yet)*/}
      {musicURL && (
        <div>
          <p>Generated Music:</p>
          <audio controls>
            <source src={musicURL} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
