// import { ElevenLabsClient } from "elevenlabs";

// const apiKey = process.env.ELEVENLABS_API_KEY;

// if (!apiKey) {
//   res.status(500).json({ error: "No API Key" });
// }

// const elevenLabs = new ElevenLabsClient({
//   apiKey: process.env.ELEVENLABS_API_KEY,
// });

// export default async function getNarrationStream(req, res) {
//   if (req.method == "POST") {
//     const { poetry: text, voice } = req.body;

//     if (!text) {
//       return res.status(400).json({ error: "No Text Provided" });
//     }

//     try {
//       const audio = await elevenLabs.generate({
//         voice,
//         text,
//         model_id: "eleven_turbo_v2",
//       });

//       res.status(200);
//       res.setHeader("Content-Type", "audio/mpeg");

//       audio.pipe(res);

//       await new Promise((resolve, reject) => {
//         audio.on("end", resolve);
//         audio.on("error", reject);
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ error: "An Error Occurred" });
//     }
//   } else {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }
// }
