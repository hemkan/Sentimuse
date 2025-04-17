import React from "react";
import { LuLinkedin, LuTwitter, LuFacebook, LuCheck } from "react-icons/lu";
import { MdWhatsapp } from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import { downloadFromSupabase } from "../utils/supabaseClient";

const ShareModal = ({ isOpen, onClose, fileUrl }) => {
  const [showCheck, setShowCheck] = React.useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileUrl);
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 5000);
  };

  const handleShare = (platform) => {
    const shareUrl = fileUrl;
    if (!shareUrl) return;
    const encodedUrl = encodeURIComponent(shareUrl);
    let shareLink = "";

    switch (platform) {
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareLink, "_blank");
  };

  const handleDownload = async () => {
    try {
      await downloadFromSupabase(fileUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className="w-[600px] bg-[#3A141E] rounded-[20px] overflow-hidden transform transition-all duration-300">
        <div className="flex flex-col items-center self-stretch bg-[#3A141E] pt-[40px] pb-[40px] pl-[30px] pr-[30px] rounded-[20px]">
          <button
            className="w-full flex flex-col items-center bg-[#6F2539] text-left pt-[15px] pb-[15px] rounded-[20px] border-0 hover:opacity-90 transition-opacity font-['Inria_Sans']"
            onClick={handleDownload}
          >
            <span className="text-[#FFFFFF] text-[24px] font-['Inria_Sans']">
              {"Download MP3"}
            </span>
          </button>
          <div className="self-stretch bg-[#FFFFFF40] h-[1px] my-[30px]"></div>
          <span className="text-[#FFFFFF] text-[32px] mb-[30px] font-['Inria_Sans']">
            {"Share"}
          </span>
          <div className="flex justify-between items-start self-stretch mb-[30px] ml-[16px] mr-[16px]">
            <button
              onClick={() => handleShare("linkedin")}
              className="w-[80px] h-[80px] rounded-full bg-[#4E1325] flex items-center justify-center border-2 border-[#B3445A] border-opacity-0 hover:border-opacity-100 transition-all duration-300"
            >
              <LuLinkedin className="w-[40px] h-[40px] text-[#FED2E1] stroke-[1.5]" />
            </button>
            <button
              onClick={() => handleShare("facebook")}
              className="w-[80px] h-[80px] rounded-full bg-[#4E1325] flex items-center justify-center border-2 border-[#B3445A] border-opacity-0 hover:border-opacity-100 transition-all duration-300"
            >
              <LuFacebook className="w-[40px] h-[40px] text-[#FED2E1] stroke-[1.5]" />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="w-[80px] h-[80px] rounded-full bg-[#4E1325] flex items-center justify-center border-2 border-[#B3445A] border-opacity-0 hover:border-opacity-100 transition-all duration-300"
            >
              <LuTwitter className="w-[40px] h-[40px] text-[#FED2E1] stroke-[1.5]" />
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              className="w-[80px] h-[80px] rounded-full bg-[#4E1325] flex items-center justify-center border-2 border-[#B3445A] border-opacity-0 hover:border-opacity-100 transition-all duration-300"
            >
              <MdWhatsapp className="w-[40px] h-[40px] text-[#FED2E1]" />
            </button>
          </div>
          <div className="flex items-center self-stretch bg-[#4E1325] pt-[10px] pb-[10px] pl-[20px] pr-[20px] ml-[16px] mr-[16px] rounded-[20px] border-[1px] border-solid border-[#883447]">
            <input
              placeholder={"Link"}
              value={fileUrl}
              readOnly
              className="flex-1 self-stretch text-[#FFFFFF] bg-transparent text-[24px] pt-[1px] pb-[1px] border-0 font-['Inria_Sans'] pr-[20px] focus:outline-none focus:ring-0 focus:border-0"
            />
            <div
              className="flex shrink-0 items-center bg-[#B3445A] pt-[4px] pb-[4px] pl-[20px] pr-[20px] rounded-[15px] cursor-pointer"
              onClick={handleCopy}
            >
              {/* change icon based on user's click */}
              {showCheck ? (
                <LuCheck className="w-[20px] h-[20px] mr-[8px] text-[#FFFFFF]" />
              ) : (
                <FiCopy className="w-[20px] h-[20px] mr-[8px] text-[#FFFFFF]" />
              )}
              <span className="text-[#FFFFFF] text-[20px] font-['Inria_Sans']">
                {"Copy"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
