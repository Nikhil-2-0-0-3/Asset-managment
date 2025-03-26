import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Toggle state
  const handleSend = async () => {
    if (!message.trim()) return;
  
    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);
  
    try {
      const prompt = `Given the employee task: "${message}", provide the minimum computer hardware specifications required.`;
  
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        }
      );
  
      const geminiReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from the model.";
  
      setChat((prev) => [...prev, { sender: "bot", text: geminiReply }]);
    } catch (error) {
      console.error("Error from Gemini API:", error);
      let errorMsg = "Failed to get a response.";
      if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
        errorMsg = error.response.data.error.message;
      }
      setChat((prev) => [...prev, { sender: "bot", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={open ? styles.hidden : styles.floatingButton}
      >
        💬
      </button>

      {/* Chat Window */}
      <div style={{ ...styles.container, transform: open ? "scale(1)" : "scale(0)" }}>
        <div style={styles.header}>
          <span>Chatbot</span>
          <button onClick={() => setOpen(false)} style={styles.closeButton}>✖</button>
        </div>

        <div style={styles.chatWindow}>
          {chat.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.sender === "user" ? styles.userMsg : styles.botMsg)
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div style={styles.loading}>Loading...</div>}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button style={styles.button} onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  floatingButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    fontSize: "24px",
    zIndex: 1000,
    transition: "0.3s",
  },
  hidden: {
    display: "none"
  },
  container: {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "400px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
    zIndex: 1000,
    transition: "transform 0.3s ease-in-out",
    transform: "scale(0)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#007BFF",
    color: "#fff",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px"
  },
  closeButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer"
  },
  chatWindow: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
    borderBottom: "1px solid #ccc"
  },
  message: {
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    maxWidth: "75%"
  },
  userMsg: {
    alignSelf: "flex-end",
    backgroundColor: "#007BFF",
    color: "#fff"
  },
  botMsg: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    color: "#333"
  },
  loading: {
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    backgroundColor: "#f1f1f1",
    color: "#333"
  },
  inputContainer: {
    display: "flex",
    padding: "15px",
    backgroundColor: "#fff"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px"
  },
  button: {
    marginLeft: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }
};

export default Chatbot;
