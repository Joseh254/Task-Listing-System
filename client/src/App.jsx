import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHomePage from "./Admin/AdminHomePage/AdminHome";
import CustomerHomePage from "./Customer/CustomerHomePage/CustomerHomePage";
import FreeLancerHomePage from "./Freelancer/FreelancerHomePage/FreeLancerHomePage";
import HomePage from "./Home/HomePage";
function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/freeLancer" element={<FreeLancerHomePage />} />
        <Route path="/customer" element={<CustomerHomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
