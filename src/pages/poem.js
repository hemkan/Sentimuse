
import { useState, useRef, useEffect } from "react";


const Poem = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messageEnd = useRef(null);

  const scrollToBottom = () => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages ((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("../api/poemAPI", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });
      
      const data = await response.json();

      if (response.ok) {
        const botMessage = data.response;
        setMessages((prev) =>[...prev, botMessage]);
      } else {
        const errorMessage = data.error || "Whoopsies!";
        setMessages((prev) => [...prev, errorMessage]);
      }
    } 
    catch (error) {
      console.error("There was an error processing your request: ", error);
      const errorMessage = "An unexpected error occurred!";
      setMessages((prev) => [...prev, errorMessage]);
    }
    finally {
      setLoading(true);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow px-4 py-4">
        <h1 className="text-2xL front-semibold text-gray-800">
          Sentimuse
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div className="">{msg.text}</div>
        ))}

        {loading && (
          <div className="flex justify-start mv-4">
            <div className="flex space-x-1">
              <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
              <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
              <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></span>
            </div>
          </div>
        )}

        <div ref={messageEnd} />
      </div>

      <form onSubmit={handleSubmit} className="flex p-4 bg-white shadow">
        <input type="text"
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your prompt..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        disabled={loading}
        />

        <button
        type="submit"
        className="mL-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-500 focus:outline-none disabled:bg-blue-300"
        disabled={loading}>
          Submit!
        </button>

      </form>
    </div>
  );
};

export default Poem;
