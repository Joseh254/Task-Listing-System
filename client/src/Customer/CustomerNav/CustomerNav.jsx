import React from "react";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";
function CustomerNav() {
  const adminLinks = [{ label: "Dashboard", path: "/" }];
  function handleLogout() {
    localStorage.removeItem("user"); // better than clear()
    navigate("/", { replace: true }); // redirect to home
  }
  return (
    <>
      <ReusableNav
        links={adminLinks}
        logo="Contractor pannel"
        actions={[
          {
            label: "Logout",
            onClick: handleLogout,
            variant: "danger",
          },
        ]}
      />
    </>
  );
}

export default CustomerNav;
