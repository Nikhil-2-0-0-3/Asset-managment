import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message) return;

    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://YOUR_FIREBASE_FUNCTION_URL/chat",
        { message }
      );
      setChat([...newChat, { sender: "bot", text: res.data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setChat([...newChat, { sender: "bot", text: "Failed to respond" }]);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        height: "500px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        zIndex: 1000,
      }}
    >
      {/* Chat Window */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              padding: "12px",
              margin: "10px 0",
              borderRadius: "10px",
              maxWidth: "75%",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#007BFF" : "#f1f1f1",
              color: msg.sender === "user" ? "#fff" : "#333",
              marginLeft: msg.sender === "user" ? "auto" : "0",
              marginRight: msg.sender === "user" ? "0" : "auto",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div
            style={{
              padding: "12px",
              margin: "10px 0",
              borderRadius: "10px",
              backgroundColor: "#f1f1f1",
              color: "#333",
            }}
          >
            Loading...
          </div>
        )}
      </div>

      {/* Input Field and Send Button */}
      <div
        style={{
          display: "flex",
          padding: "15px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "14px",
          }}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          style={{
            marginLeft: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0056b3")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#007BFF")}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
