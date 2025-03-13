// components/MusicSearch.js
import { useState } from "react";

export default function MusicSearch() {
  /*
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
*/
  return (
    <div className="flex flex-col items-center font-bold scale-[1.4]">
      <h1 className="text-4xl mb-4">Choose your Music</h1>
      <button className="w-96 m-5 bg-blue-600 hover:bg-blue-900 text-white font-medium p-2 rounded">No Music</button>
      <p className="font-light text-gray-400 text-xs">Select this is if you prefer no background msuic.</p>
      <button className="w-96 m-5 bg-blue-600 hover:bg-blue-900 text-white font-medium p-2 rounded">Upload Music File</button>
      <p className="font-light text-gray-400 text-xs">Upload your own background music.</p>
      <button className="w-96 m-5 bg-blue-600 hover:bg-blue-900 text-white font-medium p-2 rounded">Generate Music with Sentiment</button>
      <p className="font-light text-gray-400 text-xs">Automatically generate background music based on sentiment analysis.</p>
    </div>
  );
}
