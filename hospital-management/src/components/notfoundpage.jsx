import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
    color: "#333",
    textAlign: "center",
    fontFamily: "'Arial', sans-serif",
  },
  heading: {
    fontSize: "3em",
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: "20px",
  },
  message: {
    fontSize: "1.2em",
    color: "#666",
    marginBottom: "20px",
  },
  link: {
    display: "inline-block",
    padding: "12px 24px",
    fontSize: "1.1em",
    textDecoration: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    border: "1px solid #007bff",
    transition: "all 0.3s ease",
  },
  linkHover: {
    backgroundColor: "#0056b3",
    borderColor: "#0056b3",
  },
};

// Adding hover effect to the link
const handleLinkHover = (e) => {
  e.target.style.backgroundColor = styles.linkHover.backgroundColor;
  e.target.style.borderColor = styles.linkHover.borderColor;
};

const handleLinkLeave = (e) => {
  e.target.style.backgroundColor = styles.link.backgroundColor;
  e.target.style.borderColor = styles.link.borderColor;
};

export default NotFoundPage;
