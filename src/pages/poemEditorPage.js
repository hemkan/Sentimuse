import { useContext, useState, useRef, useEffect } from "react";
import { PoemContext } from "./poem";
import { Button } from "@/components/ui/button";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineReplay, MdAutoDelete } from "react-icons/md";
import { PiFilePlus } from "react-icons/pi";


const EditorPage = () => {
    
    
    const [userPoem, setUserPoem] = useState([]);
    const [editID, setEditID] = useState(null);
    const [addID, setAddID] = useState(null);
    const inputRef = useRef(null);
    
    const poem = useContext(PoemContext);


    useEffect(() => {
        console.log(userPoem);
        setUserPoem(poem);
    }, [poem]);




    const handleAdd = (e) => {
        if (e.key === "Enter" && inputRef.current.value.trim() !== null) {
            e.preventDefault();

            const newLine = inputRef.current.value.trim();
            const newPoem = [...userPoem];
            
            newPoem.push(newLine);
            setUserPoem(newPoem);
            inputRef.current.value = "";
            e.target.value = "";
        }
    };


    const handleSave = (e) => {
        if (e.key === "Enter" || e.type === "blur") {
            e.preventDefault();
  
            let newLine = e.target.value?.trim() || "";

            if (newLine.length === 0)
                return;
    
            const newPoem = userPoem.map((line, index) => index === editID ? newLine : line);
            setUserPoem(newPoem);
            setEditID(null);
            e.target.value = "";
        } 
    };

    const handleEdit = (index, option) => {
        if (option === 1) {
            setEditID(index);
        }
        else {
            setAddID(index);
        }
    };

    const addLineBelow = (e, idToInsert) => {
        if (e.key === "Enter") {
            e.preventDefault();

            let newLine = e.target.value?.trim() || "";

            if (newLine.length === 0)
                return;

            const newPoem = [...userPoem];
            newPoem.splice(idToInsert, 0, newLine);
            setUserPoem(newPoem);
            setAddID(null);
            e.target.value = "";
            // console.log(userPoem);
        }
    }


    const regenerateLine = async (index) => {
        try {
        const prompt = `Rhyme this verse "${userPoem[index]}" of the following poem:\n${userPoem.join("\n")}`;
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
            console.log(data, index);
            changeLine(index, data);
        }

        else {
            throw new Error("Could not fetch resource!");
        }
        } catch (error) {
        console.log(error);
        }

    };


    function changeLine(newIndex, data) {
        const newLine = data.response;
        console.log(newLine);

        const newPoem = poem.map((line, index) => 
        index === newIndex ? newLine : line);
        
        setUserPoem(newPoem);
        // console.log(userPoem);
    };


    const generatePoemBasedOnLine = (index) => {

    };





    const removeLine = (index) => {

    };


      
    return (
        <div>
            <form className="relative pb-[40px] mb-[50px] p-[40px] w-[700px] h-[700px] rounded-[20px] bg-[#3A141E] overflow-auto">
                {/* <EditorContent editor={editor}/> */}

                {userPoem.length !== 0 && (
                    <ul className="flex flex-col gap-2">
                        {userPoem.map((line, index) => (
                            <li key={index}
                                onClick={() => handleEdit(index, 1)}
                                className="cursor-pointer">
                                    <div className="flex justify-between gap-1 h-[30px]">
                                        {editID === index ? (
                                            <input
                                                type="text" 
                                                defaultValue={line}
                                                onKeyDown={(e) => handleSave(e)}
                                                onBlur={(e) => handleSave(e)}
                                                className="pl-[10px] bg-black/25 text-white flex-grow"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="inline-flex items-center pl-[10px] h-full w-full rounded-md hover:bg-black/25">{line}</span>
                                        )}


                                        {/* Edit buttons section */}
                                        <div className="flex justify-between gap-2">

                                            {/* Add line below button */}
                                            <Button 
                                                type="button"
                                                onClick={() => handleEdit(index + 1, 2)} 
                                                className="bg-white/25 w-[30px] h-[30px]">
                                                    <IoIosAdd/>
                                            </Button>

                                            {/* Regenerate line button */}
                                            <Button 
                                                type="button"
                                                onClick={() => regenerateLine(index)}
                                                className="bg-white/25 w-[30px] h-[30px]">
                                                    <MdOutlineReplay/>
                                            </Button>

                                            {/* Generate poem based on line Button */}
                                            <Button 
                                                type="button"
                                                className="bg-white/25 w-[30px] h-[30px]">
                                                    <PiFilePlus/>
                                            </Button>

                                            {/* Delete line button */}
                                            <Button 
                                                type="button"
                                                className="bg-white/25 w-[30px] h-[30px]">
                                                    <MdAutoDelete style={{color: "#C52233"}}/>
                                            </Button>
                                        </div>
                                    </div>

                                    {index + 1 === addID && (
                                        <input
                                            type="text"
                                            placeholder="Type something here or I'm giving up on you!"
                                            className="mt-2 pl-[10px] bg-transparent text-white w-full"
                                            onKeyDown={(e) => addLineBelow(e, addID)}
                                            onBlur={() => setAddID(null)}
                                            autoFocus
                                        />
                                    )}
                            </li>
                        ))}

                        <li className="cursor-pointer border border-transparent">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Add a line & press Enter..."
                                onKeyDown={(e) => handleAdd(e)}
                                className="pl-[10px] w-full h-[30px] rounded-md bg-transparent text-white hover:bg-black/25"
                                autoFocus
                            />
                        </li>
                    </ul>
                )}

                { userPoem.length === 0 && (
                    <ul className="flex flex-col gap-1">
                        <li className="cursor-pointer">
                            <input 
                                ref={inputRef}
                                type="text"
                                placeholder="Write your line and press Enter..."
                                onKeyDown={(e) => handleAdd(e)}
                                className="pl-[10px] bg-transparent text-white w-full"
                                autoFocus
                            />
                        </li>
                    </ul>
                )}

            </form>
        </div>  
    );

};

export default EditorPage;