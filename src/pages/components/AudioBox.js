import AudioIcon from "./AudioIcon";
import NextButton from "./NextButton";

export default function AudioBox(){
    return (
        <div className="flex flex-col gap-12 items-center justify-center w-[55%] h-full">
            <div className="w-full text-white text-[50px] font-[400] font-[Inria Sans] ">
                Set the Rhythm
            </div>
            <div className=" h-[40%] gap-8 w-full flex flex-row justify-center items-center">
                <div className="flex items-center justify-center w-[25%] h-[80%] bg-[#3A141E] rounded-[25px] hover:bg-[#6F2539]"><AudioIcon /></div>
                <div className="flex items-center justify-center w-[25%] h-[80%] bg-[#3A141E] rounded-[25px] hover:bg-[#6F2539]"><AudioIcon /></div>
                <div className="flex items-center justify-center w-[25%] h-[80%] bg-[#3A141E] rounded-[25px] hover:bg-[#6F2539]"><AudioIcon /></div>
                <div className="flex items-center justify-center w-[25%] h-[80%] bg-[#3A141E] rounded-[25px] hover:bg-[#6F2539]"><AudioIcon /></div>
            </div>
            <div className="text-center justify-center text-white text-3xl font-normal font-['Inria_Sans']">+ Add your own</div>
            <NextButton />
        </div>
    );
}