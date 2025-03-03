import {useState} from "react";

const UserSentimentMenu = ({sentiment, userSentiment, setUserSentiment}) =>
{
    const [customSentiment, setCustomSentiment] = useState("");

    //filter out sentiment list
    //remove a sentiment if it matches the analyzed sentiment
    const sentimentOptions = ["Joy", "Sadness", "Anger", "Calm", "Love", "Fear", "Surprise"].filter(
      (option) => option.toLowerCase() !== sentiment.toLowerCase()
    );

    //handle custom input from user
    const takeCustomSentiment = (e) =>
    {
        setCustomSentiment(e.target.value);
        setUserSentiment(e.target.value);
    }

    return (
        <div style={{ marginTop: "1rem"}}>
            <label htmlFor="sentiment-select"><strong> Select your own sentiment: </strong></label>
            <select
                id = "sentiment-select"
                value = {userSentiment}
                onChange = {(e) => setUserSentiment(e.target.value)}
                style = {{marginLeft: "1rem", color: "black"}}
            >
                <option value = {sentiment}>{sentiment}</option>
                {sentimentOptions.map((option) => (
                        <option key={option} value = {option}>{option}</option>
                ))}
                <option value = "custom">Custom</option>
            </select>

            {userSentiment === "custom" && (
                <div style={{ marginTop: "0.5rem" }}>
                    <label htmlFor="custom-sentiment"><strong>Enter Custom Sentiment:</strong></label>
                    <input
                        id="custom-sentiment"
                        type="text"
                        value={customSentiment}
                        onChange={takeCustomSentiment}
                        placeholder="Type your emotion..."
                        style={{ marginLeft: "1rem", padding: "0.3rem" }}
                    />
                </div>
            )}
        </div>
    );
};

export default UserSentimentMenu;