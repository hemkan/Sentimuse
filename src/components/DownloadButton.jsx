import { useState } from "react";

export default function DownloadButton({ narrationUrl, musicUrl }) {
  console.log(narrationUrl, musicUrl);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const response = await fetch("/api/generateMp3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ narrationUrl, musicUrl }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.downloadUrl) {
      setDownloadUrl(data.downloadUrl);
    }
  };

  return (
    <div>
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
          download="poetry.mp3"
          className="block mt-2 text-blue-600"
        >
          Download MP3
        </a>
      )}
    </div>
  );
}
