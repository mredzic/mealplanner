import { useState } from "react";

const Chatbot = () => {
  const [input, setInput] = useState(""); // User input
  const [response, setResponse] = useState(""); // AI response
  const [loading, setLoading] = useState(false); // Loading state

  const sendMessage = async () => {
    if (!input) return; // Prevent empty messages

    setLoading(true);
    setResponse(""); // Clear previous response

    try {
      const res = await fetch("http://localhost:5002/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setResponse(data.reply); // Update chatbot response
    } catch (error) {
      console.error("Error:", error);
      setResponse("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <h2>Chat with AI</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        rows={3}
        style={{ width: "100%", padding: 10 }}
      />
      <br />
      <button onClick={sendMessage} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? "Thinking..." : "Send"}
      </button>
      <div style={{ marginTop: 20 }}>
        <strong>Response:</strong>
        <p>{response || "No response yet."}</p>
      </div>
    </div>
  );
};

export default Chatbot;