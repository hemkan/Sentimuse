import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useContext, useState, useRef } from "react";
import { PoemContext } from "./poem";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"  
import { Button } from "@/components/ui/button";
import { IoIosAdd } from "react-icons/io";
import { MdAdd, MdOutlineReplay, MdAutoDelete } from "react-icons/md";
import { PiFilePlus } from "react-icons/pi";

const EditorPage = () => {

    const [userPoem, setUserPoem] = useState([]);
    const [editID, setEditID] = useState(null);
    // const [addID, setAddID] = useState(null);
    const inputRef = useRef(null);
    const editInputRef = useRef(null);

    
    const poem = useContext(PoemContext);

    const handleAdd = (e) => {
        if (e.key === "Enter" && inputRef.current.value.trim() !== "") {
            e.preventDefault();

            const newLine = inputRef.current.value?.trim() || "";
            const newPoem = [...userPoem];

            newPoem.push(newLine);
            setUserPoem(newPoem);   
            inputRef.current.vallue = "";
            e.target.value = "";
            // console.log(newPoem);
        }
    };


    const handleSave = (e) => {
            const newLine = e.target.value?.trim() || "";
            // console.log(newLine);

            if (newLine.length === 0) {
                return;
            }

            const newPoem = userPoem.map((line, index) => index === editID ? newLine : line);
            setUserPoem(newPoem);
            setEditID(null);
            // console.log(newPoem);
    };

    const handleEdit = (index, option) => {
        if (option === 1) { 
            setEditID(index);
        }
        else {
            setAddID(index);
        }
    };


    const addLineBelow = (index) => {

    };





    const regenerateLine = (index) => {

    };




    const generatePoemBasedOnLine = (index) => {

    };





    const removeLine = (index) => {

    };





      useEffect(() => {
        setUserPoem(poem);
      }, [poem]);


      
    return (
        <div>
            <form className="relative pb-[40px] mb-[50px] p-[20px] w-[700px] h-[700px] rounded-[20px] bg-[#3A141E] overflow-auto">
                {/* <EditorContent editor={editor}/> */}

                {userPoem.length !== 0 && (
                    <ol className="list-decimal flex flex-col gap-1 pl-7">
                        {userPoem.map((line, index) => (
                            <li key={index}
                                onClick={() => handleEdit(index, 1)}
                                className="cursor-pointer">
                                    <div className="flex justify-between gap-2">
                                        {editID === index ? (
                                            <input
                                                ref={editInputRef}
                                                type="text" 
                                                defaultValue={line}
                                                onKeyDown={(e) => e.key === "Enter" && handleSave(e)}
                                                onBlur={(e) => e.type === "blur" && handleSave(e)}
                                                className="pl-[10px] bg-transparent text-white border border-white flex-grow"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="pl-[10px] ml-0 m-auto w-full hover:bg-black/25">{line}</span>
                                        )}


                                        {/* Edit buttons section */}
                                        <div className="flex justify-between gap-2">

                                            {/* Add line below button */}
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    console.log("hello")
                                                }} 
                                                className="bg-white/25 w-[30px] h-[30px]"><MdAdd/></Button>

                                            {/* Regenerate line button */}
                                            <Button 
                                                // onClick={() => regenerateLine(index)}
                                                className="bg-white/25 w-[30px] h-[30px]"><MdOutlineReplay/></Button>

                                            {/* Generate poem based on line button */}
                                            <Button 
                                                // onClick={() => generatePoemBasedOnLine(index)}
                                                className="bg-white/25 w-[30px] h-[30px]"><PiFilePlus/></Button>

                                            {/* Remove line button */}
                                            <Button 
                                                // onClick={() => removeLine(index)}
                                                className="bg-white/25 w-[30px] h-[30px]"><MdAutoDelete style={{color: "#C52233"}}/></Button>
                                        </div>
                                    </div>
                            </li>
                        ))}

                        <li className="cursor-pointer border border-transparent">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Add a line & press Enter..."
                                onKeyDown={handleAdd}
                                className="pl-[10px] bg-transparent text-white w-full"
                                autoFocus
                            />
                        </li>
                    </ol>
                )}

                { userPoem.length === 0 && (
                    <ol className="list-decimal flex flex-col gap-1 pl-7">
                        <li className="cursor-pointer">
                            <input 
                                ref={inputRef}
                                type="text"
                                placeholder="Write your line and press Enter..."
                                onKeyDown={handleAdd}
                                className=" pl-[10px] bg-transparent text-white w-full"
                                autoFocus
                            />
                        </li>
                    </ol>
                )}

            </form>
        </div>  
    );

};

export default EditorPage;