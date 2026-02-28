import React from "react";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";
function FreelancerNav() {
  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Settings", path: "/admin/settings" },
  ];
  return (
    <>
      <ReusableNav links={adminLinks} logo="Freelancer" />
    </>
  );
}

export default FreelancerNav;
