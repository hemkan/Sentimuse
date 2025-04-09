// components/MusicSearch.js
import { useEffect, useState } from "react";
import MainHeader from './components/Header'; 
import AudioBox from './components/AudioBox';
import NextButton from './components/NextButton';

export default function Music() {
  
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => { 
      fetchTracks(); // call promise
  }, []); 

  const fetchTracks = async () => {
    const query = "vaporwave (instrumental)";
    if (!query.trim()) return;

    try {
      const response = await fetch("/api/createMusic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await response.json();
      if (data.tracks) {
        setSearchResults(data.tracks.slice(0, 4));
        console.log(searchResults);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    }
  };



  return (
    <>
      <MainHeader />
      <div className="w-scren h-[calc(100vh-132px)] flex flex-col items-center justify-center">
        {/*Pass the returned array as props*/}
        <AudioBox tracks={searchResults}/>
      </div>
    </>
  );
}

