import React, { useState } from 'react';
import ChatHeader from '../../components/Chatbot/ChatHeader';
import ChatSidebar from '../../components/Chatbot/ChatSidebar';
import ChatMessages from '../../components/Chatbot/ChatMessages';
import ChatInput from '../../components/Chatbot/ChatInput';
import './Chatbot.css';
import axios from 'axios';

const Chatbot = () => {
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [messages, setMessages] = useState({});

    const handleNewSession = () => {
        const newId = Date.now();
        setSessions([
            ...sessions, 
            { id: newId, title: `New Chat ${sessions.length + 1}` }
        ]);
        setActiveSessionId(newId);
    };

    const handleSelectSession = (sessionId) => {
        setActiveSessionId(sessionId);
    };

    const handleToggleCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="chatbot-container" style={{ display: "flex", height: "100vh" }}>
            
            {/* SIDEBAR */}
            <ChatSidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                sidebarCollapsed={sidebarCollapsed}
                onSelectSession={handleSelectSession}
                onNewSession={handleNewSession}
                onToggleCollapse={handleToggleCollapse}
            />

            {/* MAIN CHAT AREA */}
            <div className="chat_window" style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                {/* HEADER */}
                <ChatHeader />

                {/* CONTENT AREA */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {activeSessionId ? (
                        <ChatMessages
                            messages={messages[activeSessionId] || []}
                        />
                    ) : (
                        <div style={{ padding: "20px", opacity: 0.6 }}>
                            Please select or create a chat session.
                        </div>
                    )}
                </div>

                {/* INPUT AREA */}
                {activeSessionId && (
                    <ChatInput
                        onSend={(text) => {
                            const sessionMsgs = messages[activeSessionId] || [];
                            const updated = {
                                ...messages,
                                [activeSessionId]: [...sessionMsgs, { sender: "user", text }]
                            };
                            setMessages(updated);
                        }}
                    />
                )}

            </div>
        </div>
    );
};

export default Chatbot;
