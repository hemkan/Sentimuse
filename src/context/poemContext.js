import { createContext, useContext, useState } from "react";

export const PoemContext = createContext(null);

export const PoemProvider = ({ children }) => {
  const [poem, setPoem] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [narration, setNarration] = useState(null);
  const [music, setMusic] = useState(null);

  return (
    <PoemContext.Provider
      value={{
        poem,
        setPoem,
        sentiment,
        setSentiment,
        narration,
        setNarration,
        music,
        setMusic,
      }}
    >
      {children}
    </PoemContext.Provider>
  );
};

export const usePoemContext = () => useContext(PoemContext);
