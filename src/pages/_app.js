import "@/styles/globals.css";
import { PoemProvider } from "@/context/poemContext";

export default function App({ Component, pageProps }) {
  return (
    <PoemProvider>
        <Component {...pageProps} />
    </PoemProvider>
  );
}
