import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../AdminNav/AdminNav";
import "./AdminHomePage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------- Stat Card ---------- */
function StatCard({ title, value }) {
  return (
    <div className="admin-stat-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}

/* ---------- Pending Requests ---------- */
function PendingRequests({ tasks, approveTask, loading }) {
  const pendingTasks = tasks.filter((task) => !task.approved);

  if (loading) return <p>Loading pending requests...</p>;

  return (
    <div className="admin-section-card pending-requests">
      <h3>Pending Job Requests</h3>

      {pendingTasks.length === 0 && <p>No pending tasks</p>}

      <ul>
        {pendingTasks &&
          pendingTasks.map((task) => (
            <li key={task.id}>
              {task.title} - ${task.price}
              <div className="actions">
                <button
                  className="approve"
                  onClick={() => approveTask(task.id)}
                >
                  Approve
                </button>

                <button className="reject">Reject</button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

/* ---------- Freelancer Performance ---------- */
function FreelancerStats({ users }) {
  const freelancers = users.filter((u) => u.role === "freelancer");

  return (
    <div className="admin-section-card freelancer-performance">
      <h3>Freelancer Performance</h3>

      <ul>
        {freelancers.slice(0, 5).map((freelancer) => (
          <li key={freelancer.id}>
            {freelancer.firstName} {freelancer.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Platform Activity ---------- */
function PlatformOverview({ tasks, users }) {
  return (
    <div className="admin-section-card platform-overview">
      <h3>Platform Overview</h3>

      <ul>
        <li>{users.length} total users</li>
        <li>{tasks.filter((t) => t.approved).length} jobs approved</li>
        <li>{tasks.filter((t) => t.completed).length} tasks completed</li>
      </ul>
    </div>
  );
}

/* ---------- Active Tasks ---------- */
function ActiveTasks({ tasks }) {
  const activeTasks = tasks.filter((t) => t.taken && !t.completed);

  return (
    <div className="admin-section-card active-tasks">
      <h3>Active Tasks Monitoring</h3>

      <ul>
        {activeTasks.slice(0, 5).map((task) => (
          <li key={task.id}>
            <div>
              <strong>{task.title}</strong>
              <p>{task.category}</p>
            </div>

            <span className="status in-progress">
              {task.Progress || 0}% Progress
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Task Progress ---------- */
function TaskProgressOverview({ tasks }) {
  const progressTasks = tasks.filter((t) => t.taken);

  return (
    <div className="admin-section-card task-progress">
      <h3>Task Progress Overview</h3>

      {progressTasks.slice(0, 5).map((task) => (
        <div className="progress-item" key={task.id}>
          <p>{task.title}</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${task.Progress || 0}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Top Freelancers ---------- */
function TopFreelancers({ users }) {
  const freelancers = users.filter((u) => u.role === "freelancer");

  return (
    <div className="admin-section-card top-freelancers">
      <h3>Top Performing Freelancers</h3>

      <ul>
        {freelancers.slice(0, 5).map((freelancer) => (
          <li key={freelancer.id}>
            {freelancer.firstName} {freelancer.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Main Admin Page ---------- */
function AdminHomePage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Data ---------- */
  const fetchData = async () => {
    try {
      setLoading(true);

      const tasksRes = await axios.get(
        "http://localhost:3000/api/tasks/all-tasks",
        { withCredentials: true },
      );
      console.log(tasksRes, "taskresponse");

      const usersRes = await axios.get("http://localhost:3000/api/users", {
        withCredentials: true,
      });

      setTasks(tasksRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Approve Task ---------- */
  const approveTask = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/verify/${id}`,
        { approved: true },
        { withCredentials: true },
      );

      toast.success("Task approved successfully");

      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve task");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="admin-dashboard-container">
          <h2>Loading Dashboard...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNav />

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="admin-dashboard-container">
        <h2 className="admin-title">Admin Dashboard</h2>

        {/* Stats */}
        <div className="admin-stats-grid">
          <StatCard
            title="Total Clients"
            value={users && users.filter((u) => u.role === "customer").length}
          />

          <StatCard
            title="Active Freelancers"
            value={users && users.filter((u) => u.role === "freelancer").length}
          />

          <StatCard
            title="Pending Requests"
            value={tasks && tasks.filter((t) => !t.approved).length}
          />

          <StatCard title="Total Published Jobs" value={tasks.length} />
        </div>

        {/* Content */}
        <div className="admin-content-grid">
          <PendingRequests
            tasks={tasks}
            approveTask={approveTask}
            loading={loading}
          />

          <FreelancerStats users={users} />

          <ActiveTasks tasks={tasks} />

          <TaskProgressOverview tasks={tasks} />

          <TopFreelancers users={users} />

          <PlatformOverview tasks={tasks} users={users} />
        </div>
      </div>
    </>
  );
}

export default AdminHomePage;
