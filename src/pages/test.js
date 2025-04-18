// TestPage.js
import { usePoemContext } from "../context/poemContext";

export default function TestPage() {
  const { music } = usePoemContext();

  const getAudioUrl = (music) => {
    if (!music) return null;
    if (music.isCustom) return music.url;
    return `/api/proxy-audio?url=${encodeURIComponent(music.url)}`;
  };

  const audioUrl = getAudioUrl(music);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Context Test</h1>

      {music ? (
        <div className="bg-gray-100 p-4 rounded">
          <p>
            <strong>Is Custom:</strong> {music.isCustom ? "Yes" : "No"}
          </p>
          <p>
            <strong>Track ID:</strong> {music.id || "N/A"}
          </p>
          <p>
            <strong>Title:</strong> {music.title || "N/A"}
          </p>
          <p>
            <strong>URL:</strong> {music.url ? "URL exists" : "No URL"}
          </p>

          {audioUrl && (
            <div className="mt-4">
              <p>Test playback:</p>
              <audio controls src={audioUrl}></audio>
            </div>
          )}
        </div>
      ) : (
        <p>No music selected</p>
      )}

      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
}
