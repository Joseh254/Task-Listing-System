import { FaEnvelope, FaWallet } from "react-icons/fa";
import ReusableNav from "../../ReusableComponents/ReusableNav/ReusableNav";

function FreelancerNav() {
  const freelancerLinks = [
    { label: "Tasks", path: "/freelancer/tasks" },
    { label: "Messages", path: "/freelancer/messages", icon: <FaEnvelope /> },
    { label: "Earnings", path: "/freelancer/earnings", icon: <FaWallet /> },
    { label: "Profile", path: "/freelancer/profile" },
  ];

  return <ReusableNav logo="Freelancer" links={freelancerLinks} />;
}

export default FreelancerNav;
