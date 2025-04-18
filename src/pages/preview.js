import { useState, useRef, useEffect } from "react";
import ShareModal from "../components/ShareModal";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import { usePoemContext } from "@/context/poemContext";
import toWav from "audiobuffer-to-wav";
import { uploadToSupabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const Preview = () => {
  const [isModal, setIsModal] = useState(false);
  const [input1, setInput1] = useState(null);
  const [loading, setLoading] = useState(true); // this is set to true so that we can test the api
  const [mergedUrl, setMergedUrl] = useState("");
  const { narration, music, poem, sentiment } = usePoemContext();
  const router = useRouter();
  //   const testPoem = poem;
  // "Roses are red, violets are blue, sugar is sweet, and so are you.";
  const file1Ref = useRef(null); // narration
  const file2Ref = useRef(null); // background
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("narration: ", narration);
    console.log("music: ", music);
    console.log("poem: ", poem);
    console.log("sentiment: ", sentiment);
    if (!poem) {
      //   router.push("/poem");
      console.log("no poem");
    } else if (!music) {
      router.push("/music");
    } else if (!sentiment) {
      //   router.push("/sentiment");
      console.log("no sentiment");
    } else if (!narration) {
      router.push("/narration");
    } else {
      console.log("all good");
      // } else {
    }
    handleGenerate();
  }, []);

  const genNarration = async (voice, poetry) => {
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
        throw new Error(responseError.error || "An error occurred");
      }

      const narrationBlob = await response.blob();
      console.log("narrationBlob: ", narrationBlob);
      const narrationFile = new File([narrationBlob], "file1.mp3", {
        type: "audio/mpeg",
      });
      return narrationFile;
    } catch (error) {
      console.error("AN ERROR OCCURED: " + error.message || error);
      // Return null instead of undefined to prevent the arrayBuffer error
      return null;
    }
  };

  const getMusic = async (musicUrl, duration) => {
    const proxyUrl = `/api/proxy-audio?url=${encodeURIComponent(musicUrl)}`;
    console.log("Fetching music from proxy:", proxyUrl);

    const response = await fetch(proxyUrl);
    const musicBlob = await response.blob();
    const arrayBuffer = await musicBlob.arrayBuffer();

    const audioContext = new AudioContext();
    const musicBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const outputDuration = duration + 0.5; // 2 seconds more
    const sampleRate = musicBuffer.sampleRate;

    const offlineCtx = new OfflineAudioContext(
      musicBuffer.numberOfChannels,
      outputDuration * sampleRate,
      sampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = musicBuffer;

    const gainNode = offlineCtx.createGain();
    gainNode.gain.value = 0.15;

    source.connect(gainNode);
    gainNode.connect(offlineCtx.destination);

    source.start(0);
    const newBuffer = await offlineCtx.startRendering();

    const wavBlob = new Blob([toWav(newBuffer)], { type: "audio/wav" });
    const adjustedFile = new File([wavBlob], "file2.wav", {
      type: "audio/wav",
    });

    return adjustedFile;
  };

  const getAudioDuration = async (audioFile) => {
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.duration;
  };

  const handleGenerate = async () => {
    try {
      // const formData = new FormData();
      const narrationFile = await genNarration(
        narration,
        `<${sentiment}> ${poem}`
      );

      // Check if narrationFile is null (error occurred)
      if (!narrationFile) {
        setError("Failed to generate narration. Please try again.");
        return;
      }

      const narrationDuration = await getAudioDuration(narrationFile);

      const musicFile = await getMusic(music.url, narrationDuration);

      const narrationUrl = await uploadToSupabase(narrationFile);
      const musicUrl = await uploadToSupabase(musicFile);

      // formData.append("file1", narrationUrl);
      // formData.append("file2", musicUrl);

      const res = await fetch("/api/merge-mp3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl1: narrationUrl.data.publicUrl,
          fileUrl2: musicUrl.data.publicUrl,
        }),
      });
      console.log("res: ", res);
      const data = await res.json();
      if (res.ok) {
        setMergedUrl(data.url);
        setInput1(data.url);
        console.log(data.url);
        setLoading(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error in handleGenerate:", error);
      setError(
        "An error occurred while generating the preview. Please try again."
      );
    }
  };

  if (loading) {
    // same loading as the music player
    return (
      <div className="bg-[#191113] min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="w-full h-[132px] bg-[#191113]">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="font-['Inria_Sans'] font-normal text-white text-[32px]">
              Sentimuse
            </div>
          </div>
          <div className="w-full h-px bg-[#FFFFFF40]" />
        </nav>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center h-[30%] w-full">
            <div className="loading-spinner mb-4"></div>
            <p className="text-white text-xl">Processing your audio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#191113] min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full h-[132px] bg-[#191113]">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="font-['Inria_Sans'] font-normal text-white text-[32px]">
            Sentimuse
          </div>
        </div>
        <div className="w-full h-px bg-[#FFFFFF40]" />
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <main className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between py-12">
          <h1 className="font-['Inria_Sans'] font-normal text-white text-[40px] mb-[6rem]">
            Experience &amp; Share
          </h1>

          {/* Audio Box */}
          <div className="bg-[#3a141e] rounded-[20px] py-8 px-4 sm:px-6 mb-[6rem]">
            <div className="flex flex-col items-center">
              {error ? (
                <div className="text-red-400 mb-4 p-4 bg-red-900/30 rounded-lg text-center">
                  {error}
                </div>
              ) : null}
              <CustomAudioPlayer src={input1} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="w-[190px] h-[45px] bg-[#ec5a72] rounded-[20px] font-['Inria_Sans'] font-normal text-white text-2xl text-center"
              onClick={() => setIsModal(true)}
            >
              Share
            </button>
          </div>
        </main>
      </div>

      {/* Modal */}
      <ShareModal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        fileUrl={input1}
      />
    </div>
  );
};

export default Preview;
