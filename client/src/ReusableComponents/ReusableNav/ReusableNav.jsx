import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./ReusableNav.css";

function ReusableNav({ links = [], logo = "MyApp", actions = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="reusable-navbar">
      <div className="reusable-nav-container">
        {/* Logo */}
        <div className="reusable-logo">{logo}</div>

        {/* Desktop Menu */}
        <ul className="reusable-nav-links">
          {links.map((link, index) => (
            <li key={index}>
              <Link to={link.path} className="reusable-nav-item">
                {link.icon && (
                  <span className="reusable-nav-icon">{link.icon}</span>
                )}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
          {/* Action Buttons (Desktop) */}
          {actions.length > 0 && (
            <div className="reusable-nav-actions">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`reusable-nav-button ${action.variant || ""}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </ul>

        {/* Mobile Icon */}
        <div className="reusable-menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      <ul className={`reusable-mobile-menu ${isOpen ? "reusable-active" : ""}`}>
        {links.map((link, index) => (
          <li key={index} onClick={toggleMenu}>
            <Link to={link.path} className="reusable-nav-item">
              <span>{link.label && link.label}</span>
              {link.icon && (
                <span className="reusable-nav-icon">{link.icon}</span>
              )}
            </Link>
          </li>
        ))}
        {actions.map((action, index) => (
          <li
            key={`action-${index}`}
            onClick={() => {
              action.onClick?.();
              toggleMenu();
            }}
          >
            <button className={`reusable-nav-button ${action.variant || ""}`}>
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ReusableNav;
