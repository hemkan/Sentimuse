import { useEffect } from "react";

const EditorPage = () => {

    const readData = (key) => {
        if (localStorage[key]) {
            return JSON.parse(localStorage[key]);
        }
    }

    const poem = readData(100);


    useEffect(() => {
        console.log(poem);
    }, [poem]);



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
                    <h2 className="text-5xl pb-[35px] font-light">Enhance your Poem</h2>

                    {/* Editor */}
                    <form className="relative pb-[40px]">
                        <ul className="rounded-[20px] mb-[50px] p-[20px] w-[700px] h-[700px] bg-[#3A141E]">
                            {poem.map((line, index) => 
                                <li>
                                    {index + 1}. {line}
                                </li>
                            )}
                        </ul>
                        <button className="absolute bottom-0 right-0 w-[200px] p-[10px] rounded-[20px] text-white bg-[#B5446E] hover:bg-[#9D44B5] transition delay-100 ease-in-out">Next</button>
                    </form>
                </div>
            </main>

        </div>  
    );

};

export default EditorPage;