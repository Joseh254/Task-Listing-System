import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Unauthorized.module.css";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🚫 Access Denied</h1>
        <p className={styles.message}>
          You do not have permission to view this page.
        </p>
        <button className={styles.button} onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
