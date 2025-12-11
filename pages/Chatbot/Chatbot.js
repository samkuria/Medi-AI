import React, { useState, useEffect } from 'react';
import ChatHeader from '../../components/Chatbot/ChatHeader';
import ChatSidebar from '../../components/Chatbot/ChatSidebar';
import ChatMessages from '../../components/Chatbot/ChatMessages';
import ChatInput from '../../components/Chatbot/ChatInput';
import './Chatbot.css';
import axios from 'axios';
import { set } from 'date-fns';

const USER_ID = "anonymous"; 


const Chatbot = () => {
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [messages, setMessages] = useState({});
    const [isBotTyping, setIsBotTyping] = useState(false);

    // Load sessions from Firebase on mount
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/chatbot/get_sessions/${USER_ID}`);
                const fetchedSessions = res.data || {};
                const sessionList = Object.keys(fetchedSessions).map(key => ({
                    id: key,
                    title: fetchedSessions[key].session_name
                }));
                setSessions(sessionList);

                // Load messages for first session
                if (sessionList.length > 0) {
                    setActiveSessionId(sessionList[0].id);
                    loadMessages(sessionList[0].id);
                }
            } catch (error) {
                console.error("Error fetching sessions:", error);
            }
        };

        fetchSessions();
    }, []);

    // Load messages for a session
    const loadMessages = async (sessionId) => {
        try {
            const res = await axios.post(`http://localhost:5000/chatbot/get_messages`, {
                user_id: USER_ID,
                session_id: sessionId
            });
            const fetchedMessages = res.data || {};
            const msgsArray = Object.values(fetchedMessages).map(msg => ({
                ...msg,
                id: msg.timestamp // simple unique id
            }));
            setMessages(prev => ({ ...prev, [sessionId]: msgsArray }));
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };

    // CREATE NEW SESSION
    const handleNewSession = async () => {
        const localId = Date.now();
        const sessionName =`New Chat ${sessions.length + 1}`;

        const newSession = { id: localId, title: sessionName };
        setSessions(prev => [...prev, newSession]);
        setActiveSessionId(localId);
        setMessages(prev => ({ ...prev, [localId]: [] }));
        try {
            const res = await axios.post("http://localhost:5000/chatbot/create_session", {
                user_id: USER_ID,
                session_name: sessionName
            });
            const firebaseId = res.data.session_id;
            setSessions(prev =>
                prev.map(s =>
                    s.id === localId ? { ...s, id: firebaseId } : s
                )
            );

            setMessages(prev => {
                const msgs = {...prev };
                msgs[firebaseId] = msgs[localId];
                delete msgs[localId];
                return msgs;
            });
            setActiveSessionId(firebaseId);
        } catch (error) {
            console.error("Error creating session:", error);
        }
    };

    // SELECT SESSION
    const handleSelectSession = (sessionId) => {
        setActiveSessionId(sessionId);
        if (!messages[sessionId]) {
            loadMessages(sessionId);
        }
    };

    // DELETE SESSION
    const handleDeleteSession = async () => {
        if (!activeSessionId) return;

        try {
            await axios.delete("http://localhost:5000/chatbot/delete_session", {
                data: {
                    user_id: USER_ID,
                    session_id: activeSessionId
                }
            });
            // Optionally, implement a backend route to delete session in Firebase
            setSessions(prev => prev.filter(s => s.id !== activeSessionId));
            const updatedMessages = { ...messages };
            delete updatedMessages[activeSessionId];
            setMessages(updatedMessages);
            setActiveSessionId(null);
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    // RENAME SESSION
    const handleRenameSession = async (newTitle) => {
        if (!activeSessionId) return;

        try {
            // Optionally, implement a backend route to rename session in Firebase
            setSessions(prev =>
                prev.map(s =>
                    s.id === activeSessionId ? { ...s, title: newTitle } : s
                )
            );
            await axios.patch("http://localhost:5000/chatbot/rename_session", {
                user_id: USER_ID,
                session_id: activeSessionId,
                session_name: newTitle
            });
        } catch (error) {
            console.error("Error renaming session:", error);
        }
    };

    // TOGGLE SIDEBAR
    const handleToggleCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // SEND MESSAGE
    const handleSendMessage = async (text) => {
        if (!activeSessionId) return;

        const userMsg = {
            id: Date.now(),
            sender: "user",
            text,
            timestamp: Date.now()
        };

        // Update local messages immediately
        setMessages(prev => ({
            ...prev,
            [activeSessionId]: [...(prev[activeSessionId] || []), userMsg]
        }));
        setIsBotTyping(true);

        try {
            const res = await axios.post("http://localhost:5000/chatbot/send_message", {
                user_id: USER_ID,
                session_id: activeSessionId,
                message: text
            });

            const botMsg = {
                id: Date.now() + 1,
                sender: "bot",
                text: res.data.reply,
                timestamp: Date.now()
            };

            setMessages(prev => ({
                ...prev,
                [activeSessionId]: [...(prev[activeSessionId] || []), botMsg]
            }));
        } catch (error) {
            console.error("Error sending message:", error);
        } finally{ setIsBotTyping(false);}
    };

    return (
        <div className="chatbot-container" style={{ display: "flex", height: "100vh" }}>
            <ChatSidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                sidebarCollapsed={sidebarCollapsed}
                onSelectSession={handleSelectSession}
                onNewSession={handleNewSession}
                onToggleCollapse={handleToggleCollapse}
            />

            <div className="chat_window" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <ChatHeader
                    activeSession={sessions.find(s => s.id === activeSessionId)}
                    onDeleteSession={handleDeleteSession}
                    onRenameSession={handleRenameSession}
                />

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {activeSessionId ? (
                        <ChatMessages messages={messages[activeSessionId] || []} isBotTyping={isBotTyping}/>
                    ) : (
                        <div style={{ padding: "20px", opacity: 0.6 }}>
                            Please select or create a chat session.
                        </div>
                    )}
                </div>


