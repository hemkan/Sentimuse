import {useState} from "react";

const Sentiment = () =>
{
  //declare state variables
  const [poem, setPoem] = useState(""); //holds/sets poem
  const [sentiment, setSentiment] = useState(""); //holds/sets sentiment

  //calls sentiment analysis api
  const analyzeSentiment = async () =>
  {
    try
    {
      const response = await fetch("/api/sentimentAnalysisAPI",
      {
        method: "POST",
        headers:
        {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({poem: poem}) //send JSON poem
      });

      const data = await response.json(); //parse response as JSON
      setSentiment(data.sentiment); //update sentiment
    }
    catch(error)
    {
      console.error("Error analyzing sentiment:", error);
      setSentiment("Error analyzing sentiment");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1><strong>SENTIMENT ANALYZER</strong></h1>
      <textarea
        style={{color: "black"}}
        value={poem}
        onChange={(e) => setPoem(e.target.value)}
        placeholder="Enter your poem here..."
        rows={6}
        cols={50}
      />
      <br />
      <button
        onClick={analyzeSentiment}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Analyze Sentiment
      </button>
      {sentiment && (
        <div style={{ marginTop: "1rem" }}>
          Sentiment: <strong>{sentiment}</strong>
        </div>
      )}
    </div>
  );
};

export default Sentiment;