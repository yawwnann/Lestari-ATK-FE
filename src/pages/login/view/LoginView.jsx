// src/pages/LoginPage.jsx
import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { LoginPresenter } from "../presenter/LoginPresenter";

export default function LoginView() {
  const [presenter] = useState(() => new LoginPresenter());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    presenter.setEmail(email);
    presenter.setPassword(password);

    await presenter.handleLogin(navigate);
    setLoading(presenter.getLoading());
    setError(presenter.getError());
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 p-12 relative"
        style={{
          background:
            "linear-gradient(135deg, var(--atk-primary) 0%, var(--atk-secondary) 100%)",
          color: "#fff",
        }}
      >
        <div>
          <img src={logo} alt="ATK Logo" className="h-32" />
          <span className="text-4xl font-extrabold mb-4 flex items-center gap-2">
            Selamat Datang di
          </span>
          <span className="ml-2 text-6xl font-bold">LESTARI ATK!</span>
          <p className="text-base md:text-lg mt-6 max-w-md">
            Temukan dan beli alat tulis kantor (ATK) berkualitas untuk kebutuhan
            kerja dan belajar Anda. Proses mudah, cepat, dan hemat waktu!
          </p>
        </div>
        <div className="text-xs opacity-80 mt-10">
          © {new Date().getFullYear()} Lestari ATK. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div
        className="flex flex-col justify-center w-full md:w-1/2 px-6 sm:px-12 py-12 bg-white"
        style={{ background: "#fff" }}
      >
        <div className="max-w-md w-full mx-auto">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--atk-primary)" }}
          >
            LESTARI ATK
          </h2>
          <div
            className="text-lg font-semibold mb-6"
            style={{ color: "var(--atk-dark)" }}
          >
            Masuk ke Akun Anda
          </div>
          <div className="mb-4 text-sm">
            Belum punya akun?{" "}
            <a
              href="/register"
              style={{ color: "var(--atk-primary)" }}
              className="font-medium hover:underline"
            >
              Daftar sekarang
            </a>
          </div>
          {error && (
            <div
              className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative shadow-sm mb-2"
              role="alert"
            >
              <strong className="font-bold">Oops!</strong>
              <span className="block sm:inline ml-1">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--atk-tertiary)", fontWeight: 500 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--atk-tertiary)", fontWeight: 500 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-3 text-white font-semibold rounded-lg transition"
              style={{ background: "var(--atk-primary)" }}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk Sekarang"}
            </button>
            <button
              type="button"
              className="w-full py-3 border font-semibold rounded-lg flex items-center justify-center gap-2 transition"
              style={{
                borderColor: "var(--atk-dark)",
                color: "var(--atk-dark)",
                background: "#fff",
              }}
              onClick={() => presenter.handleGoogleLogin()}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Masuk dengan Google
            </button>
          </form>
          <div className="mt-4 text-sm text-right">
            <a
              href="/forgot-password"
              style={{ color: "var(--atk-primary)" }}
              className="hover:underline"
            >
              Lupa password? Klik di sini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
