import { useState } from "react";
import UserSentimentMenu from "../components/userSentimentMenu";
import { LuPencil } from "react-icons/lu";

const Sentiment = () => {
  //declare state variables
  const [poem, setPoem] = useState(""); //holds/sets poem
  const [sentiment, setSentiment] = useState(""); //holds/sets AI sentiment
  const [userSentiment, setUserSentiment] = useState(""); //user-confirmed sentiment
  const [hasConfirmed, setHasConfirmed] = useState(false); //tracks user's confirmation for final sentiment
  const [selectedPane, setSelectedPane] = useState(null);
  const [enterCustom, setEnterCustom] = useState(false);
  const [customSentiment, setCustomSentiment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  //calls sentiment analysis api
  const analyzeSentiment = async () => {
    try {
      const response = await fetch("/api/sentimentAnalysisAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poem: poem }), //send JSON poem
      });

      const data = await response.json(); //parse response as JSON
      setSentiment(data.sentiment); //update sentiment
      setUserSentiment(data.sentiment); //default user sentiment to the analyzed sentiment
      setHasConfirmed(false); //reset for new analysis
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      setSentiment("Error analyzing sentiment");
    }
  };

  const handleProceed = () => {
    // Implementation of handleProceed function
  };

  const getFinalSentiment = () => {
    // Implementation of getFinalSentiment function
    return "Unknown";
  };

  const processCustomSentiment = () => {
    // Implementation of processCustomSentiment function
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      // Process the custom sentiment
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#191113] text-white font-['Inria_Sans'] flex flex-col">
      {/* Navbar */}
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
            {!enterCustom ? (
              <div className="space-y-8">
                <h2 className="text-4xl mb-[3rem] font-['Inria_Sans']">
                  Set the Mood
                </h2>

                {/* AI-detected sentiment */}
                <button
                  onClick={() => setSelectedPane({ type: "AI" })}
                  className={`w-full h-28 rounded-[20px] cursor-pointer transition-all duration-200
                    ${
                      selectedPane?.type === "AI"
                        ? "bg-pink-900"
                        : "bg-rose-950"
                    }
                    hover:ring-2 hover:ring-pink-700`}
                >
                  <p className="p-3 text-[25px] font-['Inria_Sans']">
                    {sentiment}
                  </p>
                </button>

                {/* Predefined sentiment options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Add predefined sentiment options here */}
                </div>

                {/* Processed custom sentiment display */}
                {/* Add processed sentiment display logic here */}

                {/* Add your own button - only show if no processed sentiment */}
                {!sentiment && (
                  <div
                    className="text-center text-2xl cursor-pointer hover:scale-105 transform transition-transform duration-150 font-['Inria_Sans']"
                    onClick={() => setEnterCustom(true)}
                  >
                    + Add your own
                  </div>
                )}

                {/* Next button */}
                <div className="flex justify-end" style={{ marginTop: "3rem" }}>
                  <button
                    onClick={handleProceed}
                    disabled={
                      getFinalSentiment() === "Unknown" ||
                      getFinalSentiment() === ""
                    }
                    className={`w-48 h-11 rounded-[20px] flex items-center justify-center
                      ${
                        getFinalSentiment() === "Unknown" ||
                        getFinalSentiment() === ""
                          ? "bg-gray-400"
                          : "bg-red-400"
                      }
                      hover:ring-2 hover:ring-pink-700 transition-all duration-200`}
                  >
                    <p className="text-2xl font-['Inria_Sans']">Next</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className="text-4xl text-center mb-15 font-['Inria_Sans']">
                  Enter Your Sentiment
                </h2>

                {/* Custom input textarea */}
                <div
                  onClick={() => setSelectedPane({ type: "custom" })}
                  className="w-full h-28 bg-rose-950 rounded-[20px] cursor-text"
                >
                  <input
                    value={customSentiment}
                    onChange={(e) => setCustomSentiment(e.target.value)}
                    placeholder="Type your sentiment here..."
                    className="w-full h-full bg-transparent border-none outline-none text-white p-4 px-7 text-[40px] resize-none font-['Inria_Sans']"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setEnterCustom(false)}
                    className="w-24 h-11 bg-red-400 rounded-[20px] hover:ring-2 hover:ring-pink-700 flex items-center justify-center"
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
                      ${!customSentiment ? "bg-gray-400" : "bg-red-400"}
                      hover:ring-2 hover:ring-pink-700 transition-all duration-200`}
                  >
                    <p className="text-2xl font-['Inria_Sans']">
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

{
  /*test with http://localhost:3000/sentiment after "npm run dev"*/
}
