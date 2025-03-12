import { useState } from "react";

const Sentiment = () =>
{
  const [poem, setPoem] = useState("");
  const [aiSentiment, setAISentiment] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [customSentiment, setCustomSentiment] = useState("");
  const [processedSentiment, setProcessedSentiment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const sentimentOptions = ["Joy", "Sadness", "Anger", "Calm", "Love", "Fear", "Surprise"];

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
        setSelectedSentiment(data.sentiment); //default to AI-generated sentiment
    }
    catch (error)
    {
        console.error("Error analyzing sentiment:", error);
        setAISentiment("Error analyzing sentiment");
    }
  };

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
        setSelectedSentiment(data.sentiment);
    }
    catch (error)
    {
        console.error("Error processing sentiment:", error);
        setProcessedSentiment("Error");
        setSelectedSentiment(data.sentiment);
    }
    finally
    {
        setIsProcessing(false);
    }
  };

  //handles clicking a pane
  const selectPane = (paneType) =>
  {
    setSelectedSentiment(paneType);
  };

  //handles "Next" button click
  const handleProceed = () =>
  {
    alert(`Proceeding with sentiment: ${selectedSentiment}`);
    console.log("Final Sentiment:", selectedSentiment);
  };

  const isSelected = !!selectedSentiment;

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

          {/* Only show the 3-pane layout if we have an AI sentiment */}
          {aiSentiment && (
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>

              {/* 1) AI-Detected Sentiment Pane */}
              <div
                onClick={() => selectPane(aiSentiment)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  border: selectedSentiment === aiSentiment ? "4px solid green": "2px solid gray",
                  borderRadius: "8px",
                  minHeight: "150px",
                  backgroundColor: "black",
                  cursor: "pointer",
                  position: "relative"
                }}
              >
                <h3>AI Sentiment</h3>
                <p><strong>{aiSentiment}</strong></p>
                {selectedSentiment === aiSentiment && (
                  <span style={{ position: "absolute", top: "5px", right: "10px", fontSize: "20px" }}>
                    ✔
                  </span>
                )}
              </div>

              {/* 2) Predefined Emotions Pane */}
              <div
                style={{
                  flex: 1, padding: "1rem", border: "2px solid gray", borderRadius: "8px",
                  minHeight: "150px"
                }}
              >
                <h3>Predefined Emotions</h3>
                {sentimentOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectPane(option)}
                    style={{
                      display: "block",
                      margin: "5px auto",
                      padding: "0.5rem 1rem",
                      backgroundColor: "black",
                      color: "white",
                      border: selectedSentiment === option ? "4px solid green": "2px solid gray",
                      borderRadius: "5px",
                      cursor: "pointer",
                      position: "relative",
                      width: "80%",
                      marginTop: "0.3rem"
                    }}
                  >
                    {option}
                    {selectedSentiment === option && (
                      <span style={{ position: "absolute", top: "5px", right: "10px", fontSize: "16px" }}>
                        ✔
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* 3) Custom Input Pane */}
              <div
                style={{
                  flex: 1,
                  padding: "1rem",
                  border: selectedSentiment === (processedSentiment || "") ? "4px solid green": "2px solid gray",
                  borderRadius: "8px",
                  minHeight: "150px",
                  position: "relative",
                  backgroundColor: "black",
                  cursor: "default"
                }}
                onClick={() => {
                  // Only select the custom pane if there's a processed sentiment
                  if (processedSentiment) selectPane(processedSentiment);
                }}
              >
                <h3>Custom Sentiment</h3>
                <textarea
                  value={customSentiment}
                  onChange={(e) => setCustomSentiment(e.target.value)}
                  placeholder="Type your own sentiment..."
                  style={{
                    width: "90%",
                    height: "50px",
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "1px solid black",
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
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  {isProcessing ? "Processing..." : "Submit"}
                </button>

                {/* Show processed custom sentiment below */}
                {processedSentiment && (
                  <div style={{ marginTop: "1rem", color: "white" }}>
                    <strong>Processed Sentiment:</strong> {processedSentiment}
                  </div>
                )}

                {selectedSentiment === processedSentiment && (
                  <span style={{ position: "absolute", top: "5px", right: "10px", fontSize: "20px" }}>
                    ✔
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Show selected sentiment above the Next button */}
          {isSelected && (
            <div style={{ marginTop: "1rem", fontSize: "1.2rem", color: "white" }}>
              <strong>Selected Sentiment:</strong> {selectedSentiment}
            </div>
          )}

          {/* Next Button */}
          {isSelected && (
            <button
              onClick={handleProceed}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          )}
        </div>
  );
}

export default Sentiment;