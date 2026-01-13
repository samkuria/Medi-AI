import React from 'react';
import logo from '../../assets/MediAI_logo.png';

const Header = ({ onMenuClick }) => {
    return (
        <header style={styles.header}>
            <div style={styles.left}>
                <button onClick={onMenuClick} style={styles.menuBtn}>☰</button>
                <img src={logo} alt="MediAI logo" style={styles.logo} />
                <span style={styles.title}>Dashboard</span>
            </div>
        </header>
    );
};
const styles = {
    header: {
        height: "60px",
        display: "flex",
        alignItems: "centre",
        padding: "0 16px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eee",
    },
    left: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    menuBtn: {
        fontSize: "24px",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    logo: {
        height: "32px",
        width: "auto",
    },
    title: {
        fontSize: "16px",
        fontWeight: "500",
        color: "#555",
    },
};
export default Header;