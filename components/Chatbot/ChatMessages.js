import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./ChatMessages.css";
import BotAvatar from "../../assets/bot_avatar.png";
import UserAvatar from "../../assets/user_avatar.png";

const ChatMessages = ({ activeSessionId, messages }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeSessionId]);

  if (!activeSessionId) {
    return (
      <div className="chat-messages empty">
        <p>Please select or create a chat session.</p>
      </div>
    );
  }

  const sessionMessages = messages[activeSessionId] || [];

  return (
    <div className="chat-messages">
      {sessionMessages.length === 0 ? (
        <p className="no-messages">No messages yet. Say something!</p>
      ) : (
        sessionMessages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {/* Avatar */}
            <img
              src={msg.sender === "user" ? UserAvatar : BotAvatar}
              alt="avatar"
              className="avatar"
            />

            {/* Bubble + timestamp */}
            <div className="bubble-container">
              <div className={`message-bubble ${msg.sender}`}>
                {msg.text}
              </div>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

ChatMessages.propTypes = {
  activeSessionId: PropTypes.number,
  messages: PropTypes.object.isRequired
};

export default ChatMessages;

