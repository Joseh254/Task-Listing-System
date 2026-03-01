import React from "react";
import AdminNav from "../AdminNav/AdminNav";
import "./AdminHomePage.css";

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
function PendingRequests() {
  return (
    <div className="admin-section-card pending-requests">
      <h3>Pending Job Requests</h3>
      <ul>
        <li>
          Website Development - $800
          <div className="actions">
            <button className="approve">Approve</button>
            <button className="reject">Reject</button>
          </div>
        </li>
        <li>
          Mobile App UI - $1200
          <div className="actions">
            <button className="approve">Approve</button>
            <button className="reject">Reject</button>
          </div>
        </li>
      </ul>
    </div>
  );
}

/* ---------- Freelancer Performance ---------- */
function FreelancerStats() {
  return (
    <div className="admin-section-card freelancer-performance">
      <h3>Freelancer Performance</h3>
      <ul>
        <li>John Doe - 12 tasks completed</li>
        <li>Jane Smith - 9 tasks completed</li>
        <li>Michael - 15 tasks completed</li>
      </ul>
    </div>
  );
}

/* ---------- Platform Activity ---------- */
function PlatformOverview() {
  return (
    <div className="admin-section-card  platform-overview">
      <h3>Platform Overview</h3>
      <ul>
        <li>New user registered</li>
        <li>3 jobs approved today</li>
        <li>2 payments processed</li>
      </ul>
    </div>
  );
}
function ActiveTasks() {
  return (
    <div className="admin-section-card active-tasks">
      <h3>Active Tasks Monitoring</h3>
      <ul>
        <li>
          <div>
            <strong>Landing Page Design</strong>
            <p>John Doe</p>
          </div>
          <span className="status in-progress">In Progress</span>
        </li>

        <li>
          <div>
            <strong>E-commerce Backend</strong>
            <p> Jane Smith</p>
          </div>
          <span className="status review">Under Review</span>
        </li>

        <li>
          <div>
            <strong>Logo Design</strong>
            <p> Michael</p>
          </div>
          <span className="status completed">Completed</span>
        </li>
      </ul>
    </div>
  );
}

function TaskProgressOverview() {
  return (
    <div className="admin-section-card task-progress">
      <h3>Task Progress Overview</h3>

      <div className="progress-item">
        <p>Website Redesign</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "70%" }}></div>
        </div>
      </div>

      <div className="progress-item">
        <p>Mobile App UI</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "45%" }}></div>
        </div>
      </div>
    </div>
  );
}

function TopFreelancers() {
  return (
    <div className="admin-section-card top-freelancers">
      <h3>Top Performing Freelancers</h3>
      <ul>
        <li>John Doe ⭐ 4.9 (15 tasks)</li>
        <li>Michael ⭐ 4.8 (12 tasks)</li>
        <li>Jane Smith ⭐ 4.7 (10 tasks)</li>
      </ul>
    </div>
  );
}
/* ---------- Main Admin Page ---------- */
function AdminHomePage() {
  return (
    <>
      <AdminNav />

      <div className="admin-dashboard-container">
        <h2 className="admin-title">Admin Dashboard</h2>

        {/* Stats Overview */}
        <div className="admin-stats-grid">
          <StatCard title="Total Clients" value="124" />
          <StatCard title="Active Freelancers" value="45" />
          <StatCard title="Pending Requests" value="6" />
          <StatCard title="Total Published Jobs" value="38" />
        </div>

        {/* Main Content */}
        <div className="admin-content-grid">
          <PendingRequests />
          <FreelancerStats />
          <ActiveTasks />
          <TaskProgressOverview />
          <TopFreelancers />
          <PlatformOverview />
        </div>
      </div>
    </>
  );
}

export default AdminHomePage;
