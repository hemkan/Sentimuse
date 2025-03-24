import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const Poem = () => {
  const [poemLines, setPoemLines] = useState([]);
  // const [input, setInput] = useState("");
  // const [editId, setEditId] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    // Code we want to run
    // console.log(poemLines)
    // Optional return
  }, [poemLines]); // The dependency array, or what it should listen or react to
  
  
  // Function to regenerate a poem line based on given index
  const regenerateLine = async (index) => {
    try {
      const prompt = `Rhyme this verse "${poemLines[index]}" of the following poem:\n${poemLines.join("\n")}`;
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
        console.log(data);
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
    //console.log(newLine);

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
  const generatePoem = async (e) => {
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
        router.push("./poemEditorPage");
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


  // Function to save poem to local storage
  const saveData = (key, data) => {
    localStorage[key] =  JSON.stringify(data);
  }

  
  // Function to display the poem
  const displayPoem = async (data) => {
    const poem = data.response.split("\n").filter(line => line.trim() !== "").map(line => line.trim());
    setPoemLines(poem);
    saveData(100, poem);
  };

  return (
    <div className="bg-black">
      {/* Nav bar */}
      <nav className="w-full justify-between top-0 left-0 p-5 pl-20 border border-1 border-transparent border-b-white/50">
        <header className="text-xl">Sentimuse</header>
      </nav>
      {/* Main body */}
      <main className="place-items-center pb-[100px] pt-[100px]">
        <div>
          {/* Title */}
          <h2 className="text-5xl pb-[35px] font-light">Create Your Poem</h2>
          {/* Main buttons */}
          <div className="flex items-center justify-between gap-[40px] mb-[50px]">
            <button
            onClick={generatePoem}
            className="rounded-[20px] p-[40px] w-[375px] h-[375px] bg-[#3A141E] hover:bg-[#351E29] transition delay-100 ease-in-out">
              <h3 className="text-4xl font-semibold mb-3">Create with AI</h3>
              <p>Let AI generate a poem for you</p>
            </button>
            <button 
            className="rounded-[20px] p-[40px] w-[375px] h-[375px] bg-[#3A141E] hover:bg-[#351E29] transition delay-100 ease-in-out">
              <h3 className="text-4xl font-semibold mb-3">Create your Own</h3>
              <p>Write your poem with full creative control</p>
            </button>
          </div>
        </div>
      </main>
    </div>

  );

  
  
  // return (
  //   <div>
  //     <button onClick={generatePoem}>Click me!</button>
  //     <ul>
  //       {poemLines.map((line, index) => (
  //         <li>
  //           <DropdownMenu>
  //               {index + 1}. {editId === index ? (
  //                 <input
  //                 type="text"
  //                 value={input}
  //                 onChange={handleChange}
  //                 onKeyDown={handleKeyDown}
  //                 style={{ padding: "5px", fontSize: "16px", color: "red", width: "400px" }}
  //                 autoFocus
  //                 />
  //               ) : (
  //               <>
  //                 <DropdownMenuTrigger key={index}>
  //                 {line}
  //                 </DropdownMenuTrigger>
  //               </>)}
                
  //             <DropdownMenuContent>
  //               <DropdownMenuItem onClick={() => regenerateLine(index)}>Regenerate Line</DropdownMenuItem>
  //               <DropdownMenuItem onClick={() => editLine(index)}>Edit Line</DropdownMenuItem>
  //               <DropdownMenuItem onClick={() => removeLine(index)} className="text-red-700">Remove Verse</DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
}

export default Poem;