import FreelancerNav from "../FreelancerNav/FreelancerNav";
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
function ActiveProjects() {
  return (
    <div className="section-card">
      <h3>Active Projects</h3>
      <ul>
        <li>Website Redesign - Due in 5 days</li>
        <li>Mobile App UI - In Review</li>
        <li>Landing Page - Completed</li>
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
        <li>Payment of $500 released</li>
        <li>Client left a 5★ review</li>
      </ul>
    </div>
  );
}

/* ---------- Main Page ---------- */
function FreeLancerHomePage() {
  return (
    <>
      <FreelancerNav />

      <div className="dashboard-container">
        <h2 className="welcome-text">Welcome back 👋</h2>

        {/* Stats Section */}
        <div className="stats-grid">
          <StatsCard title="Total Earnings" value="$2,450" />
          <StatsCard title="Active Tasks" value="3" />
          <StatsCard title="New Messages" value="2" />
          <StatsCard title="Rating" value="4.8 ★" />
        </div>

        {/* Lower Sections */}
        <div className="content-grid">
          <ActiveProjects />
          <RecentActivity />
        </div>
      </div>
    </>
  );
}

export default FreeLancerHomePage;
