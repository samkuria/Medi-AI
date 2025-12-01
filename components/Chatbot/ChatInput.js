import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ChatInput.css";

// Optional: FontAwesome paper plane icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;

    onSend(text.trim());
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        className="chat-input-field"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        rows={1}
      />
      <button className="send-btn" onClick={handleSend}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
};

export default ChatInput;
