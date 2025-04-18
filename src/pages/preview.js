import { useState, useRef, useEffect } from "react";
import ShareModal from "../components/ShareModal";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import { usePoemContext } from "@/context/poemContext";

const Preview = () => {
  const [isModal, setIsModal] = useState(false);
  const [input1, setInput1] = useState(null);
  const [loading, setLoading] = useState(true); // this is set to true so that we can test the api
  const [mergedUrl, setMergedUrl] = useState("");
  const { narration, music, poem, sentiment } = usePoemContext();

  const testPoem =
    "Roses are red, violets are blue, sugar is sweet, and so are you.";
  const file1Ref = useRef(null); // narration
  const file2Ref = useRef(null); // background

  useEffect(() => {
    console.log("narration: ", narration);
    console.log("music: ", music);
    console.log("poem: ", poem);
    console.log("sentiment: ", sentiment);
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
    }
  };

  const getMusic = async (music) => {
    try {
      const musicBlob = await fetch(music).then((res) => res.blob());
      const musicFile = new File([musicBlob], "file2.mp3", {
        type: "audio/mpeg",
      });
      return musicFile;
    } catch (error) {
      console.error("AN ERROR OCCURED: " + error.message || error);
    }
  };

  const handleGenerate = async () => {
    const formData = new FormData();
    const narrationFile = await genNarration(
      narration,
      `(with anger) ${testPoem}`
    );
    const musicFile = await getMusic(music.url);

    formData.append("file1", narrationFile);
    formData.append("file2", musicFile);

    const res = await fetch("/api/merge-mp3", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setMergedUrl(data.url);
      setInput1(data.url);
      console.log("Merged URL: ", data.url);
      // setLoading(false);
    } else {
      alert(data.error);
    }
  };

  if (loading) {
    // this changes to three-dots animation but this is background processing for when arriving on this page (extract from context and process)
    //       // <div className="flex items-center justify-center min-h-screen">
    //       //   <div className="dot-windmill"></div>
    //       // </div>
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        {!mergedUrl && (
          <>
            <input type="file" ref={file1Ref} accept="audio/mp3" />
            <input type="file" ref={file2Ref} accept="audio/mp3" />

            <button
              className="bg-[#ec5a72] rounded-[20px] font-['Inria_Sans'] font-normal text-white text-2xl text-center px-4 py-2"
              onClick={handleGenerate}
              // disabled={loading}
            >
              {loading ? "Processing..." : "Generate MP3"}
            </button>
          </>
        )}

        {mergedUrl && (
          <div className="w-full max-w-xl mt-6">
            <CustomAudioPlayer url={input1} />
          </div>
        )}
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
