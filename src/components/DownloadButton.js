import { useState } from "react";
import { uploadToSupabase } from "../utils/supabaseClient";

export default function DownloadButton() {
  const [narrationFile, setNarrationFile] = useState(null);
  const [musicFile, setMusicFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // if any file is selected, set the file in state
  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  // trying to convert the file to base64 for vercel deployment
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // handle the download button click
  const handleDownload = async () => {
    if (!narrationFile || !musicFile) {
      alert("Please select both narration and music files.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert files to base64
      const narrationBase64 = await fileToBase64(narrationFile);
      const musicBase64 = await fileToBase64(musicFile);

      // Call the API with base64 encoded files
      const response = await fetch("/api/merge-mp3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file1Base64: narrationBase64,
          file2Base64: musicBase64,
          file1Name: narrationFile.name,
          file2Name: musicFile.name,
        }),
      });

      // Check if the response is OK
      if (!response.ok) {
        // Try to parse the error response as JSON
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        } catch (jsonError) {
          // If JSON parsing fails, use the status text
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }

      const data = await response.json();
      console.log("API response:", data);

      if (data.file1Url && data.file2Url) {
        setDownloadUrl(data.file1Url);

        const a = document.createElement("a");
        a.href = data.file1Url;
        a.download = "output.mp3";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        throw new Error("No valid URLs returned from the server");
      }
    } catch (err) {
      console.error("Error generating audio:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => handleFileChange(e, setNarrationFile)}
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => handleFileChange(e, setMusicFile)}
      />
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate MP3"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
