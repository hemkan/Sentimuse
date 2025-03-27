import { useState } from "react";

const Sentiment = () =>
{
  const [poem, setPoem] = useState("");
  const [aiSentiment, setAISentiment] = useState("");
  const [customSentiment, setCustomSentiment] = useState("");
  const [processedSentiment, setProcessedSentiment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPane, setSelectedPane] = useState(null);
  const sentimentOptions = ["Joy", "Sadness", "Anger", "Calm", "Love", "Fear", "Surprise"];

  //detect sentiment of poem
  const analyzeSentiment = async () =>
  {
    try
    {
        const response = await fetch("/api/sentimentAnalysisAPI",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ poem }),
        });

        const data = await response.json();
        setAISentiment(data.sentiment);
        setSelectedPane({ type: "AI" }); //default to AI-generated sentiment
    }
    catch (error)
    {
        console.error("Error analyzing sentiment:", error);
        setAISentiment("Error");
        setSelectedPane({ type: "AI" });
    }
  };

  //process custom sentiment into single word
  const processCustomSentiment = async () =>
  {
    if (!customSentiment.trim()) return;
    setIsProcessing(true);

    try
    {
        const response = await fetch("/api/sentimentAnalysisAPI",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customSentiment }),
        });

        const data = await response.json();
        setProcessedSentiment(data.sentiment);
        setSelectedPane({ type: "custom" });
    }
    catch (error)
    {
        console.error("Error processing sentiment:", error);
        setProcessedSentiment("Error");
        setSelectedPane({ type: "custom" });
    }
    finally
    {
        setIsProcessing(false);
    }
  };

  //use selected pane to determine user's selection
  const getFinalSentiment = () =>
  {
    if(!selectedPane)
    {
      return "";
    }

    if(selectedPane.type === "AI")
    {
      return aiSentiment;
    }
    else if(selectedPane.type === "predefined")
    {
      return selectedPane.value;
    }
    else if(selectedPane.type === "custom")
    {
      return processedSentiment;
    }

    return "";
  }

  //handles "Next" button click
  const handleProceed = () =>
  {
    const final = getFinalSentiment();
    alert(`Proceeding with sentiment: ${final}`);
    console.log("Final Sentiment:", final);
  };

  const isSelected = !!selectedPane;
  //remove AI-detected sentiment if its in predefined sentiment list
  const filteredOptions = sentimentOptions.filter((option) => option !== aiSentiment);

  return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1><strong>Sentiment Analyzer</strong></h1>

          {/* poem input field */}
          <textarea
              style={{ color: "black", width: "80%", padding: "0.5rem", marginTop: "1rem", borderRadius: "5px", border: "1px solid gray" }}
              value={poem}
              onChange={(e) => setPoem(e.target.value)}
              placeholder="Enter your poem here..."
              rows={6}
          />
          <br />

          {/* analyze sentiment button */}
          <button
              onClick={analyzeSentiment}
              style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
              Analyze Sentiment
          </button>

          {/* only show panes if poem was processed */}
          {aiSentiment && (
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>

              {/* pane 1: AI-detected sentiment */}
              <div
                onClick={() => setSelectedPane({ type: "AI" })}
                style={{
                  flex: 1,
                  padding: "1rem",
                  border: selectedPane?.type === "AI" ? "4px solid green": "2px solid gray",
                  borderRadius: "8px",
                  minHeight: "150px",
                  backgroundColor: "black",
                  cursor: "pointer",
                  position: "relative"
                }}
              >
                <h1>Your poem evokes feelings of...</h1>
                <p style={{padding: "10rem", fontSize: "50px"}}><strong>{aiSentiment}</strong></p>
                {/* checkmark if selected */}
                {selectedPane?.type === "AI" && (
                  <span style={{ position: "absolute", top: "5px", right: "10px", fontSize: "20px" }}>
                    ✔
                  </span>
                )}
              </div>

              {/* pane 2: predefined sentiment list */}
              <div style={{
                flex: 1,
                padding: "1rem",
                border: selectedPane?.type === "predefined" ? "4px solid green" : "2px solid gray",
                borderRadius: "8px",
                minHeight: "150px",
                backgroundColor: "black"
              }}>
                <h3>Select a Different Sentiment:</h3>
                <p style={{padding: "1rem"}}></p>
                {filteredOptions.map((option) =>
                {
                  const isThisSelected = selectedPane?.type === "predefined" && selectedPane.value === option;

                  return (
                    <strong><button
                      key={option}
                      onClick={() => setSelectedPane({ type: "predefined", value: option })}
                      style={{
                        display: "block",
                        margin: "5px auto",
                        padding: "0.5rem 1rem",
                        backgroundColor: "black",
                        color: "white",
                        border: isThisSelected ? "4px solid green" : "1px solid white",
                        borderRadius: "5px",
                        cursor: "pointer",
                        position: "relative",
                        width: "80%",
                        marginTop: "0.3rem"
                      }}
                    >
                      {option}
                      {isThisSelected && (
                        <span style={{
                          position: "absolute",
                          top: "5px",
                          right: "10px",
                          fontSize: "16px"
                        }}>
                          ✔
                        </span>
                      )}
                    </button></strong>
                  );
                })}
              </div>

              {/* pane 3: custom sentiment pane */}
              <div
                style={{
                  flex: 1,
                  padding: "1rem",
                  border: selectedPane?.type === "custom" ? "2px solid green" : "2px solid gray",
                  borderRadius: "8px",
                  minHeight: "150px",
                  position: "relative",
                  backgroundColor: "black"
                }}
                //user can click if processed sentiment exists
                onClick={() => {
                  if (processedSentiment)
                  {
                    setSelectedPane({ type: "custom" });
                  }
                }}
              >
                <h3>Enter Your Own Sentiment:</h3>
                <textarea
                  value={customSentiment}
                  onChange={(e) => setCustomSentiment(e.target.value)}
                  placeholder="Type here..."
                  style={{
                    width: "90%",
                    height: "50px",
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "1px solid white",
                    resize: "none",
                    color: "black"
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    processCustomSentiment();
                  }}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  {isProcessing ? "Processing..." : "Submit"} {/*show "processing" while input is processing */}
                </button>

                {/* show processed user input result */}
                {processedSentiment && (
                  <div style={{ marginTop: "1rem", color: "white" }}>
                    Processed Sentiment:
                    <p style={{ fontSize: "50px"}}><strong>{processedSentiment}</strong></p>
                  </div>
                )}

                {/* checkmark if pane is selected */}
                {selectedPane?.type === "custom" && (
                  <span style={{
                    position: "absolute",
                    top: "5px",
                    right: "10px",
                    fontSize: "20px"
                  }}>
                    ✔
                  </span>
                )}
              </div>
            </div>
          )}

          {/* display final sentiment that will be used going forward */}
          {isSelected && (
            <div style={{ marginTop: "1rem", fontSize: "1.2rem", color: "white" }}>
              Proceed with: <strong>{getFinalSentiment()}</strong>
            </div>
          )}

          {/* next button, enabled only if a pane is selected */}
          {isSelected && (
            <button
              onClick={handleProceed}
              disabled={getFinalSentiment() === "Unknown"}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: getFinalSentiment() === "Unknown" ? "gray" : "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: getFinalSentiment() === "Unknown" ? "not-allowed" : "pointer"
              }}
            >
              Next
            </button>
          )}
        </div>
      );
}

export default Sentiment;

/*"npm run dev" + http://localhost:3000/sentiment */