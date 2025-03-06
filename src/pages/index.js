import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Music from "./music";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Music/>
    </div>
  );
}
