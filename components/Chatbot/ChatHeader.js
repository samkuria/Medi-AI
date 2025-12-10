import React from 'react';
import  './ChatHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const ChatHeader = ({ activeSession, onRenameSession, onDeleteSession })=> {
    return(
        <div className="chat-header">
            <div className="chat-title">{activeSession ? activeSession.title : "New Chat"}</div>
            <div className="chat-header-actions">
                <button className="header-icon-btn" onClick={onRenameSession}><FontAwesomeIcon icon={faPen} /></button>
                <button className="header-icon-btn" onClick={onDeleteSession}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
                
        </div>
    );
};

export default ChatHeader;