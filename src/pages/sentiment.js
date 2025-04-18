import { useState, useEffect } from "react";
import { sentimentOptions } from "@/data/sentimentOptions";
import { useLocation } from "react-router-dom";
import { usePoemContext } from "@/context/poemContext";
import { useRouter } from "next/router";
import { LuPencil } from "react-icons/lu";

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
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedPane, setSelectedPane] = useState(null);
  const [enterCustom, setEnterCustom] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

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
    } finally {
      setIsAnalyzing(false);
    }
  };

  //analyzeSentiment() will be run after intial page render
  useEffect(() => {
    if (!poem) {
      router.push("/poem");
      console.log("No poem found");
      return;
    }

    analyzeSentiment();
  }, []); //empty dependency array [] = tells react to run this only after initial render

  // Shuffle options when aiSentiment changes
  useEffect(() => {
    if (!aiSentiment) return;

    const filteredOptions = sentimentOptions.filter(
      (option) => option !== aiSentiment
    );

    let arr = [...filteredOptions];
    let currentIndex = arr.length;

    while (currentIndex !== 0) {
      let rng = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[rng]] = [arr[rng], arr[currentIndex]];
    }

    setShuffledOptions(arr);
  }, [aiSentiment]);

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

  return (
    <div className="min-h-screen bg-[#191113] text-white font-['Inria_Sans'] flex flex-col">
      {/* Navbar */}
      {/* <div className="w-full bg-neutral-900 py-4 px-8">
        <h1 className="text-3xl font-bold">Sentimuse</h1>
      </div>
       */}
      <nav className="w-full h-24 bg-[#191113]">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="font-['Inria_Sans'] font-normal text-white text-[28px]">
            Sentimuse
          </div>
        </div>
        <div className="w-full h-px bg-[#FFFFFF40]" />
      </nav>

      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isAnalyzing || !aiSentiment ? (
              <div className="flex flex-col items-center justify-center h-[30%] w-full">
                <div className="loading-spinner mb-4"></div>
                <p className="text-white text-xl">Analyzing your poem...</p>
              </div>
            ) : !enterCustom ? (
              <div className="space-y-8">
                <h2 className="text-[40px] mb-[1rem]">Set the Mood</h2>

                {/* AI-detected sentiment */}
                <button
                  onClick={() => setSelectedPane({ type: "AI" })}
                  className={`w-full h-28 rounded-[20px] cursor-pointer transition-all duration-200
                    ${
                      selectedPane?.type === "AI"
                        ? "bg-[#883447]"
                        : "bg-[#3A141E]"
                    }
                    hover:ring-2 hover:ring-[#B3445A]`}
                >
                  <p className="p-3 text-[35px]">{aiSentiment}</p>
                </button>

                {/* Predefined sentiment options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {shuffledOptions.slice(0, 4).map((option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedPane({ type: "predefined", value: option })
                      }
                      className={`h-16 rounded-[20px] cursor-pointer transition-all duration-200
                        ${
                          selectedPane?.type === "predefined" &&
                          selectedPane.value === option
                            ? "bg-[#883447]"
                            : "bg-[#3A141E]"
                        }
                        hover:ring-2 hover:ring-[#B3445A]`}
                    >
                      <p className="p-2 text-[25px]">{option}</p>
                    </button>
                  ))}
                </div>

                {/* Processed custom sentiment display */}
                {processedSentiment && (
                  <button
                    onClick={() =>
                      setSelectedPane({
                        type: "custom",
                        value: processedSentiment,
                      })
                    }
                    className={`w-full py-3 rounded-[20px] cursor-pointer transition-all duration-200
                      ${
                        selectedPane?.type === "custom" &&
                        selectedPane.value === processedSentiment
                          ? "bg-[#883447]"
                          : "bg-[#3A141E]"
                      }
                      hover:ring-2 hover:ring-[#B3445A] flex items-center justify-center gap-2`}
                  >
                    <p className="text-[25px]">{processedSentiment}</p>
                    <LuPencil
                      className="text-xl hover:scale-110 transition-transform duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnterCustom(true);
                      }}
                    />
                  </button>
                )}

                {/* Add your own button - only show if no processed sentiment */}
                {!processedSentiment && (
                  <div
                    className="text-center text-2xl cursor-pointer hover:scale-105 transform transition-transform duration-150"
                    onClick={() => setEnterCustom(true)}
                  >
                    + Add your own
                  </div>
                )}

                {/* Next button */}
                <div className="flex justify-end" style={{ marginTop: "1rem" }}>
                  <button
                    onClick={handleProceed}
                    disabled={
                      getFinalSentiment() === "Unknown" ||
                      getFinalSentiment() === ""
                    }
                    // w-48 h-11 rounded-[20px] flex items-center justify-center
                    className={`w-[190px] h-[45px] bg-[#EC5A72] rounded-[20px] font-['Inria_Sans'] font-normal text-white text-2xl text-center                      
                      ${
                        getFinalSentiment() === "Unknown" ||
                        getFinalSentiment() === ""
                          ? "bg-gray-400"
                          : "bg-[#EC5A72]"
                      }
                      hover:ring-2 hover:ring-[#B3445A] transition-all duration-200`}
                  >
                    <p className="text-2xl">Next</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <h2 className="text-[40px] text-center">
                  Enter Your Sentiment
                </h2>

                {/* Custom input textarea */}
                <div
                  onClick={() => setSelectedPane({ type: "custom" })}
                  className="w-full h-28 bg-[#3A141E] rounded-[20px] cursor-text"
                >
                  <input
                    value={customSentiment}
                    onChange={(e) => setCustomSentiment(e.target.value)}
                    placeholder="Type your sentiment here..."
                    className="w-full h-full bg-transparent border-none outline-none text-white p-4 px-7 text-[40px] resize-none"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setEnterCustom(false)}
                    className="w-24 h-11 bg-[#EC5A72] rounded-[20px] hover:ring-2 hover:ring-[#B3445A] flex items-center justify-center"
                  >
                    <span className="text-2xl">🡰</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      processCustomSentiment();
                    }}
                    disabled={!customSentiment}
                    className={`w-48 h-11 rounded-[20px] flex items-center justify-center
                      ${!customSentiment ? "bg-gray-400" : "bg-[#EC5A72]"}
                      hover:ring-2 hover:ring-[#B3445A] transition-all duration-200`}
                  >
                    <p className="text-2xl">
                      {isProcessing ? "Processing..." : "Process"}
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sentiment;

/*"npm run dev" + http://localhost:3000/sentiment */
