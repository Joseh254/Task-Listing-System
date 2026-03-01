import React from "react";
import "./HomePage.css";

/* ================= NAVBAR ================= */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">TaskFlow</div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how">How It Works</a>
        <a href="/login">Login</a>
        <a href="/register" className="nav-btn">Get Started</a>
      </div>
    </nav>
  );
}

/* ================= HERO ================= */
function Hero() {
  return (
    <section className="hero">
      <h1>Post Tasks. Find Talent. Get Work Done.</h1>
      <p>
        A simple platform connecting clients and freelancers to complete tasks
        efficiently and securely.
      </p>
      <div className="hero-buttons">
        <a href="/register" className="primary-btn">
          Join as Client
        </a>
        <a href="/register" className="secondary-btn">
          Work as Freelancer
        </a>
      </div>
    </section>
  );
}

/* ================= FEATURES ================= */
function Features() {
  return (
    <section id="features" className="section">
      <h2>Why Choose TaskFlow?</h2>
      <div className="grid">
        <div className="card">
          <h3>Secure Payments</h3>
          <p>Protected transactions for every completed task.</p>
        </div>
        <div className="card">
          <h3>Verified Users</h3>
          <p>Admins monitor activity to ensure trust and safety.</p>
        </div>
        <div className="card">
          <h3>Fast Hiring</h3>
          <p>Post a job and receive proposals within minutes.</p>
        </div>
      </div>
    </section>
  );
}

/* ================= HOW IT WORKS ================= */
function HowItWorks() {
  return (
    <section id="how" className="section alt-section">
      <h2>How It Works</h2>
      <div className="grid">
        <div className="card">
          <h3>1. Post a Task</h3>
          <p>Clients describe their work and set a budget.</p>
        </div>
        <div className="card">
          <h3>2. Get Proposals</h3>
          <p>Freelancers submit offers and timelines.</p>
        </div>
        <div className="card">
          <h3>3. Complete & Pay</h3>
          <p>Select the best freelancer and release payment securely.</p>
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function CTA() {
  return (
    <section className="cta">
      <h2>Ready to Get Started?</h2>
      <p>Create an account and start posting or completing tasks today.</p>
      <a href="/register" className="primary-btn">
        Create Account
      </a>
    </section>
  );
}

/* ================= FOOTER ================= */
function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
    </footer>
  );
}

/* ================= MAIN ================= */
function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

export default HomePage;