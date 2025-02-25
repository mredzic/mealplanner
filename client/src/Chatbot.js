import { useState } from "react";
import "./Chatbot.css"; // Import CSS

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5002/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">Chat with AI</h2>
      <textarea
        className="chatbot-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        rows={3}
      />
      <br />
      <button className="chatbot-button" onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
      {loading && <p className="chatbot-loader">Generating response...</p>}
      <div className="chatbot-response">{response || "No response yet."}</div>
    </div>
  );
};

export default Chatbot;