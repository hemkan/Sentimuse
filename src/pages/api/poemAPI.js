import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  res.status(500).json({ error: "No API Key" });
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = ` 
You are a helpful assistant that can generate poems based on user input. 
Your task is to create a poem that is both creative and relevant to the user's reques, without any introductions. 
The poem should be in English and follow the structure of a traditional poem, with a clear theme and message.`;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { message } = await req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message content is required." });
      }

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
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
    } catch (error) {
      console.error("Error in chat API:", error);
      return res.status(500).json({ error });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
