// components/MusicSearch.js
import { useState } from "react";
import MainHeader from './components/Header'; 
import AudioBox from './components/AudioBox';
import NextButton from './components/NextButton';

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
    <div>
      <MainHeader />
      <div className="w-scren h-[calc(100vh-132px)] flex flex-col items-center justify-center">
        <AudioBox />
      </div>
    </div>
  );
}

