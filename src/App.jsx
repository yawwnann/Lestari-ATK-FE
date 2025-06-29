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
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import KatalogPage from "./pages/KatalogPage";
import DetailAtkPage from "./pages/DetailAtkPage";
import KeranjangPage from "./pages/KeranjangPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import PesananPage from "./pages/PesananPage";
import PesananDetailPage from "./pages/PesananDetailPage";

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
        <Route path="/" element={<LoginPage />} />{" "}
        {/* Halaman landing default */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Route dengan layout utama (Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/katalog" element={<KatalogPage />} />
          {/* <--- DIUBAH: dari /pupuk/:slug ke /atk/:slug */}
          <Route path="/atk/:slug" element={<DetailAtkPage />} />{" "}
          {/* <--- Menggunakan DetailAtkPage */}
          <Route path="/keranjang" element={<KeranjangPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          {/* <--- DIUBAH: dari /PesananPage ke /pesanan untuk konsistensi URL */}
          <Route path="/pesanan" element={<PesananPage />} />
          <Route
            path="/pesanan/detail/:orderId"
            element={<PesananDetailPage />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
