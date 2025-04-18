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

  // handle the download button click
  const handleDownload = async () => {
    if (!narrationFile || !musicFile) {
      alert("Please select both narration and music files.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // upload files to Supabase
      let narrationUrl = await uploadToSupabase(narrationFile);
      let musicUrl = await uploadToSupabase(musicFile);

      if (!narrationUrl || !musicUrl) {
        setLoading(false);
        alert("File upload failed. Try again.");
        return;
      }
      console.log("Uploaded URLs:", { narrationUrl, musicUrl });

      // put the URLs in the correct format
      if (narrationUrl?.data?.publicUrl)
        narrationUrl = narrationUrl.data.publicUrl;
      if (musicUrl?.data?.publicUrl) musicUrl = musicUrl.data.publicUrl;
      console.log("Received URLs:", { narrationUrl, musicUrl });

      if (!narrationUrl || !musicUrl) {
        throw new Error("Missing audio sources");
      }

      if (typeof narrationUrl !== "string" || typeof musicUrl !== "string") {
        throw new Error("Invalid URL format received");
      }

      // call the API to generate the MP3
      const response = await fetch("/api/gen-mp3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ narrationUrl, musicUrl }),
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

      // Check the content type to determine how to handle the response
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // Handle JSON response (likely an error)
        const jsonData = await response.json();
        throw new Error(jsonData.error || "Unknown error occurred");
      } else {
        // Handle binary response (audio file)
        const audioBlob = await response.blob();
        const file = new File([audioBlob], "output.mp3", {
          type: "audio/mpeg",
        });

        // create a download link and trigger it
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.mp3";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // upload the MP3 file to Supabase
        const supabaseUrl = await uploadToSupabase(file);
        console.log("Uploaded to Supabase:", supabaseUrl);
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
