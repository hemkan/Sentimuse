import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const Poem = () => {
  const [poemLines, setPoemLines] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    // Code we want to run
    //generatePoem;
    console.log(poemLines)
    // Optional return
  }, [poemLines]); // The dependency array, or what it should listen or react to
    
  
  // Function to regenerate a poem line based on given index
  const regenerateLine = async (index) => {
    try {
      const prompt = `Regenerate this line: ${poemLines[index]} using the following poem as context:\n${poemLines.join("\n")}`;
      console.log(prompt);

      const response = await fetch ("../api/poemAPI", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({message: prompt}),
      });

      if (response.ok) {
        const data = await response.json();
        changeLine(index, data);
      }

      else {
        throw new Error("Could not fetch resource!");
      }
    } catch (error) {
      console.log(error);
    }

  };

// Function to change poem line on client side
  const changeLine = async (newIndex, data) => {
    const newLine = data.response;
    console.log(newLine);

    const newPoem = poemLines.map((line, index) => 
      index === newIndex ? newLine : line);
    
    setPoemLines(newPoem);
  };


  //Function to pick a random topic i.e., an entry from the Marriam-Webster dictionary
  async function pickTopic() {
    try {
      const response = await fetch('/Marriam-Webster Dictionary.txt');

      if (response.ok) {
        const topicList = (await response.text()).split("\n");
        const extractedTopics = topicList.map(topic => topic.replace(/^\d+\.\s*/, ''));

        const randomNum = Math.floor(Math.random() * extractedTopics.length);
        let topic = extractedTopics[randomNum];
        console.log(topic);
        return topic;
      }
    }
    catch (error) {
      console.log("Something wrong fetching the dictionary:", error);
    }
  };


  // Function to generate the first poem
  const generatePoem = async () => {
    try {
      const prompt = (await pickTopic()).toString();
      const response = await fetch ("../api/poemAPI", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({message: prompt}),
      });

      if (response.ok) {
        const data = await response.json();
        displayPoem(data);
      }

      else {
        throw new Error("Could not fetch resource!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to set the index of the editing line and its preview input
  const editLine = (index) => {
    setEditId(index);
    setInput(poemLines[index]);
  };

  // Function to set the changes the user makes to a line
  const handleChange = (e) => {
    setInput(e.target.value);
  };
  
  // Function to listen for the "Enter" key and set the new poem
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const newPoem = poemLines.map((line, index) =>
        index === editId ? input : line);

      setPoemLines(newPoem);
      setEditId(null);
    }
  };

  // Function to remove a line from a poem
  const removeLine = (deleteId) => {
    const newPoem = poemLines.filter((line, index) => index !== deleteId);

    setPoemLines(newPoem);
  };

  
  // Function to display the poem
  const displayPoem = async (data) => {
        const poem = data.response.split("\n").filter(line => line.trim() !== "").map(line => line.trim());
        setPoemLines(poem);
        return poem;
  };


  return (
    <div>
      <button onClick={generatePoem}>Click me!</button>
      <ul>
        {poemLines.map((line, index) => (
          <li>
            <DropdownMenu>
                {index + 1}. {editId === index ? (
                  <input
                  type="text"
                  value={input}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  style={{ padding: "5px", fontSize: "16px", color: "red", width: "400px" }}
                  autoFocus
                  />
                ) : (
                <>
                  <DropdownMenuTrigger key={index}>
                  {line}
                  </DropdownMenuTrigger>
                </>)}
                
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => regenerateLine(index)}>Regenerate Line</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editLine(index)}>Edit Line</DropdownMenuItem>
                <DropdownMenuItem onClick={() => removeLine(index)} className="text-red-700">Remove Verse</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Poem;
