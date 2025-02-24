import { useState } from "react";
import { uploadToSupabase } from "../utils/supabaseClient";

export default function DownloadButton() {
  const [narrationFile, setNarrationFile] = useState(null);
  const [musicFile, setMusicFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleDownload = async () => {
    if (!narrationFile || !musicFile) {
      alert("Please select both narration and music files.");
      return;
    }

    // upload files to Supabase
    let narrationUrl = await uploadToSupabase(narrationFile);
    let musicUrl = await uploadToSupabase(musicFile);

    if (!narrationUrl || !musicUrl) {
      setLoading(false);
      alert("File upload failed. Try again.");
      return;
    }
    console.log("Uploaded URLs:", { narrationUrl, musicUrl });

    if (narrationUrl?.data?.publicUrl)
      narrationUrl = narrationUrl.data.publicUrl;
    if (musicUrl?.data?.publicUrl) musicUrl = musicUrl.data.publicUrl;
    console.log("Received URLs:", { narrationUrl, musicUrl });
    if (!narrationUrl || !musicUrl) {
      return res.status(400).json({ error: "Missing audio sources" });
    }

    if (typeof narrationUrl !== "string" || typeof musicUrl !== "string") {
      throw new Error("Invalid URL format received");
    }

    // call the API to generate the MP3
    const response2 = await fetch("/api/gen-mp3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ narrationUrl, musicUrl }),
    });

    if (!response2.ok) {
      throw new Error("Failed to fetch MP3");
    }

    // download the MP3 file
    const audioBlob = await response2.blob();
    const file = new File([audioBlob], "output.mp3", { type: "audio/mpeg" });

    const supabaseUrl = await uploadToSupabase(file);
    console.log("Uploaded to Supabase:", supabaseUrl);
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
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="merged_audio.mp3"
          className="block mt-2 text-blue-600"
        >
          Download MP3
        </a>
      )}
    </div>
  );
}
