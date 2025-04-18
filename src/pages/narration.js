import { useRef, useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa6";
import { usePoemContext } from "@/context/poemContext";
import { useRouter } from "next/router";
import MainHeader from "../components/Header";

let voices = [
  { id: "NFG5qt843uXKj4pFvR7C", name: "Adam Stone" },
  { id: "FVQMzxJGPUBtfz1Azdoy", name: "Danielle" },
  { id: "uju3wxzG5OhpWcoi3SMy", name: "Michael Vincent" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "5Q0t7uMcjvnagumLfvZi", name: "Paul" },
  { id: "LcfcDJNUP1GQjkzn1xUU", name: "Emily" },
  { id: "CYw3kZ02Hs0563khs1Fj", name: "Dave" },
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria" },
];

const Narration = () => {
  const audioRef = useRef(null);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [disableVoice, setDisableVoice] = useState(false);
  const [playingVoice, setPlayingVoice] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const { setNarration } = usePoemContext();
  const router = useRouter();

  const generateNarration = async (voice, poetry) => {
    try {
      setDisableVoice(true);
      const response = await fetch("../api/narrationAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice,
          poetry,
        }),
      });

      if (!response.ok) {
        const responseError = await response.json();
        throw new Error(responseError.error || "An error occurred");
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
        audioRef.current = null;
      }

      const audio = new Audio();
      const mediaSource = new MediaSource();
      audio.src = URL.createObjectURL(mediaSource);
      audio.autoplay = true;
      audio.preload = "auto";

      audio.addEventListener("ended", () => {
        console.log("Audio ended");
        setDisableVoice(false);
        setPlayingVoice(null);
      });
      audio.addEventListener("error", () => {
        setDisableVoice(false);
        setPlayingVoice(null);
        console.error("Audio error occurred");
        console.log(audio.error);
      });

      audioRef.current = audio;

      mediaSource.addEventListener("sourceopen", async () => {
        const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");

        const reader = response.body.getReader();

        while (true) {
          const { value, done } = await reader.read();

          if (value) {
            await new Promise((resolve) => {
              if (!sourceBuffer.updating) {
                return resolve();
              }
              sourceBuffer.addEventListener("updateend", resolve, {
                once: true,
              });
            });

            sourceBuffer.appendBuffer(value);

            await new Promise((resolve) => {
              sourceBuffer.addEventListener("updateend", resolve, {
                once: true,
              });
            });

            if (audio.paused) {
              audio.play();
            }
          }

          if (done) {
            await new Promise((resolve) => {
              if (!sourceBuffer.updating) {
                return resolve();
              }
              sourceBuffer.addEventListener("updateend", resolve, {
                once: true,
              });
            });

            if (mediaSource.readyState === "open") {
              mediaSource.endOfStream();
            }
            // audio.pause();
            break;
          }
        }
      });
    } catch (error) {
      console.error("WOMP WOMP. AN ERROR OCCURED: " + error.message || error);
      setDisableVoice(false);
      setPlayingVoice(null);
    }
  };

  const navigateToNextPage = () => {
    setNarration(voices[selectedVoice].id);
    router.push("/music");
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#191113]">
      <MainHeader />

      <div className="mx-auto py-20 px-28 flex flex-col justify-center gap-9 w-full">
        <h3 className="text-[40px] text-white ml-[4rem]">Choose Your Voice</h3>
        <div className="flex gap-2 items-center">
          <button
            className="p-4 text-white rounded-md hover:bg-[#6F2539] hover:bg-opacity-55 disabled:opacity-50"
            disabled={voiceIndex === 0}
            onClick={() => setVoiceIndex((prev) => prev - 1)}
          >
            <MdOutlineKeyboardArrowLeft className="w-[30px] h-[30px]" />
          </button>

          <div className="w-full overflow-x-hidden">
            <div
              className="flex gap-8 w-full"
              style={{
                transform: `translateX(calc(-1 * ${voiceIndex} * (((100% - 64px) / 3) + 32px)))`,
                transitionDuration: "0.3s",
              }}
            >
              {voices.map((voice, index) => {
                return (
                  <div
                    key={voice.id}
                    className={`flex flex-col justify-center items-center gap-8 h-60 cursor-pointer ${
                      selectedVoice === index
                        ? "bg-[#6F2539]"
                        : "bg-[#3A141E] hover:bg-[#4A1925]"
                    } flex-shrink-0 rounded-xl px-2.5 py-2`}
                    style={{
                      width: "calc((100% - 64px) / 3)",
                    }}
                    onClick={(e) => {
                      if (e.target.closest("button")) return;

                      setSelectedVoice(index);
                    }}
                  >
                    <button
                      disabled={disableVoice}
                      className="p-5 rounded-full bg-[#5E1A2E] hover:bg-[#672034] disabled:opacity-50"
                      onClick={() => {
                        generateNarration(
                          voice.id,
                          "This is a test narration."
                        );
                        setPlayingVoice(index);
                      }}
                    >
                      {playingVoice === index ? (
                        <FaSpinner className="w-[40px] h-[40px] animate-spin" />
                      ) : (
                        <HiMiniSpeakerWave className="w-[40px] h-[40px]" />
                      )}
                    </button>
                    <span className="text-xl text-center">{voice.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="p-4 text-white rounded-md hover:bg-[#6F2539] hover:bg-opacity-55 disabled:opacity-50"
            disabled={voiceIndex + 2 === voices.length - 1}
            onClick={() => setVoiceIndex((prev) => prev + 1)}
          >
            <MdOutlineKeyboardArrowRight className="w-[30px] h-[30px]" />
          </button>
        </div>

        <div className="flex justify-end mr-[4rem]">
          <button
            className="w-[190px] h-[45px] bg-[#EC5A72] rounded-[20px] font-['Inria_Sans'] font-normal text-white text-2xl text-center"
            // ml-auto mr-[70px] px-8 py-2.5 bg-[#cf5267] hover:bg-[#EC5A72] rounded-2xl disabled:opacity-50"
            disabled={disableVoice || selectedVoice === null}
            onClick={navigateToNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Narration;
