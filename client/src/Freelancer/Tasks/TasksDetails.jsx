import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./TaskDetails.module.css";

function TaskDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state;

  const takeTask = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/api/tasks/take/${task.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      console.log("====================================");

      console.log("====================================");
      //   toast.success("Task taken successfully");

      navigate(`/task-work/${task.id}`, { state: task });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to take task");
    }
  };

  if (!task) {
    return (
      <div className={styles.container}>
        <p>No task data found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>{task.title}</h2>

        <div className={styles.meta}>
          <span>Posted by {task.customer.firstName}</span>
          <span className={styles.price}>${task.price}</span>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Task Description</p>
          <div className={styles.description}>{task.description}</div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Category</p>
          <p>{task.category}</p>
        </div>

        <div className={styles.buttons}>
          <button className={styles.takeBtn} onClick={takeTask}>
            Take This Task
          </button>

          <button
            className={styles.backBtn}
            onClick={() => navigate("/freelancer-dashboard")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
