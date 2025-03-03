import {useState} from "react";
import UserSentimentMenu from "../components/userSentimentMenu";

const Sentiment = () =>
{
  //declare state variables
  const [poem, setPoem] = useState(""); //holds/sets poem
  const [sentiment, setSentiment] = useState(""); //holds/sets sentiment
  const [userSentiment, setUserSentiment] = useState("");

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
      setUserSentiment(data.sentiment); //default user sentiment to the analyzed sentiment
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

      {/*allow user to select their own sentiment */}
      {sentiment && <UserSentimentMenu sentiment={sentiment} userSentiment={userSentiment} setUserSentiment={setUserSentiment} />}
    </div>
  );
};

export default Sentiment;

{/*test with http://localhost:3000/sentiment after "npm run dev"*/}