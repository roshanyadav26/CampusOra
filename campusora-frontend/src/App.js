import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import RoomDetails from "./pages/RoomDetails";
import MyRooms from "./pages/MyRooms";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Chat from "./pages/Chat";
import OwnerDashboard from "./pages/OwnerDashboard";
import ChangePassword from "./pages/ChangePassword"; // ⭐ ADD THIS
import ForgotPassword from "./pages/forgotPassword";
function Layout() {
  const location = useLocation();

  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-rooms" element={<MyRooms />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* 🔥 CHANGE PASSWORD ROUTES */}
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/changePassword/:token" element={<ChangePassword />} />

        {/* PUBLIC ROOM DETAILS */}
        <Route path="/room/:id" element={<RoomDetails />} />

        {/* PROTECTED */}
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-room"
          element={
            <ProtectedRoute>
              <AddRoom />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Layout />
    </BrowserRouter>
  );
}

export default App;