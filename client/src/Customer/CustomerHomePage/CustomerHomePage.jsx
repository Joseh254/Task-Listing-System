import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./CustomerPage.module.css";
import CustomerNav from "../CustomerNav/CustomerNav";

function CustomerHomePage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);

  const API = "http://localhost:3000/api/tasks";

  // ---------------- FETCH TASKS
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/my-tasks`, {
        withCredentials: true,
      });

      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ---------------- FORM
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingTask) {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === editingTask.id ? { ...t, ...values } : t,
            ),
          );

          await axios.patch(`${API}/update/${editingTask.id}`, values, {
            withCredentials: true,
          });

          toast.success("Task updated");
        } else {
          const tempTask = {
            id: Date.now(),
            ...values,
            approved: false,
            completed: false,
            Progress: 0,
          };

          setTasks((prev) => [tempTask, ...prev]);

          const res = await axios.post(`${API}/create`, values, {
            withCredentials: true,
          });

          setTasks((prev) =>
            prev.map((t) => (t.id === tempTask.id ? res.data : t)),
          );

          toast.success("Task published");
        }

        resetForm();
        setShowModal(false);
        setEditingTask(null);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Operation failed");
      }
    },
  });

  // ---------------- DELETE
  const handleDelete = async (id) => {
    const prev = [...tasks];
    setTasks((p) => p.filter((t) => t.id !== id));

    try {
      await axios.delete(`${API}/delete/${id}`, { withCredentials: true });
      toast.success("Task deleted");
    } catch (err) {
      console.error(err);
      setTasks(prev);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ---------------- EDIT
  const openEdit = (task) => {
    setEditingTask(task);
    formik.setValues({
      title: task.title,
      description: task.description,
      price: task.price,
      category: task.category,
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    formik.resetForm();
    setShowModal(true);
  };

  // ---------------- TRUNCATE
  const truncate = (text, len = 120) => {
    if (!text) return "";
    return text.length > len ? text.slice(0, len) + "..." : text;
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <CustomerNav />

      <div className={styles.main}>
        <div className={styles.header}>
          <h2>My Tasks</h2>

          <button onClick={openCreate} className={styles.createBtn}>
            + Publish Job
          </button>
        </div>

        {loading && <p>Loading tasks...</p>}

        <div className={styles.tasks}>
          {tasks.map((task) => (
            <div key={task.id} className={styles.taskCard}>
              <h3>{task.title}</h3>

              <p>
                {truncate(task.description)}
                {task.description?.length > 120 && (
                  <span
                    className={styles.readMore}
                    onClick={() => setSelectedTask(task)}
                  >
                    Read more
                  </span>
                )}
              </p>

              <p>💰 ${task.price}</p>
              <p>📁 {task.category}</p>

              <p>
                Status:
                {task.approved ? (
                  <span className={styles.approved}> Approved</span>
                ) : (
                  <span className={styles.pending}> Pending</span>
                )}
              </p>

              <p>Completed: {task.completed ? "Yes" : "No"}</p>

              <div className={styles.progressBar}>
                <div
                  style={{ width: `${task.Progress || 0}%` }}
                  className={styles.progress}
                />
              </div>
              <p
                style={{
                  width: `${task.progress || 0}%`,
                  backgroundColor: "green",
                }}
              >
                {task.progress || 0}%
              </p>

              <div className={styles.actions}>
                <button onClick={() => openEdit(task)} className={styles.edit}>
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task.id)}
                  className={styles.delete}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------- CREATE / EDIT MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{editingTask ? "Edit Task" : "Create Task"}</h3>

            <form onSubmit={formik.handleSubmit} className={styles.form}>
              <input
                name="title"
                placeholder="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
                required
              />

              <input
                name="category"
                placeholder="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                required
              />

              <div className={styles.modalActions}>
                <button type="submit" className={styles.submit}>
                  {editingTask ? "Update" : "Publish"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------- DESCRIPTION MODAL */}
      {selectedTask && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedTask(null)}
        >
          <div className={styles.modal}>
            <h3>{selectedTask.title}</h3>

            <p>{selectedTask.description}</p>

            <button
              onClick={() => setSelectedTask(null)}
              className={styles.cancel}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerHomePage;
