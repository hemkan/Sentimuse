import fetch from "node-fetch";

// Proxy API route to handle CORS issues with audio files
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    console.log("Proxying audio from URL:", url);

    // Fetch the audio file
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch audio: ${response.status} ${response.statusText}`
      );
    }

    // Get the content type from the response
    const contentType = response.headers.get("content-type");
    console.log("Content-Type:", contentType);

    // Set appropriate headers
    res.setHeader("Content-Type", contentType || "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=31536000");

    // Stream the response to the client
    response.body.pipe(res);
  } catch (error) {
    console.error("Error proxying audio:", error);
    res.status(500).json({
      error: error.message,
      details:
        "Failed to proxy audio file. Please check the URL and try again.",
    });
  }
}
