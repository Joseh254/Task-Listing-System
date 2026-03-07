import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./TaskWork.module.css";

function TaskWork() {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [progress, setProgress] = useState("");
  const [currentProgress, setCurrentProgress] = useState(0);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:3000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setTask(res.data);
      setCurrentProgress(res.data.Progress || 0);
    } catch (error) {
      toast.error("Failed to load task");
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const updateProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `http://localhost:3000/api/tasks/progress/${id}`,
        { progress: Number(progress) },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      setCurrentProgress(res.data.Progress);
      setProgress("");

      toast.success("Progress updated");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const completeTask = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/api/tasks/complete/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      setCurrentProgress(100);
      toast.success("Task completed");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  if (!task) return <p>Loading task...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>{task.title}</h2>

        <p>Client: {task.customer?.firstName}</p>
        <p>Price: ${task.price}</p>

        <p>{task.description}</p>

        <h4>Progress {currentProgress}%</h4>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>

        <input
          type="number"
          placeholder="Enter progress"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />

        <button onClick={updateProgress}>Update Progress</button>

        <button onClick={completeTask}>Complete Task</button>
      </div>
    </div>
  );
}

export default TaskWork;
