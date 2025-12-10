import React from "react";
import "./ChatMessages.css";
import userAvatar from "../../assets/user_avatar.png";
import botAvatar from "../../assets/bot_avatar.png";

const ChatMessages = ({ messages = [], isBotTyping }) => {
  return (
    <div className="messages-container">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message-item ${
            msg.sender === "user" ? "user-message" : "bot-message"
          }`}
        >
          <img
            src={msg.sender === "user" ? userAvatar : botAvatar}
            className="message-avatar"
            alt="avatar"
          />

          <div className="message-content">
            <div className="message-text">{msg.text}</div>
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isBotTyping && (
        <div className="message-item bot-message typing-indicator">
          <img src={botAvatar} className="message-avatar" alt="avatar" />
          <div className="message-content">
            <div className="message-text">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;


