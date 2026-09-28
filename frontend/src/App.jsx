import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import OurStoryPage from "./pages/OurStoryPage";
import MenuMainPage from "./pages/MenuMainPage";
import MenuDrinksDessertsPage from "./pages/MenuDrinksDessertsPage";
import DishDetailsPage from "./pages/DishDetailsPage";
import MyAccountPage from "./pages/MyAccountPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeamInfoPage from "./pages/TeamInfoPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/menu/main" element={<MenuMainPage />} />
        <Route path="/menu/drinks-desserts" element={<MenuDrinksDessertsPage />} />
        <Route path="/menu/:id" element={<DishDetailsPage />} />
        <Route
          path="/my-account"
          element={
            <ProtectedRoute>
              <MyAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/team" element={<TeamInfoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}
