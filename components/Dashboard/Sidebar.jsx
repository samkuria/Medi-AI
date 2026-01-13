import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <aside style={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.brand}>MediAI</span>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <nav style={styles.nav}>
          <SidebarItem
            label="Dashboard"
            onClick={() => handleNavigate("/")}
          />
          <SidebarItem
            label="Chatbot"
            onClick={() => handleNavigate("/chat")}
          />
          <SidebarItem label="Profiles" />
          <SidebarItem label="Settings" />
        </nav>
      </aside>
    </div>
  );
};

const SidebarItem = ({ label, onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        ...styles.item,
        backgroundColor: hovered ? "#dde5f0" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 1000,
  },
  sidebar: {
    width: "260px",
    height: "100%",
    background: "linear-gradient(180deg, #f7f9fc, #eef2f7)",
    padding: "24px 20px",
    borderTopRightRadius: "20px",
    borderBottomRightRadius: "20px",
    boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  brand: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2b3a55",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#555",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  item: {
    padding: "12px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    color: "#2b3a55",
    transition: "background 0.2s ease",
  },
};

export default Sidebar;