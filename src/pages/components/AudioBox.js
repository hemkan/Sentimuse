import { useRef, useState } from "react";
import NextButton from "./NextButton";

export default function AudioBox() {
    
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Toggle audio playback and update play state
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle file upload and set the audio source
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 items-center justify-center w-[55%] h-full">
      <div className="mb-20 w-full text-white text-center lg:text-start text-[47px] font-[400]">
        Set the Rhythm
      </div>
      <div className="h-[30%] gap-8 mb-8 w-full flex flex-col lg:flex-row justify-center items-center">
        {/* Maybe add a numbering system for each page */}
        {/* WILL MAP ITEMS TO ARRAY THAT IS GENERATED WHEN API RETURNS ARRAY, USE LAZY LOADING WITH PAGINATION */}
        <AudioItem />
        <AudioItem />
        <AudioItem />
        <AudioItem />
      </div>

      {/* Show the Custom button only if an audio file is uploaded */}
    {audioSrc && (
        <button
          onClick={toggleAudio}
          style={isPlaying ? { outline: "2px solid #B3445A" } : {}}
          className="flex flex-row items-center justify-center gap-2 w-full h-16 mb-7 py-9 bg-[#3A141E] text-3xl rounded-[30px] shadow-lg hover:bg-[#6F2539] ease-in duration-65"
        >
            Custom
          <AudioIcon width="35" height="35" />
        </button>
      )}

    {/* Show the file upload input when no file is uploaded */}
    <label className="mb-8 text-center cursor-pointer text-white text-2xl font-normal">
        + Add your own
        <input
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileUpload}
        />
    </label>
      

      {/* Hidden audio element that plays the uploaded file */}
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}

      <NextButton />
    </div>
  );
}

function AudioIcon({ width = "40%", height = "40%" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 70 70"
      fill="none"
    >
      <circle cx="35" cy="35" r="35" fill="#5E1A2E" className="shadow-md" />
      <path
        d="M33.5014 24.104L26.0006 30.0446H20V38.9554H26.0006L33.5014 44.896V24.104Z"
        fill="#5E1A2E"
      />
      <path
        d="M45.6077 24C48.4201 26.7851 50 30.5619 50 34.5C50 38.4381 48.4201 42.2149 45.6077 45M40.3122 29.2426C41.7184 30.6351 42.5083 32.5235 42.5083 34.4926C42.5083 36.4616 41.7184 38.35 40.3122 39.7426"
        fill="#5E1A2E"
      />
      <path
        d="M45.6077 24C48.4201 26.7851 50 30.5619 50 34.5C50 38.4381 48.4201 42.2149 45.6077 45M40.3122 29.2426C41.7184 30.6351 42.5083 32.5235 42.5083 34.4926C42.5083 36.4616 41.7184 38.35 40.3122 39.7426M33.5014 24.104L26.0006 30.0446H20V38.9554H26.0006L33.5014 44.896V24.104Z"
        stroke="#FED2E1"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AudioItem() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-[#3A141E] rounded-[25px] hover:bg-[#6F2539] ease-in duration-65 cursor-pointer shadow-lg">
      <AudioIcon />
    </div>
  );
}

function PaginationIcon({ path }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="30"
      viewBox="0 0 16 28"
      fill="none"
      className="hover:scale-125 ease-in duration-100 cursor-pointer shadow-lg"
    >
      <path
        d={path}
        stroke="#883447"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
