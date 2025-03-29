import axios from "axios";
import FormData from "form-data";

const apiKey = process.env.STABILITY_API_KEY;

export default async function generate(req, res) {
  if (!apiKey) {
    return res.status(500).json({ error: "No API Key" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, output_format } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No Prompt Provided" });
  }

  try {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", output_format);
    form.append("width", 512);
    form.append("height", 512);

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
      }
    );

    res.setHeader("Content-Type", `image/${output_format}`);
    res.status(200).send(Buffer.from(response.data));
  } catch (error) {
    console.error("Error:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Image generation failed" });
  }
}
