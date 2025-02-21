import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { DownloadButton } from "../components/DownloadButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
