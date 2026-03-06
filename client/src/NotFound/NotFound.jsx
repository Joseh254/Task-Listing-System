import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>

        <h2 className={styles.title}>Page Not Found</h2>

        <p className={styles.text}>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <button className={styles.homeBtn} onClick={() => navigate("/")}>
          <FaHome /> Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
