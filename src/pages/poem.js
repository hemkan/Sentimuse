import { useState, useRef, useEffect } from "react";


const Poem = () => {
  const [poemVerses, setPoemVerses] = useState([]);
  //const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  //const msgEndRef = useRef<HTMLDivElement>(null);

  const prompt = 'Random';
  
  //const scrollToBottom = () => {
  //  msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //};

  useEffect(() => {
    handleSubmit;
  });


  const handleSubmit = async () => {
    try {
      const response = await fetch ("../api/poemAPI", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({message: prompt}),
      });

      if (response.ok) {
        const data = await response.json();
        const poem = data.response.split("\n");

        console.log(poem)

        if (data) {
          setPoemVerses(poem);
        }
      }

      else {
        throw new Error("Could not fetch resource!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Click me!</button>
      <ul>
        {poemVerses.map((verse, index) => (
          <li key={index}>{verse}</li>
        ))}
      </ul>
    </div>
  );
};

export default Poem;
