import React from "react";

const HeroSection = () => {
  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.accentLine} />

        <h1 style={styles.heading}>
          Welcome to MediAI
        </h1>

        <p style={styles.subheading}>
          How are you feeling today?
        </p>

        <p style={styles.description}>
          A calm, intelligent space designed to help you understand,
          express, and take care of your mental well-being.
        </p>
      </div>
    </section>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "32px",
  },

  card: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 16px",
    padding: "48px 32px",
    borderRadius: "28px",
    background: "linear-gradient(135deg, #eef4ff, #f9fbff)",
    boxShadow: "0 20px 40px rgba(30, 64, 175, 0.08)",
    textAlign: "center",
    position: "relative",
  },

  accentLine: {
    width: "60px",
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    borderRadius: "8px",
    margin: "0 auto 24px auto",
  },

  heading: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },

  subheading: {
    marginTop: "12px",
    fontSize: "18px",
    fontWeight: "500",
    color: "#334155",
  },

  description: {
    marginTop: "18px",
    maxWidth: "620px",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#475569",
  },
};

export default HeroSection;