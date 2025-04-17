import { useState } from "react";
import ShareModal from "../components/ShareModal";

const Visual = () => {
  const [isModal, setIsModal] = useState(false);
  const [input1, setInput1] = useState(
    "https://hqqavgvrkldbjiupzmwt.supabase.co/storage/v1/object/public/audio-files/uploads/1744849620812-output.mp3" // test url
  );

  return (
    <>
      <h1 className="font-['Inria_Sans']">Visual</h1>{" "}
      <button
        className="bg-blue-500 text-white p-2 rounded font-['Inria_Sans']"
        onClick={() => setIsModal(true)}
      >
        Next
      </button>
      <ShareModal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        fileUrl={input1}
      />
    </>
  );
};

export default Visual;
