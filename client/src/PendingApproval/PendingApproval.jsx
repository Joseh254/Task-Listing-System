import React from "react";
import styles from "./PendingApproval.module.css";
import { FaClock } from "react-icons/fa";

const PendingApproval = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FaClock className={styles.icon} />
        <h1 className={styles.title}>Account Under Review</h1>
        <p className={styles.message}>
          Thank you for registering! Your account is currently under review.
          Once verified by the admin, you will be able to access your dashboard.
        </p>
        <p className={styles.note}>
          This process usually takes a few hours to 1 business day.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;
