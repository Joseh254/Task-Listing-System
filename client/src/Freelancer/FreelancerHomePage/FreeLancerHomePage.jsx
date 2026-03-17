import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FreelancerNav from "../FreelancerNav/FreelancerNav";
import { useNavigate } from "react-router-dom";
import "./FreelancerHome.css";

/* ---------- Dashboard Cards ---------- */
function StatsCard({ title, value }) {
  return (
    <div className="stats-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}

/* ---------- Active Projects ---------- */

function ActiveProjects({ tasks }) {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return (
      <div className="section-card">
        <h3>Available Tasks</h3>
        <p>No tasks available</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3>Available Tasks</h3>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - ${task.price}
            <button
              className="take-btn"
              onClick={() => navigate(`/task/${task.id}`, { state: task })}
            >
              View Task
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
/* ---------- Recent Activity ---------- */
function RecentActivity() {
  return (
    <div className="section-card">
      <h3>Recent Activity</h3>
      <ul>
        <li>You received a new message</li>
        <li>Payment released</li>
        <li>Client left a review</li>
      </ul>
    </div>
  );
}
//submited tasks
function SubmittedTasks({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="section-card">
        <h3>Submitted Tasks</h3>
        <p>No submitted tasks</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3>Submitted Tasks</h3>

      <ul>
        {tasks.map((task) => {
          const submission = task.submissions?.[0];
          const submittedAt = submission?.createdAt
            ? new Date(submission.createdAt).toLocaleString()
            : null;
          return (
            <li key={task.id} className="task-item">
              <div>
                <strong>{task.title}</strong>

                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${task.Progress}%` }}
                  />
                  <span>{task.Progress}%</span>
                </div>

                {/* Client */}
                <p>
                  Client: <b>{task.customer?.firstName}</b>
                </p>

                {/* Message */}
                {submission?.message && (
                  <p>
                    Comment: <i>{submission.message}</i>
                  </p>
                )}
                {submittedAt && (
                  <p>
                    Submitted on: <b>{submittedAt}</b>
                  </p>
                )}
                {/* Files */}
                {submission?.files?.length > 0 && (
                  <div>
                    <p>Files:</p>
                    <ul>
                      {submission.files.map((file) => (
                        <li key={file.id}>
                          <a href={file.url} target="_blank">
                            View File
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <span className="submitted-badge">Submitted</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
// ACTIVE TASKD
function MyActiveTasks({ tasks }) {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return (
      <div className="section-card">
        <h3>My Active Tasks</h3>
        <p>You have no active tasks</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3>My Active Tasks</h3>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-info">
              <strong>{task.title}</strong>

              {/* Progress Bar */}
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${task.Progress || 0}%` }}
                />
                <span>{task.Progress || 0}%</span>
              </div>
            </div>

            <button
              className="take-btn"
              onClick={() => navigate(`/task-work/${task.id}`, { state: task })}
            >
              Continue Task
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Main Page ---------- */
function FreeLancerHomePage() {
  const [tasks, setTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/api/tasks/me/available",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      // console.log(response);

      if (response?.data) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data?.message || "Failed to fetch tasks");
      } else if (error.request) {
        toast.error("Server not responding");
      } else {
        toast.error("Something went wrong");
      }

      setTasks([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };
  //SUBMITED TASK
  const fetchSubmittedTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/api/task/freelancer/submitted",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      console.log("====================================");
      console.log(res, "submited task");
      console.log("====================================");

      setSubmittedTasks(res.data);
    } catch (error) {
      console.error(error);
      setSubmittedTasks([]);
    }
  };
  const fetchActiveTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/api/tasks/me/my-active",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      // console.log("====================================");
      // console.log(res);
      // console.log("====================================");
      setActiveTasks(res.data);
    } catch {
      setActiveTasks([]);
    }
  };
  useEffect(() => {
    fetchTasks();
    fetchActiveTasks();
    fetchSubmittedTasks();
  }, []);

  return (
    <>
      <FreelancerNav />

      <div className="dashboard-container">
        <h2 className="welcome-text">Welcome back 👋</h2>

        {/* Stats Section */}
        <div className="stats-grid">
          <StatsCard title="Available Tasks" value={tasks?.length || 0} />
          <StatsCard title="Active Tasks" value={activeTasks?.length || 0} />
          <StatsCard
            title="Submitted Tasks"
            value={submittedTasks?.length || 0}
          />
          <StatsCard title="Messages" value="0" />
          <StatsCard title="Rating" value="4.8 ★" />
        </div>

        {/* Loading */}
        {loading && <p>Loading dashboard...</p>}

        {/* Lower Sections */}
        {!loading && (
          <div className="content-grid">
            <>
              <ActiveProjects tasks={tasks} />
              <MyActiveTasks tasks={activeTasks} />
            </>
            <RecentActivity />
            <SubmittedTasks tasks={submittedTasks} />
          </div>
        )}
      </div>
    </>
  );
}

export default FreeLancerHomePage;
