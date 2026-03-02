import React, { useState } from "react";
import { FaHome } from "react-icons/fa";

import "./HomePage.css";
import Modal from "../ReusableComponents/OpenModal/OpenModal";
import Login from "../Login/Login";
import Register from "../Register/Register";
function Navbar({ openLogin, openRegister }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo (hidden on mobile) */}
      <div className="logo">TaskListing</div>

      {/* Desktop Links */}
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how">How It Works</a>
        <button className="nav-lgn" onClick={openLogin}>
          Login
        </button>
        <button className="nav-btn" onClick={openRegister}>
          Get Started
        </button>
      </div>

      {/* Mobile Icon */}
      <div className="mobile-home" onClick={() => setMobileOpen(!mobileOpen)}>
        <FaHome className="homeIcon" />
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <a href="#features" onClick={() => setMobileOpen(false)}>
            Features
          </a>
          <a href="#how" onClick={() => setMobileOpen(false)}>
            How It Works
          </a>
          <button
            onClick={() => {
              openLogin();
              setMobileOpen(false);
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              openRegister();
              setMobileOpen(false);
            }}
            className="mobile-btn"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}

/* ================= HERO ================= */
function Hero({ openRegister }) {
  return (
    <section className="hero">
      <h1>Post Tasks. Find Talent. Get Work Done.</h1>
      <p>
        A simple platform connecting clients and freelancers to complete tasks
        efficiently and securely.
      </p>
      <div className="hero-buttons">
        <button className="primary-btn" onClick={openRegister}>
          Join as Client
        </button>
        <button className="secondary-btn" onClick={openRegister}>
          Work as Freelancer
        </button>
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
function CTA({ openRegister }) {
  return (
    <section className="cta">
      <h2>Ready to Get Started?</h2>
      <p>Create an account and start posting or completing tasks today.</p>
      <button className="create-account" onClick={openRegister}>
        Create Account
      </button>
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
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <>
      <Navbar openLogin={openLogin} openRegister={openRegister} />

      <Hero openRegister={openRegister} />
      <Features />
      <HowItWorks />
      <CTA openRegister={openRegister} />
      <Footer />

      {/* Login Modal */}
      <Modal isOpen={showLogin} onClose={closeModal}>
        <Login />
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={showRegister} onClose={closeModal}>
        <Register />
      </Modal>
    </>
  );
}

export default HomePage;
