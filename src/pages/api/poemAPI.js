import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    res.status(500).json({ error: "No API Key" });
}

const groq = new Groq({
    apiKey,
});

export default async function POST(request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message content is required."},
                { status: 400 }
            );
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const responseMessage = chatCompletion.choices[0]?.delta?.content || "No response from Llama.";

        return NextResponse.json({ response: responseMessage });
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
