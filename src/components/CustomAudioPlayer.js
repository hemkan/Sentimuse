import { useState, useRef, useEffect } from "react";
import { LuCirclePlay, LuCirclePause } from "react-icons/lu";

const CustomAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        console.log("Audio duration updated:", audio.duration);
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("loadedmetadata", updateDuration);

    if (audio.readyState >= 1) {
      updateDuration();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-[800px]">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="flex items-center gap-6">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-[#883447] flex items-center justify-center hover:bg-[#B3445A] transition-colors"
        >
          {isPlaying ? (
            <LuCirclePause size={29} className="text-[#FED2E1]" />
          ) : (
            <LuCirclePlay size={29} className="text-[#FED2E1]" />
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            step="0.01"
            onChange={handleTimeChange}
            className="w-full h-2 bg-[#4E1325] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FED2E1]"
          />
        </div>

        {/* Time Display */}
        <div className="text-[#FED2E1] font-['Inria_Sans'] text-lg">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
