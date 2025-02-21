export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Extract text from request body
  const { prompt } = req.body;

  // Ensure prompt is provided not empty
  if (!prompt) {
    return res.status(400).json({ error: "No Prompt Provided" });
  }

  try {
    // Send request to Mubert API
    const response = await fetch("https://api.mubert.com/v2/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MUBERT_API_KEY}`, // (Replace with real API key)
      },
      body: JSON.stringify({
        text: prompt, // Pass music prompt
        format: "wav", // Specify desired music format
        duration: 10, // Set duration
      }),
    });

    // Parse the response from Mubert
    const data = await response.json();

    // Check if the request was unsuccessful
    if (!response.ok) {
      throw new Error(data.error || "Failed to generate music");
    }

    // Return successful response with generated music 
    return res.status(200).json(data); // (Returns status code only since no API key)
  } 

  // Unexpected errors
  catch (error) {
    console.error("Mubert API Error:", error); // Log error 
    return res.status(500).json({ error: error.message }); // Send error response
  }
}
