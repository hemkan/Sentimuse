import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AudioPlayerPage() {
  const router = useRouter();

  // get the file name from the URL
  const { file } = router.query;
  const [audioUrl, setAudioUrl] = useState("");

  // set the audio URL if the file name is available
  useEffect(() => {
    if (file) {
      const encodedFile = encodeURIComponent(file);
      const supabaseUrl = `https://hqqavgvrkldbjiupzmwt.supabase.co/storage/v1/object/public/audio-files/uploads/${encodedFile}`;
      setAudioUrl(supabaseUrl);
    }
  }, [file]);

  if (!file) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 flex items-center justify-center h-screen">
      {audioUrl && (
        // audio player
        <audio controls style={{ width: "80%", maxWidth: "600px" }}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      )}
    </div>
  );
}
