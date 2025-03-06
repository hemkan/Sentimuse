export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Extract the prompt 
  const { prompt } = req.body;
  
  // Validate prompt
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    // Jamendo API endpoint to fetch tracks
    const jamendoUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.JAMENDO_CLIENT_ID}&format=jsonpretty&limit=1&search=${encodeURIComponent(prompt)}&audioformat=mp32`;
    
    // GET request to the Jamendo API
    const response = await fetch(jamendoUrl);
    const data = await response.json();

    // Check if a track was returned
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No tracks found" });
    }

    // Select the first track
    const track = data.results[0];

    // Return the track URL and additional metadata
    return res.status(200).json({
      trackUrl: track.audio,
      // THESE WILL PROBABLY BE UNECESSARY, BUT ILL KEEP FOR NOW
      title: track.name,
      artist: track.artist_name,
    });
  } catch (error) {
    console.error("Jamendo API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
