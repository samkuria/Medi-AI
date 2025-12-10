import React from 'react';
import propTypes from 'prop-types';
import './ChatSidebar.css';
import Logo from '../../assets/MediAI_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


const ChatSidebar = ({
  sessions,
  activeSessionId,
  sidebarCollapsed,
  onSelectSession,
  onNewSession,
  onToggleCollapse
}) => {
    return (
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed': ''}`}>
            <div className='sidebar-header'>
                <img src={Logo} alt="MediAI Logo" className="sidebar-logo" />
                <button className="collapse-btn" onClick={onToggleCollapse}>
                    <FontAwesomeIcon icon={sidebarCollapsed ? faChevronRight : faChevronLeft} />
                </button>
            </div>

            <div className="new-chat-container">
                <button className="new-chat-btn" onClick={onNewSession}>
                    + New Chat
                </button>
            </div>

            <div className="session-list">
                {sessions.length === 0? (
                    <p className="no-sessions">No chat sessions yet.</p>
                ): (
                    sessions.map((session) => (
                        <div 
                            key={session.id}
                            className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                            onClick={() => onSelectSession(session.id)}
                        >
                            {session.title}
                        </div>
                    ))
                )}
            </div>
        </div>
    )

};
ChatSidebar.propTypes = {
  sessions: propTypes.array.isRequired,
  activeSessionId: propTypes.oneOfType([propTypes.string, propTypes.number]),
  sidebarCollapsed: propTypes.bool,
  onSelectSession: propTypes.func.isRequired,
  onNewSession: propTypes.func.isRequired,
  onToggleCollapse: propTypes.func.isRequired,
};
export default ChatSidebar;
