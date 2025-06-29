// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import views dari struktur MVP yang baru
import LoginView from "./pages/login/view/LoginView";
import RegisterView from "./pages/register/view/RegisterView";
import DashboardView from "./pages/dashboard/view/DashboardView";
import ProfileView from "./pages/profile/view/ProfileView";
import KatalogView from "./pages/katalog/view/KatalogView";
import DetailAtkView from "./pages/detailatk/view/DetailAtkView";
import KeranjangView from "./pages/keranjang/view/KeranjangView";
import CheckoutView from "./pages/checkout/view/CheckoutView";
import PaymentView from "./pages/payment/view/PaymentView";
import PesananView from "./pages/pesanan/view/PesananView";
import PesananDetailView from "./pages/pesanan/view/PesananDetailView";

import "@fontsource/inter";

// Layout utama yang mencakup Navbar dan Footer
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Ini akan merender komponen route anak */}
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route tanpa layout utama (misal: halaman autentikasi) */}
        <Route path="/" element={<LoginView />} />{" "}
        {/* Halaman landing default */}
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        {/* Route dengan layout utama (Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/katalog" element={<KatalogView />} />
          {/* Route untuk detail ATK */}
          <Route path="/atk/:slug" element={<DetailAtkView />} />
          <Route path="/keranjang" element={<KeranjangView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/payment/:orderId" element={<PaymentView />} />
          {/* Route untuk pesanan */}
          <Route path="/pesanan" element={<PesananView />} />
          <Route
            path="/pesanan/detail/:orderId"
            element={<PesananDetailView />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
