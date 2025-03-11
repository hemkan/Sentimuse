import {useState} from "react";

const UserSentimentMenu = ({sentiment, setUserSentiment}) =>
{
    const [customSentiment, setCustomSentiment] = useState(""); //holds custom input for custom sentiment
    const [selectedSentiment, setSelectedSentiment] = useState(sentiment); //hold dropdown menu selection

    //filter out sentiment list
    //remove a sentiment if it matches the analyzed sentiment
    const sentimentOptions = ["Joy", "Sadness", "Anger", "Calm", "Love", "Fear", "Surprise"].filter(
      (option) => option.toLowerCase() !== sentiment.toLowerCase()
    );

    const dropdownChange = (e) =>
    {
        const selectedValue = e.target.value;
        setSelectedSentiment(selectedValue);

        // if "Custom" is selected, clear custom input field
        if (selectedValue !== "custom") {
            setCustomSentiment("");
        }
    };

    // once final confirmation/proceed button is clicked
    const handleProceed = async () =>
    {
        let finalSentiment = selectedSentiment;

        if (selectedSentiment === "custom" && customSentiment.trim() !== "")
        {
            try {
                const response = await fetch("/api/sentimentAnalysisAPI",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ customSentiment: customSentiment })
                });

                const data = await response.json();
                finalSentiment = data.sentiment; // Processed sentiment from API
            }
            catch (error)
            {
                console.error("Error processing custom sentiment:", error);
                finalSentiment = "Error";
            }
        }

        setUserSentiment(finalSentiment);
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <label htmlFor="sentiment-select"><strong>Select your sentiment:</strong></label>

            {/* dropdown menu for sentiment selection */}
            <select
                id="sentiment-select"
                value={selectedSentiment}
                onChange={dropdownChange}
                style={{ marginLeft: "1rem", color: "black" }}
            >
                {/* only adds AI sentiment to dropdown menu if valid*/}
                {sentiment !== "Unknown" &&
                <option value={sentiment}>{sentiment}</option>
                }
                {sentimentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
                <option value="custom">Custom</option>
            </select>

            {/* show text input when user selects custom */}
            {selectedSentiment === "custom" && (
                <div style={{ marginTop: "0.5rem" }}>
                    <label htmlFor="custom-sentiment"><strong>Enter Custom Sentiment:</strong></label>
                    <input
                        id="custom-sentiment"
                        value={customSentiment}
                        onChange={(e) => setCustomSentiment(e.target.value)}
                        placeholder="Type your emotion..."
                        style={{ marginLeft: "1rem", padding: "0.3rem", color: "black" }}
                    />
                </div>
            )}

            {/* button to confirm final selection */}
            <button
                onClick={handleProceed}
                style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
            >
                Proceed
            </button>
        </div>
    );
};

export default UserSentimentMenu;