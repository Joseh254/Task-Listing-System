import React from "react";
import { FaHome, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";

function AdminNav() {
  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard", icon: FaHome },
    { label: "Users", path: "/admin/users", icon: FaUsers },
    { label: "Settings", path: "/admin/settings", icon: FaCog },
    { label: "Logout", path: "/logout", icon: FaSignOutAlt },
  ];

  return (
    <ReusableNav 
      links={adminLinks} 
      logo="Admin Panel"
    />
  );
}

export default AdminNav;