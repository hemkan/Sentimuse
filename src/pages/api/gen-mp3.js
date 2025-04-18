import { promises as fs } from "fs";
import { uploadToSupabase } from "../../utils/supabaseClient";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { file1Base64, file2Base64, file1Name, file2Name } = req.body;

    if (!file1Base64 || !file2Base64) {
      return res.status(400).json({ error: "Both audio files are required" });
    }

    // create tmp files
    const tempDir = os.tmpdir();
    const file1Path = path.join(
      tempDir,
      `${uuidv4()}-${file1Name || "file1.mp3"}`
    );
    const file2Path = path.join(
      tempDir,
      `${uuidv4()}-${file2Name || "file2.mp3"}`
    );

    // decode base64 and write to temp files
    await fs.writeFile(file1Path, Buffer.from(file1Base64, "base64"));
    await fs.writeFile(file2Path, Buffer.from(file2Base64, "base64"));

    console.log("Created temp files:", { file1Path, file2Path });

    const file1Stats = await fs.stat(file1Path);
    const file2Stats = await fs.stat(file2Path);

    console.log("File sizes:", {
      file1Size: file1Stats.size,
      file2Size: file2Stats.size,
    });

    if (file1Stats.size === 0 || file2Stats.size === 0) {
      throw new Error("One or both files are empty");
    }

    const file1Buffer = await fs.readFile(file1Path);
    const file2Buffer = await fs.readFile(file2Path);

    const file1Upload = await uploadToSupabase(
      file1Buffer,
      "audio-files",
      path.basename(file1Path)
    );

    const file2Upload = await uploadToSupabase(
      file2Buffer,
      "audio-files",
      path.basename(file2Path)
    );

    if (!file1Upload?.data?.publicUrl || !file2Upload?.data?.publicUrl) {
      throw new Error("Failed to upload files to Supabase");
    }

    const file1Url = file1Upload.data.publicUrl;
    const file2Url = file2Upload.data.publicUrl;

    console.log("Uploaded files to Supabase:", { file1Url, file2Url });

    // clean up
    await Promise.all([
      fs
        .unlink(file1Path)
        .catch((err) => console.error("Error deleting file1:", err)),
      fs
        .unlink(file2Path)
        .catch((err) => console.error("Error deleting file2:", err)),
    ]);

    return res.status(200).json({
      file1Url,
      file2Url,
      message: "Files uploaded successfully",
    });
  } catch (err) {
    console.error("Error processing files:", err);
    return res.status(500).json({ error: err.message });
  }
}
