// pages/_app.js
import { Geist, Geist_Mono } from "next/font/google";
import { PoemProvider } from '../context/poemContext';
import '../styles/globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <PoemProvider>
        <Component {...pageProps} />
      </PoemProvider>
    </div>
  );
}