import Image from "next/image";
import DownloadButton from "../components/DownloadButton";

export default function Home() {
  const narrationUrl = "/audio/sample.mp3";
  const musicUrl = "/audio/sample2.mp3";
  return (
    <div>
      <p className="text-2xl text-center">Home</p>
      <div className="p-6">
        <DownloadButton narrationUrl={narrationUrl} musicUrl={musicUrl} />
      </div>
    </div>
  );
}
