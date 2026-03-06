import React from "react";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";
function CustomerNav() {
  const adminLinks = [{ label: "Dashboard", path: "/" }];
  return (
    <>
      <ReusableNav links={adminLinks} logo="Contractor pannel" />
    </>
  );
}

export default CustomerNav;
