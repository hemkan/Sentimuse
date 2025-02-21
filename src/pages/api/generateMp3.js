import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { promisify } from "util";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { narrationUrl, musicUrl } = req.body;

    if (!narrationUrl || !musicUrl) {
      return res.status(400).json({ error: "Missing audio sources" });
    }

    const outputFilePath = path.join(process.cwd(), "public", "generated.mp3");

    // Merge narration and music
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(narrationUrl)
        .input(musicUrl)
        .complexFilter([
          "[0]volume=1.0[a];[1]volume=0.3[b];[a][b]amix=inputs=2:duration=longest:dropout_transition=3[out]",
        ])
        .output(outputFilePath)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    res.status(200).json({ downloadUrl: "/generated.mp3" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
