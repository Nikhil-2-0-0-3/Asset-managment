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
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-lg flex flex-col border border-gray-200">
      <div className="flex-1 p-4 overflow-y-auto">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`p-3 my-2 rounded-lg max-w-[75%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-3 my-2 rounded-lg bg-gray-100 text-gray-800">
            Loading...
          </div>
        )}
      </div>

      <div className="flex p-4 border-t border-gray-300">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
