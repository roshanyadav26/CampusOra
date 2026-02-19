import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import "./Chat.css";

function Chat() {
  const location = useLocation();
  const roomData = location.state;

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  /* ================= REGISTER USER SOCKET ================= */
  useEffect(() => {
    if (user?.id) {
      socket.emit("registerUser", user.id);
    }
  }, [user]);

  /* ================= LOAD CONVERSATIONS ================= */
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/chat/conversations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setConversations(res.data);

        if (roomData) {
          loadMessages(roomData);
        }
      } catch (err) {
        console.error("Conversation load error:", err);
      }
    };

    loadConversations();
  }, []);

  /* ================= LOAD MESSAGES ================= */
  const loadMessages = async (chat) => {
    try {
      setActiveChat(chat);

      const res = await axios.get(
        `http://localhost:5000/api/chat/${chat.roomId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(res.data);
    } catch (err) {
      console.error("Message load error:", err);
    }
  };

  /* ================= SOCKET RECEIVE ================= */
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      console.log("📩 Received:", msg);

      // Only append if message belongs to current chat
      if (activeChat && msg.room === activeChat.roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [activeChat]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!text.trim() || !activeChat) return;

    let receiverId;

    // If student → send to owner
    if (user.role === "student") {
      receiverId = activeChat.ownerId;
    } 
    // If owner → send to student (detect from last message)
    else {
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg) return;

      const senderId =
        typeof lastMsg.sender === "object"
          ? lastMsg.sender._id
          : lastMsg.sender;

      const receiver =
        typeof lastMsg.receiver === "object"
          ? lastMsg.receiver._id
          : lastMsg.receiver;

      receiverId = senderId === user.id ? receiver : senderId;
    }

    if (!receiverId) return;

    socket.emit("sendMessage", {
      roomId: activeChat.roomId,
      senderId: user.id,
      receiverId,
      text,
    });

    setText("");
  };

  return (
    <div className="chat-page">
      <div className="chat-container">

        {/* ===== SIDEBAR ===== */}
        <div className="chat-sidebar">
          <h2>Your Conversations</h2>

          {conversations.length === 0 && (
            <p className="empty-text">No conversations yet</p>
          )}

          {conversations.map((chat, index) => (
            <div
              key={index}
              className={`chat-user ${
                activeChat?.roomId === chat.roomId ? "active" : ""
              }`}
              onClick={() => loadMessages(chat)}
            >
              <div className="avatar">
                {chat.ownerName?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h4>{chat.ownerName}</h4>
                <p>{chat.roomTitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ===== CHAT AREA ===== */}
        <div className="chat-main">
          {!activeChat ? (
            <div className="no-chat">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="avatar big">
                  {activeChat.ownerName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{activeChat.ownerName}</h3>
                  <p>{activeChat.roomTitle}</p>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((msg, index) => {

                  const senderId =
                    typeof msg.sender === "object"
                      ? msg.sender._id
                      : msg.sender;

                  return (
                    <div
                      key={index}
                      className={`message ${
                        senderId === user.id
                          ? "sent"
                          : "received"
                      }`}
                    >
                      <div className="bubble">{msg.text}</div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
