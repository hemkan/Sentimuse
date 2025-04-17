import { useState, useRef } from "react";
import ShareModal from "../components/ShareModal";
import CustomAudioPlayer from "../components/CustomAudioPlayer";

const Visual = () => {
  const [isModal, setIsModal] = useState(false);
  const [input1, setInput1] = useState(null);
  const [loading, setLoading] = useState(true); // this is set to true so that we can test the api
  const [mergedUrl, setMergedUrl] = useState("");

  const file1Ref = useRef(null); // narration
  const file2Ref = useRef(null); // background

  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append("file1", file1Ref.current.files[0]);
    formData.append("file2", file2Ref.current.files[0]);

    const res = await fetch("/api/merge-mp3", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setMergedUrl(data.url);
      setInput1(data.url);
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

export default Visual;
