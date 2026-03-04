import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import socket from "../socket";
import "./Chat.css";

function Chat() {
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  /* ================= REGISTER SOCKET USER ================= */
  useEffect(() => {
    if (user?.id) {
      socket.emit("registerUser", user.id);
    }
  }, [user?.id]); // ⭐ FIXED DEPENDENCY

  /* ================= LOAD MESSAGES ================= */
  const loadMessages = useCallback(async (chat) => {
    try {
      setActiveChat(chat);

      const res = await api.get(
        `/api/chat/${chat.roomId}/${chat.ownerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(res.data);
    } catch (err) {
      console.error("Message load error:", err);
    }
  }, [token]);

  /* ================= LOAD CONVERSATIONS ================= */
  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get(
        "/api/chat/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
   
      setConversations(res.data);
    } catch (err) {
      console.error("Conversation load error:", err);
    }
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /* ================= AUTO OPEN CHAT ================= */
  useEffect(() => {
    if (!location.state?.roomId) return;

    const newChat = {
      roomId: location.state.roomId,
      ownerId: location.state.ownerId,
      ownerName: location.state.ownerName,
      roomTitle: location.state.roomTitle,
    };

    setMessages([]);

    setConversations((prev) => {
      const exists = prev.find(
        (c) => c.roomId === newChat.roomId
      );
      return exists ? prev : [newChat, ...prev];
    });

    loadMessages(newChat);
  }, [location.state, loadMessages]);

  /* ================= SOCKET RECEIVE ================= */
  useEffect(() => {
    const handleReceive = (msg) => {
      if (!activeChat) return;

      if (msg.room === activeChat.roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => socket.off("receiveMessage", handleReceive);
  }, [activeChat]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!text.trim() || !activeChat) return;

    let receiverId;

    if (user.role === "student") {
      receiverId = activeChat.ownerId;
    } else {
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

        {/* SIDEBAR */}
        <div className="chat-sidebar">
          <h2>Your Conversations</h2>

          {conversations.length === 0 && (
            <p className="empty-text">No conversations yet</p>
          )}

          {conversations.map((chat, i) => (
            <div
              key={i}
              className={`chat-user ${
                activeChat?.roomId === chat.roomId &&
                activeChat?.ownerId === chat.ownerId
                  ? "active"
                  : ""
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

        {/* CHAT AREA */}
        <div className="chat-main">
          {!activeChat ? (
            <div className="no-chat">Select a conversation</div>
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
                {messages.map((msg, i) => {
                  const senderId =
                    typeof msg.sender === "object"
                      ? msg.sender._id
                      : msg.sender;

                  return (
                    <div
                      key={i}
                      className={`message ${
                        senderId === user.id ? "sent" : "received"
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
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                  placeholder="Type a message..."
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