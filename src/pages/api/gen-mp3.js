import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// this is for temporary testing
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { narrationUrl, musicUrl } = req.body;

  console.log("Received URLs:", { narrationUrl, musicUrl });

  if (!narrationUrl || !musicUrl) {
    return res.status(400).json({ error: "Missing audio URLs" });
  }

  try {
    // pipe for streaming the output
    const outputStream = new PassThrough();

    // process the audio
    ffmpeg()
      .input(narrationUrl)
      .input(musicUrl)
      .complexFilter([
        "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=3[aout]",
      ])
      .outputOptions(["-map [aout]"])
      .outputFormat("mp3")
      .on("error", (err) => {
        console.error("FFMPEG Error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Audio processing failed" });
        }
      })
      .on("end", () => {
        console.log("Processing complete");
      })
      .pipe(outputStream);

    // if the stream errors, return an error response
    outputStream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Streaming error occurred" });
      }
    });

    // set the response headers
    res.status(200);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=output.mp3");

    // pipe the output stream to the response
    outputStream.pipe(res);
  } catch (error) {
    console.error("Error processing audio:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
