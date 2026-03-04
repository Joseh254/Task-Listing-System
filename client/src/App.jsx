import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHomePage from "./Admin/AdminHomePage/AdminHome";
import CustomerHomePage from "./Customer/CustomerHomePage/CustomerHomePage";
import FreeLancerHomePage from "./Freelancer/FreelancerHomePage/FreeLancerHomePage";
import HomePage from "./Home/HomePage";
import Register from "./Register/Register";
import PendingApproval from "./PendingApproval/PendingApproval";
import Users from "./Admin/Users/Users";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Unauthorized from "./Unauthorized/Unauthorized";
function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification-pending" element={<PendingApproval />} />

        {/* 🔐 Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* 🔐 Freelancer Only */}
        <Route element={<ProtectedRoute allowedRoles={["freelancer"]} />}>
          <Route path="/freeLancer" element={<FreeLancerHomePage />} />
        </Route>

        {/* 🔐 Customer Only */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer" element={<CustomerHomePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
