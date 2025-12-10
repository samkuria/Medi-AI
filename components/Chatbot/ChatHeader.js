import React, { useState } from 'react';
import './ChatHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const ChatHeader = ({ activeSession, onRenameSession, onDeleteSession }) => {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(activeSession?.title || "");

    const handleRename = () => {
        if (!editing) {
            setEditing(true);
            return;
        }
        onRenameSession(title);
        setEditing(false);
    };

    return (
        <div className="chat-header">
            {editing ? (
                <input
                    className="chat-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleRename}
                    autoFocus
                />
            ) : (
                <div className="chat-title">
                    {activeSession ? activeSession.title : "New Chat"}
                </div>
            )}

            <div className="chat-header-actions">
                <button className="header-icon-btn" onClick={handleRename}>
                    <FontAwesomeIcon icon={faPen} />
                </button>
                <button className="header-icon-btn" onClick={onDeleteSession}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
