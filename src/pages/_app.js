import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { PoemProvider } from "@/context/poemContext";

const geist = Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "700"],
});

export default function App({ Component, pageProps }) {
  return (
    <PoemProvider>
      <main className={geist.className}>
        <Component {...pageProps} />
      </main>
    </PoemProvider>
  );
}
