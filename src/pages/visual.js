import { useState, useEffect } from "react";

const Visual = () => {
  const [imageBlob, setImageBlob] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [input, setInput] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let prompt = formData.get("prompt");
    // prompt = `Generate a plain, moody background image that evokes a sense of ${prompt}. Avoid any people, objects, or text. Use soft, abstract textures or gradients in dark cool tones (such as deep blues, grays, or muted purples). The background should be subtle and not distracting, suitable for placing high-contrast live text over it in a video.`;
    prompt = `Generate a plain background image that evokes a sense of ${prompt}. Avoid any people, objects, or text. Use soft, abstract textures or gradients that visually suggest the emotion through color and tones (such as dark cool tones). The background should be subtle and not distracting, suitable for placing high-contrast live text over it in a video.`;

    try {
      console.log("Prompt:", prompt); // this only has emotion in it
      const response = await fetch("../api/imageAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          output_format: "jpeg",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const imageBlob = await response.blob();
      setImageBlob(imageBlob);
      setInput("");
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  // this is to clean up the URL when the component unmounts or the imageBlob changes
  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageBlob]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Image Generation</h1>
      <p className="text-lg mb-8">Emotion</p>
      <form
        className="flex flex-col items-center space-y-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your emotion here..."
          className="border border-gray-300 rounded p-2 w-80 text-black"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Image
        </button>
      </form>
      {imageUrl && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Image</h2>
          <img src={imageUrl} alt="Generated" className="rounded shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default Visual;
