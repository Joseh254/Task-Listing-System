import React from "react";
import { FaHome, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";

import { useNavigate } from "react-router-dom";
function AdminNav() {
    const navigate = useNavigate();
  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard", icon: FaHome },
    { label: "Users", path: "/admin/users", icon: FaUsers },
    { label: "Settings", path: "/admin/settings", icon: FaCog },
{
  
}
  ]; 
  function handleLogout() {
    localStorage.removeItem("user"); // better than clear()
    navigate("/", { replace: true }); // redirect to home
  }
  return <ReusableNav links={adminLinks} logo="Admin Panel"
         actions={[
        {
          label: "Logout",
          onClick: handleLogout,
          variant: "danger",
        }
      ]}
  />;
}

export default AdminNav;
 