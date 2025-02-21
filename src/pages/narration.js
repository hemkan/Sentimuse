import { useEffect, useState } from "react";

let voices = [
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 4 },
  { number: 5 },
  { number: 6 },
  { number: 7 },
  { number: 8 },
];

voices = [
  ...(voices.length > 1 ? voices.slice(voices.length - 2) : []),
  ...voices,
  ...(voices.length > 1 ? voices.slice(0, 2) : []),
];

const Narration = () => {
  const [narrationBlob, setNarrationBlob] = useState(null);
  const [voiceIndex, setVoiceIndex] = useState(voices.length > 1 ? 2 : 0);
  const [disabled, setDisabled] = useState(false);
  const [animate, setAnimate] = useState(true);

  const hoverNarration = async (voice, poetry) => {
    try {
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
        throw new Error(responseError.error);
      }

      const audio = new Audio();
      const mediaSource = new MediaSource();
      audio.src = URL.createObjectURL(mediaSource);

      const rawAudio = [];

      mediaSource.addEventListener("sourceopen", async () => {
        const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");

        const reader = response.body.getReader();

        while (true) {
          const { value, done } = await reader.read();

          if (value) {
            if (sourceBuffer.updating) {
              await new Promise((resolve) => {
                sourceBuffer.addEventListener("updateend", resolve, {
                  once: true,
                });
              });
            }

            sourceBuffer.appendBuffer(value);

            if (audio.paused) {
              audio.play();
            }

            rawAudio.push(value);
          }

          if (done) {
            if (sourceBuffer.updating) {
              await new Promise((resolve) => {
                sourceBuffer.addEventListener("updateend", resolve, {
                  once: true,
                });
              });
            }

            setTimeout(() => {
              mediaSource.endOfStream();
              audio.pause();
            }, 1000);

            setNarrationBlob(new Blob(rawAudio));
            break;
          }
        }
      });

      // audio.play();
    } catch (error) {
      console.error("WOMP WOMP. AN ERROR OCCURED: " + error.message || error);
    }
  };

  const nextVoice = () => {
    setVoiceIndex((index) => {
      return (index + 1) % voices.length;
    });
  };

  const prevVoice = () => {
    setVoiceIndex((index) => {
      return (index - 1 + voices.length) % voices.length;
    });
  };

  useEffect(() => {
    if (voices.length > 1) {
      if (voiceIndex <= 1) {
        setDisabled(true);

        setTimeout(() => {
          setAnimate(false);
          setVoiceIndex((index) => {
            return voices.length + index - 3 - 1;
          });

          setTimeout(() => {
            setAnimate(true);
            setDisabled(false);
          }, 50);
        }, 350);
      } else if (voices.length - voiceIndex <= 2) {
        setDisabled(true);

        setTimeout(() => {
          setAnimate(false);
          setVoiceIndex((index) => {
            return index - (voices.length - 2 - 1) + 1;
          });

          setTimeout(() => {
            setAnimate(true);
            setDisabled(false);
          }, 50);
        }, 350);
      }
    }
  }, [voiceIndex, voices.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <div className="overflow-x-hidden w-[80%] relative border-2">
        <div
          className="flex gap-[2%] m-auto transition-transform ease-in-out"
          style={{
            transform: `translateX(calc(-${voiceIndex * 82}% + 10%))`,
            transitionDuration: animate ? "0.3s" : "0s",
          }}
        >
          {voices.map((voice, index) => {
            return (
              <div
                key={index}
                className="flex justify-center items-center w-[80%] h-96 bg-gray-200 flex-shrink-0"
              >
                {voice.number}
              </div>
            );
          })}
        </div>

        <div
          className="w-full h-full absolute top-0 flex items-center justify-between"
          style={{
            padding: "0 calc(4% - 23.5px)",
          }}
        >
          <button
            className="bg-gray-700 rounded-full text-white p-1.5"
            onClick={prevVoice}
            disabled={disabled}
            style={{
              backgroundColor: disabled
                ? "rgb(150, 160, 170)"
                : "rgb(74, 85, 104)",
            }}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <button
            className="rounded-full text-white p-1.5"
            onClick={nextVoice}
            disabled={disabled}
            style={{
              backgroundColor: disabled
                ? "rgb(150, 160, 170)"
                : "rgb(74, 85, 104)",
            }}
          >
            {" "}
            <svg
              width="35"
              height="35"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Narration;
