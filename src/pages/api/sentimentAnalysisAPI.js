export default async function handler(req, res)
{
    //verify request is POST
    if (req.method !== "POST")
    {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try
    {
        //extract poem from request body through object deconstruction
        const { poem, customSentiment } = req.body;

        //handling custom sentiment
        if(customSentiment)
        {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify(
                {
                    model: "llama3-8b-8192",
                    messages: [
                        { role: "system", content: "You are an AI that simplifies user-inputted sentiment descriptions into a single-word emotion. Use words like 'joy', 'sadness', 'anger', 'calm', etc. If the input is unintelligible, simply respond with 'unknown'." },
                        { role: "user", content: customSentiment },
                    ],
                    temperature: 0.7,
                    max_tokens: 5,
                }),
            });

            const data = await response.json();

            //log the full response for debugging
            //console.log("Groq API response:", JSON.stringify(data));

            //extract sentiment from response with Optional Chaining
            //assumed to be contained within data.choices.[0].message.content
            let processedSentiment = data.choices?.[0]?.message?.content?.trim() || "Unknown";
            //polish final result before returning
            if(processedSentiment !== "Unknown")
            {
                processedSentiment = processedSentiment.charAt(0).toUpperCase() + processedSentiment.slice(1).toLowerCase();
            }

            return res.status(200).json({ sentiment: processedSentiment });
        }

        //make POST request to Groq API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            //define request to AI model
            body: JSON.stringify(
            {
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "You are an AI that classifies the overall sentiment of a poem with a single word. You can use words like 'joy', 'sadness', 'anger', 'calm', etc. If the input is unintelligible, simply respond with 'unknown'." },
                    { role: "user", content: poem },
                ],
                temperature: 0.7, //conrols consistency of response
                max_tokens: 5, //limits response to 5 words max
            }),
        });

        //parse JSON response from Groq
        const data = await response.json();

        //log the full response for debugging
        //console.log("Groq API response:", JSON.stringify(data));

        //extract sentiment from response with Optional Chaining
        //assumed to be contained within data.choices.[0].message.content
        let sentiment = data.choices?.[0]?.message?.content?.trim() || "Unknown";
        //polish final result before returning
        if(sentiment !== "Unknown")
        {
            sentiment = sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
        }

        //return sentiment as JSON
        return res.status(200).json({ sentiment });
    }
    catch (error)
    {
        console.error("Error analyzing sentiment:", error);
        return res.status(500).json({ error: "Failed to analyze sentiment." });
    }
    //test with npm run dev + postman
}
