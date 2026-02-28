import React from "react";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";
function AdminNav() {
  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Settings", path: "/admin/settings" },
  ];
  return (
    <>
      <ReusableNav links={adminLinks} logo="Admin Panel" />
    </>
  );
}

export default AdminNav;
