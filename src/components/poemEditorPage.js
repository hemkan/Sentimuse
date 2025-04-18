import { motion, AnimatePresence } from "framer-motion"; // Animation module
import { Tooltip } from "react-tooltip"; // Tooltip module
import { useContext, useState, useRef, useEffect } from "react";
import { UserPoemContext } from "../pages/poem";
import { Button } from "@/components/ui/button"; // Button module
import { IoIosAdd } from "react-icons/io"; // Add symbol
import { MdOutlineReplay, MdAutoDelete } from "react-icons/md"; // Replay & delete symbols
import { PiFilePlus } from "react-icons/pi"; // Add file symbol
import { PuffLoader } from "react-spinners"; // Loading Screen Spinner
import { useRouter } from "next/router";
import { usePoemContext } from "@/context/poemContext";

const EditorPage = ({
  setPageTitle,
  setButtonVisible,
  setEditorPage,
  setPoemLines,
}) => {
  const [userPoem, setUserPoem] = useState([]); // User poem variable
  const [editID, setEditID] = useState(null); // ID of edit line
  const [addID, setAddID] = useState(null); // ID of add line
  const [showButtons, setShowButtons] = useState(null); // Display buttons
  const [isGeneratedPoem, setisGeneratedPoem] = useState(true); // Determines if user poem is generated
  const [loading, setLoading] = useState(false); // Set loading screen
  const [userEdit, setUserEdit] = useState(false); // Determines if user wants to edit poem by self

  const inputRef = useRef(null); // Track input in text fields

  const router = useRouter(); // Used to route to next page

  const { poem, option } = useContext(UserPoemContext);
  const { setPoem } = usePoemContext();

  useEffect(() => {
    if (option !== 1) {
      // User chose to create their own poem
      setUserEdit(true);
    } else if (option === 1 && poem.length === 0) {
      // The poem is not generated yet
      setLoading(true);
    } else {
      setLoading(false);
      setUserEdit(false);

      // set each line of generated poem with a delay in between
      poem.forEach((line, i) => {
        setTimeout(() => {
          setUserPoem((prev) => [...prev, line]);
        }, i * 300);
      });
    }

    console.log(setPoem);
  }, [poem]);

  // Function to handle adding a new line at the end of the poem
  const handleAdd = (e) => {
    if (e.key === "Enter" && inputRef.current.value.trim() !== "") {
      setisGeneratedPoem(true);
      e.preventDefault();

      const newLine = inputRef.current.value.trim();
      const newPoem = [...userPoem];

      newPoem.push(newLine);
      setisGeneratedPoem(true);
      setUserPoem(newPoem);
      inputRef.current.value = "";
      e.target.value = "";
    }
  };

  // Function to determine saving when user presses Enter or clicks outside of text field
  const handleSave = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      e.preventDefault();

      let newLine = e.target.value?.trim() || "";

      if (newLine.length === 0) return;

      const newPoem = userPoem.map((line, index) =>
        index === editID ? newLine : line
      );
      setUserPoem(newPoem);
      setEditID(null);
      e.target.value = "";
    }
  };

  // Function to set the ID of either the edit line or add line at specific index
  const handleEdit = (index, option) => {
    if (option === 1) {
      setEditID(index);
    } else {
      setisGeneratedPoem(false);
      setAddID(index);
    }
  };

  // Function to handle adding a new line at a specific index
  const addLineBelow = (e, idToInsert) => {
    if (e.key === "Enter") {
      e.preventDefault();

      let newLine = e.target.value?.trim() || "";

      if (newLine.length === 0) return;

      const newPoem = [...userPoem];
      newPoem.splice(idToInsert, 0, newLine);
      setisGeneratedPoem(false);
      setUserPoem(newPoem);

      setAddID(null);
      e.target.value = "";
    }
  };

  // Function to regenerate line, based on the poem as context
  const regenerateLine = async (index) => {
    try {
      const prompt = `Rhyme this verse "${
        userPoem[index]
      }" of the following poem:\n${userPoem.join("\n")}`;

      const response = await fetch("../api/poemAPI", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        changeLine(index, data);
      } else {
        throw new Error("Could not fetch resource!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to change the line based on the index
  function changeLine(newIndex, data) {
    const newLine = data.response;

    const newPoem = userPoem.map((line, index) =>
      index === newIndex ? newLine : line
    );

    setUserPoem(newPoem);
  }

  // Function
  const generatePoemBasedOnLine = async (index) => {
    try {
      const prompt = `Create a full poem, using the verse below as the starting verse and for context: \n ${
        userPoem[index]
      } \n LAST WORD: "${userPoem[index].split(" ").pop()}"`;

      const response = await fetch("../api/poemAPI", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        displayPoem(data);
      } else {
        throw new Error("Could not fetch resource!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to set the poem
  const displayPoem = async (data) => {
    const poem = data.response
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => line.trim());
    setisGeneratedPoem(true);
    setUserPoem(poem);
  };

  // Function to remove a line based on its index
  const removeLine = (deleteId) => {
    setUserPoem((newPoem) =>
      newPoem.filter((line, index) => index !== deleteId)
    );
  };

  // Animation variables
  const animationList = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  // Function to handle passing the poem to the next page (Sentiment)
  const submitPoem = async () => {
    const tmpPoem = userPoem.join("\n");
    setPoem(tmpPoem);
    router.push("/sentiment");
  };

  return (
    <div className="relative">
      <form className="scrollbar relative pb-[40px] mb-[50px] p-[40px] w-[850px] h-[700px] rounded-[20px] bg-[#3A141E] overflow-auto overflow-x-hidden">
        {/* Display the loading screen when poem not generated yet */}
        {loading && <PuffLoader color="white" loading={true} size={100} />}

        {userPoem.length !== 0 && (
          <ul className="flex flex-col gap-2">
            {/* Animation tag, used to enable animation for its children tags */}
            <AnimatePresence>
              {userPoem.map((line, index) => (
                <motion.li
                  key={index}
                  variants={animationList} // Use attributes from the animationList function
                  initial={isGeneratedPoem ? "hidden" : "visible"} // Before animation
                  animate="visible" // After animation
                  transition={{ duration: 0.3 }} //
                  exit="hidden" // Animation when the tag is removed
                  // Display the edit buttons when hover mouse over the line, otherwhise hide
                  onMouseEnter={() => setShowButtons(index)}
                  onMouseLeave={() => setShowButtons(null)}
                  className="flex justify-between gap-2 items-start"
                >
                  <div
                    onClick={() => handleEdit(index, 1)}
                    className="flex flex-col cursor-pointer w-full"
                  >
                    {/* Display the text field to edit the line at specified index */}
                    {editID === index ? (
                      <input
                        type="text"
                        defaultValue={line}
                        onKeyDown={(e) => handleSave(e)}
                        onBlur={(e) => handleSave(e)}
                        className="pl-[6px] h-[32px] w-full flex-grow text-[20px] bg-black/25 text-white font-montserrat"
                        autoFocus
                      />
                    ) : (
                      <p className="pl-[5px] h-full max-w-[100%] flex-grow rounded-md text-[20px] overflow-x-hidden text-clip border border-transparent hover:border-white/25 hover:bg-black/25 font-montserrat">
                        {line}
                      </p>
                    )}

                    {/* Display the text field to add a new line at specified index */}
                    {index + 1 === addID && (
                      <motion.input
                        type="text"
                        variants={animationList}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3 }}
                        exit="hidden"
                        placeholder="Type a line here..."
                        className="pl-[6px] mt-[10px] mb-auto text-[20px] bg-transparent text-white w-full font-montserrat"
                        onKeyDown={(e) => addLineBelow(e, addID)}
                        onBlur={() => setAddID(null)}
                        autoFocus
                      />
                    )}
                  </div>

                  {/* Edit buttons section */}

                  {index === showButtons && (
                    <div className="flex justify-between gap-2">
                      {/* Add line below button */}
                      <Button
                        type="button"
                        data-tooltip-id="add-line"
                        data-tooltip-content="Add line below"
                        onClick={() => handleEdit(index + 1, 2)}
                        className="bg-white/25 w-[30px] h-[30px]"
                      >
                        <IoIosAdd />
                        <Tooltip id="add-line" />
                      </Button>

                      {/* Regenerate line button */}
                      <Button
                        type="button"
                        data-tooltip-id="regen-line"
                        data-tooltip-content="Regenerate line"
                        onClick={() => regenerateLine(index)}
                        className="bg-white/25 w-[30px] h-[30px]"
                      >
                        <MdOutlineReplay />
                        <Tooltip id="regen-line" />
                      </Button>

                      {/* Generate poem based on line Button */}
                      <Button
                        type="button"
                        data-tooltip-id="gen-poem-line"
                        data-tooltip-content="Regenerate poem"
                        onClick={() => generatePoemBasedOnLine(index)}
                        className="bg-white/25 w-[30px] h-[30px]"
                      >
                        <PiFilePlus />
                        <Tooltip id="gen-poem-line" />
                      </Button>

                      {/* Delete line button */}
                      <Button
                        type="button"
                        data-tooltip-id="remove-line"
                        data-tooltip-content="Remove line"
                        onClick={() => removeLine(index)}
                        className="bg-white/25 w-[30px] h-[30px]"
                      >
                        <MdAutoDelete style={{ color: "#EC5A72" }} />
                        <Tooltip id="remove-line" />
                      </Button>
                    </div>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>

            {/* Display the text field to add a new line at the end of poem */}
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 100 }}
              transition={{
                delay: isGeneratedPoem ? poem.length * 0.3 : 0.3,
                duration: 0.5,
              }}
              className="cursor-pointer border border-transparent"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Add a line and press Enter..."
                onKeyDown={(e) => handleAdd(e)}
                className="pl-[5px] w-full h-[50px] rounded-md bg-black/25 border border-transparent text-[20px] text-white delay-75 duration-100 ease-in-out hover:border-white/25 font-montserrat"
              />
            </motion.li>
          </ul>
        )}

        {/* In case that user wishes to create their own poem, display this text field instead */}
        {userEdit && userPoem.length === 0 && (
          <ul className="flex flex-col gap-1">
            <li className="cursor-pointer">
              <input
                ref={inputRef}
                type="text"
                placeholder="Write your line and press Enter..."
                onKeyDown={(e) => handleAdd(e)}
                className="pl-[5px] text-[20px] bg-transparent text-white w-full font-montserrat"
                autoFocus
              />
            </li>
          </ul>
        )}
      </form>

      {/* Navigation buttons container */}
      <div className="flex justify-between mt-4">
        {/* Back button */}
        <Button
          onClick={() => {
            setPageTitle("Create your Poem");
            setButtonVisible(true);
            setEditorPage(false);
            setPoemLines([]);
          }}
          className="w-[190px] h-[45px] bg-[#ec5a72] rounded-[20px] font-['Inria_Sans'] font-normal text-white text-2xl text-center hover:bg-[#ec5a72] hover:ring-2 hover:ring-[#B3445A] transition-all duration-200"
        >
          Back
        </Button>

        {/* Next button */}
        <Button
          onClick={submitPoem}
          className="w-[190px] h-[45px] bg-[#ec5a72] rounded-[20px] font-['Inria_Sans'] font-normal text-white text-2xl text-center hover:bg-[#ec5a72] hover:ring-2 hover:ring-[#B3445A] transition-all duration-200"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EditorPage;
