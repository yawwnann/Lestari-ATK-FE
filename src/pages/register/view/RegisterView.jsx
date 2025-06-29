// src/pages/RegisterPage.jsx
import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import logo from "../../../assets/logo.png";
import { RegisterPresenter } from "../presenter/RegisterPresenter";

function RegisterView() {
  const [presenter] = useState(() => new RegisterPresenter());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  const closeModalAndNavigate = () => {
    presenter.closeModalAndNavigate(navigate);
    setIsSuccessModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    presenter.setName(name);
    presenter.setEmail(email);
    presenter.setPassword(password);
    presenter.setPasswordConfirmation(passwordConfirmation);
    presenter.setAgree(agree);

    await presenter.handleRegister();
    setError(presenter.getError());
    setLoading(presenter.getLoading());
    setIsSuccessModalOpen(presenter.getIsSuccessModalOpen());
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
            Daftar Akun Baru
          </div>
          <div className="mb-4 text-sm">
            Sudah punya akun?{" "}
            <a
              href="/login"
              style={{ color: "var(--atk-primary)" }}
              className="font-medium hover:underline"
            >
              Masuk di sini
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
              type="text"
              placeholder="Nama Lengkap"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--atk-tertiary)", fontWeight: 500 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <input
              type="password"
              placeholder="Konfirmasi Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--atk-tertiary)", fontWeight: 500 }}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 mr-2 h-4 w-4"
                style={{ accentColor: "var(--atk-primary)" }}
              />
              <label
                htmlFor="agree"
                className="text-sm"
                style={{ color: "var(--atk-dark)" }}
              >
                Saya menerima{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--atk-primary)" }}
                  className="hover:underline"
                >
                  Syarat dan Ketentuan
                </a>{" "}
                serta{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--atk-primary)" }}
                  className="hover:underline"
                >
                  Kebijakan Privasi
                </a>
                .
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 text-white font-semibold rounded-lg transition"
              style={{
                background: agree ? "var(--atk-primary)" : "var(--atk-dark)",
                cursor: agree ? "pointer" : "not-allowed",
              }}
              disabled={!agree || loading}
            >
              {loading ? "Sedang memproses..." : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>

      {/* === Modal Sukses Registrasi === */}
      <Transition appear show={isSuccessModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeModalAndNavigate}
        >
          {/* Latar belakang (overlay) */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 backdrop-blur-sm bg-black/30"
              aria-hidden="true"
            />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl sm:text-2xl font-semibold leading-6 text-slate-900 text-center"
                  >
                    Registrasi Berhasil!
                  </Dialog.Title>
                  <div className="mt-5 flex flex-col items-center">
                    <CheckCircleIcon
                      className="h-20 w-20 sm:h-24 sm:w-24 text-emerald-500 mb-5"
                      aria-hidden="true"
                    />
                    <p className="text-sm sm:text-base text-slate-600 text-center leading-relaxed">
                      Akun Anda telah berhasil dibuat. Anda akan diarahkan ke
                      halaman login.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                      onClick={closeModalAndNavigate}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* === Akhir Modal Sukses Registrasi === */}
    </div>
  );
}

export default RegisterView;
