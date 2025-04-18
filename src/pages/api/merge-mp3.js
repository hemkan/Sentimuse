// import { IncomingForm } from "formidable";
import Transloadit from "transloadit";
import { promises as fs } from "fs";
import { uploadToSupabase } from "../../utils/supabaseClient";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const client = new Transloadit({
  authKey: process.env.TRANSLOADIT_KEY,
  authSecret: process.env.TRANSLOADIT_SECRET,
  signatureAlgorithm: "sha256",
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // const form = new IncomingForm({
  //   maxFileSize: 25 * 1024 * 1024,
  //   keepExtensions: true,
  // });
  const { fileUrl1, fileUrl2 } = req.body;

  if (!fileUrl1 || !fileUrl2) {
    return res.status(400).json({ error: "Missing file URLs" });
  }

  // // const narrationPath = await downloadFromSupabase(file1);
  // // const backgroundPath = await downloadFromSupabase(file2);

  // // const [fields, files] = await new Promise((resolve, reject) =>
  // //   form.parse(req, (err, fields, files) =>
  // //     err ? reject(err) : resolve([fields, files])
  // //   )
  // // );

  // if (!files.file1 || !files.file2) {
  //   return res.status(400).json({ error: "Please upload both files." });
  // }

  // // grab the temp file paths
  // const narrationPath = Array.isArray(files.file1)
  //   ? files.file1[0].filepath
  //   : files.file1.filepath;
  // const backgroundPath = Array.isArray(files.file2)
  //   ? files.file2[0].filepath
  //   : files.file2.filepath;

  try {
    const result = await client.createAssembly({
      files: { file1: fileUrl1, file2: fileUrl2 },
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

    // download audio file frm Transloadit
    const response = await fetch(merged.ssl_url);
    const audioBlob = await response.blob();

    // make a file from the blob
    const audioFile = new File([audioBlob], merged.name, {
      type: "audio/mpeg",
    });

    // upload to supabase
    const supabaseUrl = await uploadToSupabase(audioFile, "processed-audio");
    console.log({ supabaseUrl });
    console.log(supabaseUrl.data.publicUrl);

    // clean up
    await Promise.all(
      [narrationPath, backgroundPath].map((p) => fs.unlink(p).catch(() => {}))
    );

    return res.status(200).json({
      url: supabaseUrl,
      transloaditUrl: merged.ssl_url,
      metadata: merged.meta,
    });
  } catch (err) {
    console.error("💥 Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
