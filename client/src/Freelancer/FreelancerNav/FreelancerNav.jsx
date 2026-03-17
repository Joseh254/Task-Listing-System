import { FaEnvelope, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";

function FreelancerNav() {
  const navigate = useNavigate();

  const freelancerLinks = [
    { label: "Tasks", path: "/freelancer/tasks" },
    { label: "Messages", path: "/freelancer/messages", icon: <FaEnvelope /> },
    { label: "Earnings", path: "/freelancer/earnings", icon: <FaWallet /> },
    { label: "Profile", path: "/freelancer/profile" },
  ];

  function handleLogout() {
    localStorage.removeItem("user"); // better than clear()
    navigate("/", { replace: true }); // redirect to home
  }

  return (
    <ReusableNav
      logo="Freelancer"
      links={freelancerLinks}
      actions={[
        {
          label: "Logout",
          onClick: handleLogout,
          variant: "danger",
        },
      ]}
    />
  );
}

export default FreelancerNav;
