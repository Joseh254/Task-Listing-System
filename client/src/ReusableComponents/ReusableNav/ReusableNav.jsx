import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./ReusableNav.css";

function ReusableNav({ links, logo = "MyApp" }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">{logo}</div>

        {/* Desktop Menu */}
        <ul className="nav-links">
          {links.map((link, index) => (
            <li key={index}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>

        {/* Mobile Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      <ul className={`mobile-menu ${isOpen ? "active" : ""}`}>
        {links.map((link, index) => (
          <li key={index} onClick={toggleMenu}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ReusableNav;
