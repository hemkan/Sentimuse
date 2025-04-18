import { IncomingForm } from "formidable";
import Transloadit from "transloadit";
import { promises as fs } from "fs";
import { uploadToSupabase } from "../../utils/supabaseClient";

export const config = {
  api: {
    bodyParser: false,
  },
};

const client = new Transloadit({
  authKey: process.env.TRANSLOADIT_KEY,
  authSecret: process.env.TRANSLOADIT_SECRET,
  signatureAlgorithm: "sha256",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new IncomingForm({
    maxFileSize: 25 * 1024 * 1024,
    keepExtensions: true,
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) =>
      form.parse(req, (err, fields, files) =>
        err ? reject(err) : resolve([fields, files])
      )
    );

    if (!files.file1 || !files.file2) {
      return res.status(400).json({ error: "Please upload both files." });
    }

    // grab the temp file paths
    const narrationPath = Array.isArray(files.file1)
      ? files.file1[0].filepath
      : files.file1.filepath;
    const backgroundPath = Array.isArray(files.file2)
      ? files.file2[0].filepath
      : files.file2.filepath;

    // Log the file paths for debugging
    console.log("Narration path:", narrationPath);
    console.log("Background path:", backgroundPath);

    // Check if files exist and have content
    const narrationStats = await fs.stat(narrationPath);
    const backgroundStats = await fs.stat(backgroundPath);

    console.log("Narration file size:", narrationStats.size);
    console.log("Background file size:", backgroundStats.size);

    if (narrationStats.size === 0 || backgroundStats.size === 0) {
      throw new Error("One or both files are empty");
    }

    const result = await client.createAssembly({
      files: { file1: narrationPath, file2: backgroundPath },
      params: {
        template_id: "fab4a325ed1043d28598a327725479f2",
      },
      waitForCompletion: true,
    });

    console.log({ result });
    const merged = result.results["merged-audio"]?.[0];
    console.log("Available result keys:", Object.keys(result.results));
    console.log("Available result:", result.results["merged-audio"]);

    if (!merged) throw new Error("No merge result");

    // download audio file from Transloadit
    const response = await fetch(merged.ssl_url);
    const audioBuffer = await response.arrayBuffer();

    // Create a Buffer from the ArrayBuffer
    const audioBufferNode = Buffer.from(audioBuffer);

    // upload to supabase
    const supabaseUrl = await uploadToSupabase(
      audioBufferNode,
      "processed-audio",
      merged.name
    );
    console.log({ supabaseUrl });

    if (!supabaseUrl || !supabaseUrl.data || !supabaseUrl.data.publicUrl) {
      throw new Error("Failed to get public URL from Supabase");
    }

    const publicUrl = supabaseUrl.data.publicUrl;
    console.log("Public URL:", publicUrl);

    // clean up
    await Promise.all(
      [narrationPath, backgroundPath].map((p) => fs.unlink(p).catch(() => {}))
    );

    const acceptHeader = req.headers.accept || "";
    if (acceptHeader.includes("application/json")) {
      return res.status(200).json({
        url: {
          data: {
            publicUrl: publicUrl,
          },
        },
        publicUrl: publicUrl,
        transloaditUrl: merged.ssl_url,
        metadata: merged.meta,
      });
    } else {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", "attachment; filename=output.mp3");
      return res.send(audioBufferNode);
    }
  } catch (err) {
    console.error("💥 Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
