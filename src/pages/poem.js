import { useState } from "react";
import EditorPage from "../components/poemEditorPage";
import { createContext } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import MainHeader from "../components/Header";

export const UserPoemContext = createContext();

const Poem = () => {
  const [poemLines, setPoemLines] = useState([]); // Poem variable, as an array of strings
  const [pageTitle, setPageTitle] = useState("Create your Poem"); // Display page title
  const [buttonVisible, setButtonVisible] = useState(true); // Display the option buttons
  const [editorPage, setEditorPage] = useState(false); // Display the Editor Page
  const [userOption, setUserOption] = useState(null); // Store user's selected option

  //Function to pick a random topic i.e., an entry from the Marriam-Webster dictionary
  async function pickTopic() {
    try {
      const response = await fetch("/Marriam-Webster Dictionary.txt");

      if (response.ok) {
        const topicList = (await response.text()).split("\n");
        const extractedTopics = topicList.map((topic) =>
          topic.replace(/^\d+\.\s*/, "")
        ); // Remove unnecessary characters from each entry

        const randomNum = Math.floor(Math.random() * extractedTopics.length); // Pick a random number, from 0 up to length of dictionary
        let topic = extractedTopics[randomNum];
        console.log(topic);
        return topic;
      }
    } catch (error) {
      // Error Handling
      console.log("Something wrong fetching the dictionary:", error);
    }
  }

  // Function to generate the first poem
  const generatePoem = async () => {
    try {
      const prompt = (await pickTopic()).toString();
      const response = await fetch("../api/poemAPI", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }), // Send prompt to Poem API
      });

      if (response.ok) {
        const data = await response.json(); // Pass response as JSON object
        displayPoem(data);
      } else {
        throw new Error("Could not fetch resource!"); // Something wrong with API
      }
    } catch (error) {
      // Error Handling
      console.log(error); // Log error in console, OR Could be an ALERT POP UP?
    }
  };

  // Function to set the poem
  const displayPoem = async (data) => {
    const poem = data.response
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => line.trim());
    // Split JSON object into strings
    // Filter out empty strings
    // Map to new function
    setPoemLines(poem); // Set finished poem
  };

  // Animation variables
  const animationList = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="bg-[#191113] font-pageTitleFont">
      <MainHeader />

      {/* Main body */}
      <main className="place-items-center pb-[100px] pt-[100px]">
        <div>
          {/* Title */}
          <h2 className="text-5xl pb-[35px] font-light">{pageTitle}</h2>
          {/* Main buttons */}
          <div
            className={
              editorPage
                ? "flex flex-col"
                : "flex items-center justify-between gap-[40px] mb-[50px]"
            }
          >
            {/* Option Button 1 (Create with AI) */}
            {buttonVisible && (
              <button
                onClick={() => {
                  setUserOption(1);
                  generatePoem();
                  setPageTitle("Enhance your Poem");
                  setButtonVisible(false);
                  setEditorPage(true);
                }}
                className="rounded-[20px] p-[40px] w-[350px] h-[351px] bg-[#3A141E] border border-transparent hover:border-[#B3445A] transition delay-50 ease-in-out"
              >
                <h3 className="text-[40px] font-semibold mb-3">
                  Create with AI
                </h3>
                <p>Let AI generate a poem for you</p>
              </button>
            )}

            {/* Option Button 2 (Create your Own) */}
            {buttonVisible && (
              <button
                onClick={() => {
                  if (poemLines.length !== 0) {
                    // If user has set a poem, but wishes to generate another, empty the poem variable
                    setPoemLines([]);
                  }
                  setUserOption(2);
                  setPageTitle("Enhance your Poem");
                  setButtonVisible(false);
                  setEditorPage(true);
                }}
                className="rounded-[20px] p-[40px] w-[350px] h-[351px] bg-[#3A141E] border border-transparent hover:border-[#B3445A] transition delay-50 ease-in-out"
              >
                <h3 className="text-4xl font-semibold mb-3">Create your Own</h3>
                <p>Write your poem with full creative control</p>
              </button>
            )}

            {editorPage && (
              <UserPoemContext.Provider
                value={{ poem: poemLines, option: userOption }}
              >
                {/* Animation tag, used to enable animation for its children tags */}
                <AnimatePresence>
                  <motion.div
                    variants={animationList} // Use attributes from the animationList function
                    initial="hidden" // Before animation
                    animate="visible" // After animation
                    exit="hidden" // Animation for when the tag is removed
                    transition={{ duration: 0.3 }}
                  >
                    {/* Poem Editor Page */}
                    <EditorPage
                      setPageTitle={setPageTitle}
                      setButtonVisible={setButtonVisible}
                      setEditorPage={setEditorPage}
                      setPoemLines={setPoemLines}
                    />

                    {/* Back button removed and moved to EditorPage component */}
                  </motion.div>
                </AnimatePresence>
              </UserPoemContext.Provider>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Poem;
