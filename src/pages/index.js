import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ExportWindow from "../components/ExportWindow";

export default function Home() {
  const narrationUrl = "/audio/sample.mp3";
  const musicUrl = "/audio/sample2.mp3";
  return (
    <div>
      <p className="text-2xl text-center">Home</p>
      <div className="p-6">
        <ExportWindow narrationUrl={narrationUrl} musicUrl={musicUrl} />
      </div>
    </div>
  );
}
