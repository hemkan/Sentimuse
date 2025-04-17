import { useState } from "react";
import ShareModal from "../components/ShareModal";
import CustomAudioPlayer from "../components/CustomAudioPlayer";

const Visual = () => {
  const [isModal, setIsModal] = useState(false);
  const [input1, setInput1] = useState(
    "https://hqqavgvrkldbjiupzmwt.supabase.co/storage/v1/object/public/audio-files/uploads/1744849620812-output.mp3"
  );

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
