// components/MusicSearch.js
import { useEffect, useState } from "react";
import MainHeader from './components/Header'; 
import AudioBox from './components/AudioBox';

export default function Music() {
  const [allTracks, setAllTracks] = useState([]); // Store all 12 tracks
  const [currentPage, setCurrentPage] = useState(0); // Track current page (0-based index)
  const tracksPerPage = 4; // Number of tracks to display per page
  
  useEffect(() => { 
    fetchTracks(); // call promise
  }, []); 

  const fetchTracks = async () => {
    const query = " (lofi instrumental)";
    if (!query.trim()) return;

    try {
      const response = await fetch("/api/createMusic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: query,
          limit: 12 // Request 12 tracks from the API
        }),
      });

      const data = await response.json();
      if (data.tracks) {
        setAllTracks(data.tracks.slice(0, 12));
        console.log("Fetched tracks:", data.tracks.slice(0, 12));
      } else {
        setAllTracks([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setAllTracks([]);
    }
  };

  // Calculate which tracks to display based on current page
  const getCurrentPageTracks = () => {
    const startIndex = currentPage * tracksPerPage;
    return allTracks.slice(startIndex, startIndex + tracksPerPage);
  };

  // Handle pagination navigation
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const maxPage = Math.ceil(allTracks.length / tracksPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <MainHeader />
      <div className="w-screen h-[calc(100vh-132px)] flex flex-col items-center justify-center">
        {/*Pass the current page tracks and pagination handlers*/}
        <AudioBox 
          tracks={getCurrentPageTracks()}
          onPrevPage={goToPreviousPage}
          onNextPage={goToNextPage}
          currentPage={currentPage}
          totalPages={Math.ceil(allTracks.length / tracksPerPage)}
        />
      </div>
    </>
  );
}