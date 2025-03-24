import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  res.status(500).json({ error: "No API Key" });
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let systemPrompt = `You are a great poet who can write poems of any topics and structures, such as ballad, sonnet, limerick and free verse.
Your job is to write a poem, using the user's input as its title.
You must print out the poem ONLY, and nothing else.
The poem must be creative and relevant to the title, with a clear theme and message.`;

let regenLinePrompt = `You are a great poet who can write poems of any topics and structures.
You are to rhyme the given verse with a new one, using the poem as context, without any introduction or preamble.
The new verse must RHYME with the given verse on the LAST WORD, while being relevant to the poem
The new verse must NOT repeat any part of the given verse, and must be grammatically correct.
You must output a SINGLE verse ONLY`;

export default async function handler(req, res) {

  if (req.method === "POST") {
    try {
      let prompt = "";
      const { message } = await req.body;

      if (!message) {
        return res.status(400).json({ error: "Message content is required." });
      }

      if (message.toLowerCase().includes("rhyme")) {
        prompt = regenLinePrompt;
      }
      else {
        prompt = systemPrompt;
      }

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama-3.1-8b-instant",
      });

      const responseMsg =
        chatCompletion.choices[0]?.message?.content ||
        "No response from Llama.";

      return res.status(200).json({ response: responseMsg });
    } 
    catch (error) {
      console.error("Error in chat API:", error);
      return res.status(500).json({ error: "Hahaha Loser!" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
