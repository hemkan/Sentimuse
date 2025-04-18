import { ElevenLabsClient } from "elevenlabs";

export default async function getNarrationStream(req, res) {
  if (req.method == "POST") {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "No API Key" });
    }

    const elevenLabs = new ElevenLabsClient({
      apiKey,
    });

    const { poetry: text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No Text Provided" });
    }

    try {
      const audioStream = await elevenLabs.textToSpeech.convertAsStream(voice, {
        text,
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          use_speaker_boost: true,
          speed: 0.9,
          style: 0.75,
        },
      });

      res.status(200);
      res.setHeader("Content-Type", "audio/mpeg");

      audioStream.pipe(res);

      await new Promise((resolve, reject) => {
        audioStream.on("end", resolve);
        audioStream.on("error", reject);
      });
    } catch (error) {
      console.log("ElevenLabs API Error:", error);

      // Check for specific error types
      if (error.statusCode === 401) {
        return res.status(401).json({
          error:
            "Authentication failed with ElevenLabs API. Please check your API key.",
        });
      } else if (error.statusCode === 400) {
        return res.status(400).json({
          error:
            "Invalid request to ElevenLabs API. Please check your parameters.",
        });
      } else if (error.statusCode === 404) {
        return res.status(404).json({
          error: "Voice not found. Please check the voice ID.",
        });
      } else if (error.statusCode === 429) {
        return res.status(429).json({
          error:
            "Rate limit exceeded for ElevenLabs API. Please try again later.",
        });
      } else {
        return res.status(500).json({
          error: "An error occurred with the ElevenLabs API",
          details: error.message || "Unknown error",
        });
      }
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
