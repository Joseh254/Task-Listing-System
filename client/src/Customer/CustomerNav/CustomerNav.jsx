import React from "react";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";
function CustomerNav() {
  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Settings", path: "/admin/settings" },
  ];
  return (
    <>
      <ReusableNav links={adminLinks} logo="Contractor pannel" />
    </>
  );
}

export default CustomerNav;
