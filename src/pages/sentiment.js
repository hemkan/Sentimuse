import { useState, useEffect } from "react";
import { sentimentOptions } from "./data/sentimentOptions";
// import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { usePoemContext } from "@/context/poemContext";
import { useRouter } from "next/router";

const Sentiment = () => {
  //   const { state: incomingPoem } = useLocation();
  const { poem, setSentiment } = usePoemContext();
  const router = useRouter();
  //   const poem = incomingPoem?.data || "Poem not found.";
  //const [poem, setPoem] = useState("");
  const [aiSentiment, setAISentiment] = useState("");
  const [customSentiment, setCustomSentiment] = useState("");
  const [processedSentiment, setProcessedSentiment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPane, setSelectedPane] = useState(null);
  const [enterCustom, setEnterCustom] = useState(false);
  const filteredOptions = sentimentOptions.filter(
    (option) => option !== aiSentiment
  );
  const [shuffledOptions, setShuffledOptions] = useState(filteredOptions);
  //   const navigate = useNavigate();

  //detect sentiment of poem
  const analyzeSentiment = async () => {
    try {
      const response = await fetch("/api/sentimentAnalysisAPI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poem }),
      });

      const data = await response.json();
      setAISentiment(data.sentiment);
      setSelectedPane({ type: "AI" }); //default to AI-generated sentiment
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      setAISentiment("Error");
      setSelectedPane({ type: "AI" });
    }
  };

  //analyzeSentiment() will be run after intial page render
  useEffect(() => {
    if (!poem) {
      router.push("/poem");
      return;
    }

    analyzeSentiment();
  }, []); //empty dependency array [] = tells react to run this only after initial render

  //process custom sentiment into single word
  const processCustomSentiment = async () => {
    if (!customSentiment.trim()) return;
    setIsProcessing(true);

    try {
      const response = await fetch("/api/sentimentAnalysisAPI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customSentiment }),
      });

      const data = await response.json();
      setProcessedSentiment(data.sentiment);
      setSelectedPane({ type: "custom", value: data.sentiment });
    } catch (error) {
      console.error("Error processing sentiment:", error);
      setProcessedSentiment("Error");
      setSelectedPane({ type: "custom", value: "Error" });
    } finally {
      setIsProcessing(false);
      setEnterCustom(false);
    }
  };

  //use selected pane to determine user's selection
  const getFinalSentiment = () => {
    if (!selectedPane) {
      return "";
    }

    if (selectedPane.type === "AI") {
      return aiSentiment;
    } else if (selectedPane.type === "predefined") {
      return selectedPane.value;
    } else if (selectedPane.type === "custom") {
      return processedSentiment;
    }

    return "";
  };

  //handles "Next" button click to move to next page
  const handleProceed = () => {
    const finalSentiment = getFinalSentiment();
    //alert(`Proceeding with sentiment: ${final}`);
    //console.log("Final Sentiment:", final);

    // store in context
    setSentiment(finalSentiment);
    // navigate to narration page
    router.push("/narration");
  };

  //randomly select predefined sentiment options
  useEffect(() => {
    let arr = [...filteredOptions];
    let currentIndex = arr.length;

    while (currentIndex !== 0) {
      let rng = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[rng]] = [arr[rng], arr[currentIndex]];
    }

    setShuffledOptions(arr);
  }, [aiSentiment]); //aiSentiment = dependency array - this effect runs everytime aiSentiment changes

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {/*
        <h1><strong>Sentiment Analyzer</strong></h1>

        {//poem input field}
        <textarea
            style={{ color: "black", width: "80%", padding: "0.5rem", marginTop: "1rem", borderRadius: "5px", border: "1px solid gray" }}
            value={poem}
            onChange={(e) => setPoem(e.target.value)}
            placeholder="Enter your poem here..."
            rows={6}
        />
        <br />

        {//analyze sentiment button}
        <button
            onClick={analyzeSentiment}
            style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
            Analyze Sentiment
        </button>
        */}

      <div>
        <div className="w-[1280px] h-[832px] relative bg-neutral-900 overflow-hidden">
          <div className="w-[1280px] h-32 left-0 top-0 absolute bg-neutral-900" />
          <div className="w-36 h-9 left-[64px] top-[43px] absolute text-center justify-center text-white text-3xl font-normal font-['Inria_Sans']">
            Sentimuse
          </div>
          {/* initial layout of sentiment page */}
          {!enterCustom && (
            <div>
              {/* AI-detected sentiment */}
              <button
                onClick={() => setSelectedPane({ type: "AI" })}
                className={`w-[773px] h-28 left-[253px] top-[343px] absolute rounded-[20px] cursor-pointer
                                ${
                                  selectedPane?.type === "AI"
                                    ? "bg-pink-900"
                                    : "bg-rose-950"
                                }
                                hover:border-2 hover:border-pink-700`}
              >
                <p className="p-3 text-[50px] font-Inria_Sans">{aiSentiment}</p>
              </button>

              {/* predefined sentiment option 1 */}
              <button
                onClick={() =>
                  setSelectedPane({
                    type: "predefined",
                    value: shuffledOptions[0],
                  })
                }
                className={`w-44 h-16 left-[253px] p-1 top-[480px] absolute rounded-[20px] cursor-pointer
                                ${
                                  selectedPane?.type === "predefined" &&
                                  selectedPane.value === shuffledOptions[0]
                                    ? "bg-pink-900"
                                    : "bg-rose-950"
                                }
                                hover:border hover:border-pink-700`}
              >
                <p className="p-2 text-[25px] font-Inria_Sans">
                  {shuffledOptions[0]}
                </p>
              </button>

              {/* predefined sentiment option 2 */}
              <button
                onClick={() =>
                  setSelectedPane({
                    type: "predefined",
                    value: shuffledOptions[1],
                  })
                }
                className={`w-44 h-16 left-[651px] p-1 top-[480px] absolute rounded-[20px] cursor-pointer
                            ${
                              selectedPane?.type === "predefined" &&
                              selectedPane.value === shuffledOptions[1]
                                ? "bg-pink-900"
                                : "bg-rose-950"
                            }
                            hover:border hover:border-pink-700`}
              >
                <p className="p-2 text-[25px] font-Inria_Sans">
                  {shuffledOptions[1]}
                </p>
              </button>

              {/* predefined sentiment option 3 */}
              <button
                onClick={() =>
                  setSelectedPane({
                    type: "predefined",
                    value: shuffledOptions[2],
                  })
                }
                className={`w-44 h-16 left-[851px] p-1 top-[480px] absolute rounded-[20px] cursor-pointer
                            ${
                              selectedPane?.type === "predefined" &&
                              selectedPane.value === shuffledOptions[2]
                                ? "bg-pink-900"
                                : "bg-rose-950"
                            }
                            hover:border hover:border-pink-700`}
              >
                <p className="p-2 text-[25px] font-Inria_Sans">
                  {shuffledOptions[2]}
                </p>
              </button>

              {/* predefined sentiment option 4 */}
              <button
                onClick={() =>
                  setSelectedPane({
                    type: "predefined",
                    value: shuffledOptions[3],
                  })
                }
                className={`w-44 h-16 left-[452px] p-1 top-[480px] absolute rounded-[20px] cursor-pointer
                            ${
                              selectedPane?.type === "predefined" &&
                              selectedPane.value === shuffledOptions[3]
                                ? "bg-pink-900"
                                : "bg-rose-950"
                            }
                                hover:border hover:border-pink-700`}
              >
                <p className="p-2 text-[25px] font-Inria_Sans">
                  {shuffledOptions[3]}
                </p>
              </button>

              <div className="left-[249px] top-[222px] absolute justify-center text-white text-4xl font-normal font-['Inria_Sans']">
                Set the Mood
              </div>

              {/* user clicks to add custom sentiment */}
              {processedSentiment ? (
                //button for processed input already present
                <div
                  className="left-[563px] top-[670px] absolute text-center justify-center text-white text-2xl font-normal font-['Inria_Sans'] cursor-pointer
                                    hover:scale-105 transform transition-transform duration-150"
                  onClick={() => setEnterCustom(true)}
                >
                  + Add your own
                </div>
              ) : (
                //no button for processed input present (first time user is entering input)
                <div
                  className="left-[558px] top-[573px] absolute text-center justify-center text-white text-2xl font-normal font-['Inria_Sans'] cursor-pointer
                                    hover:scale-105 transform transition-transform duration-150"
                  onClick={() => setEnterCustom(true)}
                >
                  + Add your own
                </div>
              )}

              <div className="w-48 h-11 left-[836px] top-[668px] absolute bg-red-400 rounded-[20px]" />
              <div className="w-48 h-11 left-[836px] top-[668px] absolute text-center justify-center text-white text-2xl font-normal font-['Inria_Sans']">
                Next
              </div>
            </div>
          )}

          {/* user is entering custom input */}
          {enterCustom ? (
            <div>
              <div
                onClick={() => setSelectedPane({ type: "custom" })}
                className="w-[773px] h-28 left-[253px] top-[343px] absolute bg-rose-950 rounded-[20px]"
                style={{
                  borderRadius: "8px",
                  cursor: "text",
                  position: "absolute",
                }}
              >
                {/* user input text box */}
                <textarea
                  value={customSentiment}
                  onChange={(e) => setCustomSentiment(e.target.value)}
                  placeholder="Type your sentiment here..."
                  className="font-Inria_Sans"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    padding: "1rem",
                    fontSize: "50px",
                    resize: "none",
                  }}
                />
              </div>
              {/* process button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  processCustomSentiment();
                }}
                className={`w-48 h-11 left-[836px] top-[506px] absolute rounded-[20px]
                                    ${
                                      !customSentiment
                                        ? "bg-gray-400"
                                        : "bg-red-400"
                                    }
                                    hover:border-2`}
                disabled={!customSentiment}
              >
                <p className="text-[25px] font-Inria_Sans">
                  {isProcessing ? "Processing..." : "Process"}{" "}
                  {/*show "processing" while input is processing */}
                </p>
              </button>

              {/* back button */}
              <button
                onClick={() => setEnterCustom(false)}
                className="w-24 h-11 left-[255px] top-[506px] absolute bg-red-400 rounded-[20px] hover:border-2"
              >
                <p style={{ padding: "0rem", fontSize: "25px" }}>🡰</p>
              </button>
            </div>
          ) : (
            //not on custom input screen
            //next button
            <button
              onClick={handleProceed}
              disabled={
                getFinalSentiment() === "Unknown" || getFinalSentiment() === ""
              }
              style={{
                backgroundColor:
                  getFinalSentiment() === "Unknown" ||
                  getFinalSentiment() === ""
                    ? "gray"
                    : undefined,
                cursor:
                  getFinalSentiment() === "Unknown" ? "not-allowed" : "pointer",
              }}
              className="w-48 h-11 left-[836px] top-[668px] absolute bg-red-400 rounded-[20px]
                                flex items-center justify-center hover:border-2"
            >
              <p className="text-[25px] font-Inria_Sans m-0">Next</p>
            </button>
          )}

          {/* user has processed custom input */}
          {processedSentiment && !enterCustom && (
            //button for user's processed sentiment
            <button
              onClick={() =>
                setSelectedPane({ type: "custom", value: processedSentiment })
              }
              className={`w-44 h-16 left-[558px] top-[560px] absolute rounded-[20px] cursor-pointer
                            ${
                              selectedPane?.type === "custom" &&
                              selectedPane.value === processedSentiment
                                ? "bg-pink-900"
                                : "bg-rose-950"
                            }
                                hover:border hover:border-pink-700`}
            >
              <p className="p-3 text-[25px] font-Inria_Sans">
                {processedSentiment}
              </p>
            </button>
          )}
          <div className="w-[1280px] h-0 left-0 top-[132px] absolute outline outline-1 outline-offset-[-0.50px] outline-white outline-opacity-40"></div>
        </div>
      </div>
    </div>
  );
};

export default Sentiment;

/*"npm run dev" + http://localhost:3000/sentiment */
