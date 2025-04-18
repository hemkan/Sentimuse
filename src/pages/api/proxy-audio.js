// Proxy API route to handle CORS issues with audio files
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    // Fetch the audio file
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch audio: ${response.status} ${response.statusText}`
      );
    }

    // Get the content type
    const contentType = response.headers.get("content-type");

    // Set appropriate headers
    res.setHeader("Content-Type", contentType || "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000");

    // Stream the response
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error proxying audio:", error);
    res.status(500).json({ error: "Failed to proxy audio file" });
  }
}
