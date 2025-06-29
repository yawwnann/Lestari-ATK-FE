import React, { useState, useEffect, Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import apiClient from "../api/apiClient";
import logo from "../assets/logo.png";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const storedUser = localStorage.getItem("authUser");
      try {
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUser({
          name: parsedUser?.name || "Pengguna",
          email: parsedUser?.email || "",
          profile_photo_url: parsedUser?.profile_photo_url || null,
        });
      } catch {
        setUser({ name: "Pengguna", email: "", profile_photo_url: null });
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient.post("/logout");
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setUser(null);
      setIsLoggingOut(false);
      setIsMobileMenuOpen(false);
      navigate("/login");
    }
  };

  // Styling classes
  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-base font-semibold transition-colors flex items-center gap-1 ${
      isActive
        ? "bg-[var(--atk-secondary)] text-white"
        : "text-white hover:bg-[var(--atk-secondary)] hover:text-white"
    }`;
  const getMobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2 ${
      isActive
        ? "bg-[var(--atk-secondary)] text-white"
        : "text-white hover:bg-[var(--atk-secondary)] hover:text-white"
    }`;

  const handleNavbarImageError = (e) => {
    e.target.onerror = null;
    e.target.style.display = "none";
  };

  return (
    <nav
      style={{
        background: "var(--atk-primary)",
        boxShadow: "0 2px 16px 0 rgba(44,44,44,0.08)",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white md:hidden hover:bg-[var(--atk-secondary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Buka menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
            <NavLink to="/" className="flex items-center gap-2 select-none">
              <img src={logo} alt="ATK Logo" className="h-8 w-8 rounded-full" />
              <span className="text-white font-bold text-xl tracking-widest hidden sm:inline">
                LESTARI ATK
              </span>
            </NavLink>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex md:justify-center md:flex-1 md:mx-6">
            <div className="flex items-baseline space-x-2">
              <NavLink to="/dashboard" className={getNavLinkClass}>
                <HomeIcon className="h-5 w-5 mr-1" />
                <span>Home</span>
              </NavLink>
              <NavLink to="/katalog" className={getNavLinkClass}>
                <BuildingStorefrontIcon className="h-5 w-5 mr-1" />
                <span>Katalog</span>
              </NavLink>
              <NavLink to="/keranjang" className={getNavLinkClass}>
                <ShoppingCartIcon className="h-5 w-5 mr-1" />
                <span>Keranjang</span>
              </NavLink>
              <NavLink to="/pesanan" className={getNavLinkClass}>
                <ArchiveBoxIcon className="h-5 w-5 mr-1" />
                <span>Pesanan</span>
              </NavLink>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <NavLink
                  to="#"
                  className="flex items-center p-1 rounded-full text-white hover:bg-[var(--atk-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--atk-primary)] focus:ring-white"
                  title={user.name || "Profile"}
                >
                  <span className="sr-only">Profile</span>
                  {user.profile_photo_url ? (
                    <img
                      src={user.profile_photo_url}
                      alt={user.name || "User profile"}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={handleNavbarImageError}
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                  )}
                </NavLink>
                <button
                  onClick={handleLogout}
                  type="button"
                  disabled={isLoggingOut}
                  className={`p-1 rounded-full text-white hover:bg-[var(--atk-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--atk-primary)] focus:ring-white transition-opacity ${
                    isLoggingOut ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  title="Logout"
                >
                  <span className="sr-only">Logout</span>
                  <ArrowRightOnRectangleIcon
                    className="h-7 w-7"
                    aria-hidden="true"
                  />
                </button>
              </>
            ) : (
              <NavLink to="/login" className={getNavLinkClass}>
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={isMobileMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Dialog
          as="div"
          className="md:hidden fixed inset-0 z-50"
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed top-0 left-0 right-0 bg-[var(--atk-primary)] shadow-lg rounded-b-2xl p-6 pt-4 z-50">
            <div className="flex items-center justify-between mb-6">
              <NavLink
                to="/"
                className="flex items-center gap-2 select-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img
                  src={logo}
                  alt="ATK Logo"
                  className="h-8 w-8 rounded-full bg-white shadow border-2 border-white"
                />
                <span className="text-white font-bold text-xl tracking-widest">
                  LESTARI ATK
                </span>
              </NavLink>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full text-white hover:bg-[var(--atk-secondary)]"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/dashboard"
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HomeIcon className="h-6 w-6 mr-2" /> Home
              </NavLink>
              <NavLink
                to="/katalog"
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BuildingStorefrontIcon className="h-6 w-6 mr-2" /> Katalog
              </NavLink>
              <NavLink
                to="/keranjang"
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-6 w-6 mr-2" /> Keranjang
              </NavLink>
              <NavLink
                to="/pesanan"
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ArchiveBoxIcon className="h-6 w-6 mr-2" /> Pesanan
              </NavLink>
              {user ? (
                <>
                  <NavLink to="#" className={getMobileNavLinkClass}>
                    <UserCircleIcon className="h-6 w-6 mr-2" /> Profil
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-lg font-semibold text-white hover:bg-[var(--atk-secondary)]"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />{" "}
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={getMobileNavLinkClass}>
                  <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" /> Login
                </NavLink>
              )}
            </nav>
          </div>
        </Dialog>
      </Transition>
    </nav>
  );
}

export default Navbar;
