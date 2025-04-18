import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY; // Take API key from local host

if (!apiKey) {
  res.status(500).json({ error: "No API Key" });
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// System prompt to generate the first poem
let systemPrompt = `You are a great poet who can write poems of any topics and structures, such as ballad, sonnet, limerick and free verse.
Your job is to write a poem, using the user's input as its title.
You must print out the poem ONLY, and nothing else.
The poem must be creative and relevant to the title, with a clear theme and message.

Format your poem with dynamic punctuation and formatting to enhance narration:
- Use dashes (—) to create dramatic pauses and breaks in thought
- Use ellipses (...) to indicate trailing thoughts or suspense
- Use quotation marks for dialogue or thoughts ("DO YOU HEAR ME?!")
- Use ALL CAPS for emphasis and emotional outbursts
- Use single-line stanzas for dramatic effect ("I did. I shook.")
- Use parentheses for whispered asides or internal thoughts
- Use exclamation marks for excitement, fear, or emphasis
- Use question marks for uncertainty or rhetorical questions
- Vary line length to create rhythm and pacing
- Use onomatopoeia and sound words (BANG!, whispered, howled)
- Create visual spacing to indicate pauses in narration

Make sure to capitalize the first letter at the start of each verse.
Include appropriate punctuation to enhance the emotional flow.
Use exaggeration and emphasis where appropriate to create dramatic effect.
Add pauses and rhythm through strategic use of punctuation and line breaks.
Incorporate emotional cues that will translate well to spoken narration.`;

// System prompt to regenerate a line
let regenLinePrompt = `You are a great poet who can write poems of any topics and structures.
You are to rhyme the given verse with a new one, using the poem as context, without any introduction or preamble.
The new verse must RHYME with the given verse on the LAST WORD, while being relevant to the poem.
The new verse must NOT repeat any part of the given verse, and must be grammatically correct.
You must output a SINGLE verse ONLY.

Format your verse with dynamic punctuation and formatting to enhance narration:
- Use dashes (—) to create dramatic pauses and breaks in thought
- Use ellipses (...) to indicate trailing thoughts or suspense
- Use quotation marks for dialogue or thoughts
- Use ALL CAPS for emphasis and emotional outbursts
- Use exclamation marks for excitement, fear, or emphasis
- Use question marks for uncertainty or rhetorical questions
- Use onomatopoeia and sound words when appropriate

Include appropriate punctuation to enhance the emotional flow.
Use exaggeration and emphasis where appropriate to create dramatic effect.
Add pauses and rhythm through strategic use of punctuation.
Incorporate emotional cues that will translate well to spoken narration.`;

// System prompt to generate a whole poem based on one line
let genPoemPrompt = `You are a great poet who can write poems of any topics and structures.
Your job is to write a full poem, using the user's written verse for clues and context.
You must print out the poem ONLY, and nothing else.
The poem must be creative and relevant to the user's written verse, having it as the first verse in your poem.
The second verse must RHYME with the written verse on the LAST WORD.

Format your poem with dynamic punctuation and formatting to enhance narration:
- Use dashes (—) to create dramatic pauses and breaks in thought
- Use ellipses (...) to indicate trailing thoughts or suspense
- Use quotation marks for dialogue or thoughts ("DO YOU HEAR ME?!")
- Use ALL CAPS for emphasis and emotional outbursts
- Use single-line stanzas for dramatic effect ("I did. I shook.")
- Use parentheses for whispered asides or internal thoughts
- Use exclamation marks for excitement, fear, or emphasis
- Use question marks for uncertainty or rhetorical questions
- Vary line length to create rhythm and pacing
- Use onomatopoeia and sound words (BANG!, whispered, howled)
- Create visual spacing to indicate pauses in narration

Make sure to capitalize the first letter at the start of each verse.
Include appropriate punctuation to enhance the emotional flow.
Use exaggeration and emphasis where appropriate to create dramatic effect.
Add pauses and rhythm through strategic use of punctuation and line breaks.
Incorporate emotional cues that will translate well to spoken narration.`;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      let prompt = "";
      const { message } = await req.body; // Getting message prompt

      if (!message) {
        return res.status(400).json({ error: "Message content is required." });
      }

      // Decides which system prompt to use based on keyword from message prompt
      if (message.toLowerCase().includes("rhyme")) {
        prompt = regenLinePrompt;
      } else if (message.toLowerCase().includes("create")) {
        prompt = genPoemPrompt;
      } else {
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
        model: "llama-3.1-8b-instant", // Groq API selected AI model, CAN CHANGE!
      });

      const responseMsg =
        chatCompletion.choices[0]?.message?.content ||
        "No response from Llama.";

      return res.status(200).json({ response: responseMsg });
    } catch (error) {
      console.error("Error in chat API:", error);
      return res.status(500).json({ error: "Hahaha Loser!" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
