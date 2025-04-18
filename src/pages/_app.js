// pages/_app.js
import { PoemProvider } from "../context/poemContext";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="font-sans">
      <PoemProvider>
        <Component {...pageProps} />
      </PoemProvider>
    </div>
  );
}
