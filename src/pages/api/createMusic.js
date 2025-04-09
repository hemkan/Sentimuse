// pages/api/search-tracks.js

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    //MAP THE KEY WORD (INSTRUMENTAL) AT THE END OF QUERIES
    // Maybe the solution could be the sentiment analysis deciding on a genre and then querying that genre with the tag (instrumental) instead? 
    const jamendoUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.JAMENDO_CLIENT_ID}&format=json&limit=4&vocalinstrumental&search=${encodeURIComponent(prompt)}&audioformat=mp32`;

    const response = await fetch(jamendoUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No tracks found" });
    }

    return res.status(200).json({
      tracks: data.results.map((track) => ({
        title: track.name,
        artist: track.artist_name,
        url: track.audio,
      })),
    });
  } catch (error) {
    console.error("Jamendo API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
