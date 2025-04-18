import { useRef, useState, useEffect } from "react";
import NextButton from "./NextButton";
import { usePoemContext } from "../context/poemContext"; // Import the existing context

export default function AudioBox({
  tracks,
  onPrevPage,
  onNextPage,
  currentPage,
  totalPages,
}) {
  // Get the music state from PoemContext
  const { music, setMusic } = usePoemContext();

  // Reference for custom audio element
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState(null);
  // State toggle for audio controls
  const [isPlaying, setIsPlaying] = useState(false);
  // State toggle for custom button
  const [customDisplay, setCustomDisplay] = useState(false);
  const [customTrack, setCustomTrack] = useState(false);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // On component mount, check if a track is already selected in context
  useEffect(() => {
    // Simulate loading time for initial music set
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // If music is already set in context, update local state
    if (music) {
      // If it's a custom track
      if (music.isCustom) {
        setCustomTrack(music.url);
        setCustomDisplay(true);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  // Toggle audio playback and update play state
  const playAudio = (url, trackId = null, isCustomTrack = false) => {
    console.log("Playing audio:", { url, trackId, isCustomTrack });

    // Check if same track is clicked or a different one
    const isSameTrack =
      (isCustomTrack && music?.isCustom && music?.url === url) ||
      (!isCustomTrack && music?.id === trackId && music?.url === url);

    if (isSameTrack) {
      // Toggle play/pause for the same track
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          ?.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => console.error("Playback error:", err));
      }
    } else {
      // Different track clicked, update context and local state
      if (isCustomTrack) {
        setMusic({
          isCustom: true,
          url: url,
          title: "Custom Track",
        });
        setAudioSrc(customTrack);
      } else {
        // Make sure trackId is definitely set when storing in context
        const selectedTrack = tracks.find((t) => t.id === trackId);
        console.log("Selected track:", selectedTrack);

        const proxyUrl = `/api/proxy-audio?url=${encodeURIComponent(url)}`;
        setAudioSrc(proxyUrl);
        console.log("Audio source:", proxyUrl);

        setMusic({
          id: trackId, // Store the ID for comparison
          url: url,
          isCustom: false,
          title: selectedTrack?.title || "Track",
        });
      }

      // Reset audio element for new track
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current || !music?.url) return;

    const playTrack = async () => {
      try {
        // Safely update audio source
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        const audioUrl = music.isCustom
          ? music.url
          : `/api/proxy-audio?url=${encodeURIComponent(music.url)}`;

        audioRef.current.src = audioUrl;

        // Use await to catch any errors during play
        await audioRef.current.play();
        console.log("Playing:", audioUrl);
        setIsPlaying(true);
      } catch (err) {
        // Handle abort errors more gracefully
        if (err.name === "AbortError") {
          console.log("Playback aborted - this is normal when navigating");
        } else {
          console.error("Playback error:", err);
          setIsPlaying(false);
        }
      }
    };

    playTrack();

    // Cleanup function to handle component unmounting
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [music]);

  // Handle file upload and set the audio source
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // get the file

    // If the file was an audio file
    if (file) {
      const url = URL.createObjectURL(file); // set file as URL
      setCustomTrack(url);
      setCustomDisplay(true);

      // Store in context
      setMusic({
        isCustom: true,
        url: url,
        title: "Custom Track",
        // Don't store the full blob in context as it could be large
        // Just store the URL which is a reference to the blob
      });
    }
  };

  // Compare track ID with the currently selected music in context
  const isTrackSelected = (trackId) => {
    if (!music) return false;
    // Make sure we're doing a strict equality check and the track is not custom
    return music.id === trackId && music.isCustom === false;
  };

  // Check if custom track is selected
  const isCustomSelected = () => {
    return music?.isCustom === true;
  };

  console.log("Current music state:", music);

  return (
    <div className="flex flex-col gap-1 items-center justify-center w-[70%] h-full">
      <div className="lg:pl-12 mb-20 w-full text-white text-center lg:text-start text-4xl">
        Set the Rhythm
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[30%] w-full">
          <div className="loading-spinner mb-4"></div>
          <p className="text-white text-xl">Loading your music...</p>
        </div>
      ) : (
        <>
          {/* Page indicator */}
          <div className="h-[30%] gap-8 mb-8 w-full flex flex-col lg:flex-row justify-center items-center">
            {/* Pagination buttons with disabled state handling */}
            <PaginationIcon
              path="M14 26L2 14L14 2"
              onClick={onPrevPage}
              disabled={currentPage === 0}
            />

            {tracks.map((track, idx) => {
              const selected = isTrackSelected(track.id);
              console.log(`Track ${track.id} selected:`, selected);
              return (
                <AudioItem
                  key={idx}
                  track={track}
                  playAudio={playAudio}
                  isPlaying={isPlaying}
                  audioSrc={audioSrc}
                />
              );
            })}

            <PaginationIcon
              path="M2 26L14 14L2 2"
              onClick={onNextPage}
              disabled={currentPage === totalPages - 1}
            />
          </div>

          {/* Show the Custom button only if an audio file is uploaded */}
          {customDisplay && (
            <button
              onClick={() => playAudio(customTrack, null, true)}
              className={`flex flex-row items-center justify-center w-[92.5%] h-16 mb-7 py-9 rounded-[30px] cursor-pointer shadow-lg ease-in duration-65 gap-4 ${
                audioSrc && audioSrc === customTrack
                  ? "bg-[#6F2539]"
                  : "bg-[#3A141E]"
              }`}
              style={
                !audioSrc || audioSrc !== customTrack ? { outline: "none" } : {}
              }
              onMouseEnter={(e) => {
                if (!audioSrc || audioSrc !== customTrack) {
                  e.currentTarget.style.outline = "2px solid #B3445A";
                }
              }}
              onMouseLeave={(e) => {
                if (!audioSrc || audioSrc !== customTrack) {
                  e.currentTarget.style.outline = "none";
                }
              }}
            >
              <span style={{ fontSize: "1.75rem" }}>Custom</span>
              <AudioIcon width="35" height="35" />
            </button>
          )}

          {/* Show the file upload input only if no custom track is selected */}
          {!customDisplay && (
            <label className="mb-8 text-center cursor-pointer text-white text-2xl font-normal">
              + Add your own
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}

          {/* Hidden audio element that plays the uploaded file */}
          {audioSrc && <audio ref={audioRef} src={audioSrc} />}

          <NextButton />
        </>
      )}
    </div>
  );

  function AudioItem({ track, playAudio, isSelected }) {
    console.log(`Rendering AudioItem ${track.id}, isSelected:`, isSelected);
    const isTrackSelected =
      audioSrc &&
      audioSrc === `/api/proxy-audio?url=${encodeURIComponent(track.url)}`;

    return (
      <button
        onClick={() => playAudio(track.url, track.id, false)}
        className={`flex flex-col items-center justify-center w-full h-full p-4 rounded-[25px] cursor-pointer shadow-lg ease-in duration-65 ${
          isTrackSelected ? "bg-[#6F2539]" : "bg-[#3A141E]"
        }`}
        style={!isTrackSelected ? { outline: "none" } : {}}
        onMouseEnter={(e) => {
          if (!isTrackSelected) {
            e.currentTarget.style.outline = "2px solid #B3445A";
          }
        }}
        onMouseLeave={(e) => {
          if (!isTrackSelected) {
            e.currentTarget.style.outline = "none";
          }
        }}
      >
        <AudioIcon />
      </button>
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
          d="M45.6077 24C48.4201 26.7851 50 30.5619 50 34.5C50 38.4381 48.4201 42.2149 45.6077 45M40.3122 29.2426C41.7184 30.6351 
                42.5083 32.5235 42.5083 34.4926C42.5083 36.4616 41.7184 38.35 40.3122 39.7426"
          fill="#5E1A2E"
        />
        <path
          d="M45.6077 24C48.4201 26.7851 50 30.5619 50 34.5C50 38.4381 48.4201 42.2149 45.6077 45M40.3122 29.2426C41.7184 30.6351 
                42.5083 32.5235 42.5083 34.4926C42.5083 36.4616 41.7184 38.35 40.3122 39.7426M33.5014 24.104L26.0006 30.0446H20V38.9554H26.0006L33.5014 44.896V24.104Z"
          stroke="#FED2E1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function PaginationIcon({ path, onClick, disabled }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 16 28"
        fill="none"
        className={`${
          disabled
            ? "opacity-40"
            : "hover:scale-125 ease-in duration-100 cursor-pointer"
        } shadow-lg`}
        onClick={disabled ? null : onClick}
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
}
