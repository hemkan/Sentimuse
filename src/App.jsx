import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Poem from "./pages/Poem";
import Narration from "./pages/Narration";
import Export from "./components/Export";
import PageNotFound from "./pages/PageNotFound";

const App = () => {
  return (
    <Routes>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/narration" element={<Narration />} />
      <Route path="/music" element={<Music />} />
      <Route path="/poem" element={<Poem />} />
      <Route path="/export" element={<Export />} />
    </Routes>
  );
};

export default App;
