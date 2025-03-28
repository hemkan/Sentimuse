import NextButton from "./NextButton";

function AudioIcon(){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 70 70" fill="none">
            <circle cx="35" cy="35" r="35" fill="#5E1A2E"/>
            <path d="M33.5014 24.104L26.0006 30.0446H20V38.9554H26.0006L33.5014 44.896V24.104Z" fill="#5E1A2E"/>
            <path d="M45.6077 24C48.4201 26.7851 50 30.5619 50 34.5C50 38.4381 48.4201 42.2149 45.6077 45M40.3122 29.2426C41.7184 30.6351 42.5083 32.5235 42.5083 34.4926C42.5083 36.4616 41.7184 38.35 40.3122 39.7426" fill="#5E1A2E"/>
            <path d="M45.6077 24C48.4201 26.7851 50 30.5619 50 34.5C50 38.4381 48.4201 42.2149 45.6077 45M40.3122 29.2426C41.7184 30.6351 42.5083 32.5235 42.5083 34.4926C42.5083 36.4616 41.7184 38.35 40.3122 39.7426M33.5014 24.104L26.0006 30.0446H20V38.9554H26.0006L33.5014 44.896V24.104Z" stroke="#FED2E1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

function AudioItem() {
    return (
      <div className="flex items-center justify-center w-[25%] h-[80%] bg-[#3A141E] rounded-[25px] hover:bg-[#6F2539] cursor-pointer">
        <AudioIcon />
      </div>
    );
}  

function PaginationIcon({path}){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="28" viewBox="0 0 16 28" fill="none" className="hover:scale-125 cursor-pointer">
            <path d={path} stroke="#883447" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

export default function AudioBox(){
    return (
        <div className="flex flex-col gap-2 items-center justify-center w-[55%] h-full">
            <div className="mb-12 w-full text-white text-[47px] font-[400] font-[Inria Sans] ">
                Set the Rhythm
            </div>
            <div className=" h-[40%] gap-8 w-full flex flex-row justify-center items-center">
                {/*Maybe add a numbering system for each page*/}
                <PaginationIcon path="M14 26L2 14L14 2" />
                {/*WILL MAP ITEMS TO ARRAY THAT IS GENERATED WHEN API RETURNS ARRAY, USE LAZY LOADING WITH PAGINATION*/}
                <AudioItem />
                <AudioItem />
                <AudioItem />
                <AudioItem />
                <PaginationIcon path="M2 26L14 14L2 2" />
            </div>
            {/*When a valid file is uploaded, change to "Custom" thae the user*/}
            <label className="mb-16 text-center cursor-pointer text-white text-2xl font-normal font-['Inria_Sans']">
                + Add your own
                <input type="file" accept="audio/*" className="hidden" />
            </label>
            <NextButton />
        </div>
    );
}