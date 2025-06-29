import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import atkBg from "../../../assets/atk.jpg";
import { useNavigate } from "react-router-dom";
import { DashboardPresenter } from "../presenter/DashboardPresenter";
import {
  CheckCircleIcon,
  ShoppingCartIcon,
  TruckIcon,
  TagIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

export default function DashboardView() {
  const [presenter] = useState(() => new DashboardPresenter());
  const [atkList, setAtkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      await presenter.initialize();
      setAtkList(presenter.getAtkList());
      setLoading(presenter.getLoading());
    };
    initializeData();
  }, [presenter]);

  return (
    <div
      className="min-h-screen flex flex-col bg-white"
      style={{
        background:
          "linear-gradient(135deg, #fff 0%, var(--atk-primary) 10%, #fff 100%)",
      }}
    >
      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center px-0 md:px-0 py-0 md:py-0 min-h-[480px] md:min-h-[540px] overflow-hidden">
        {/* Background image */}
        <img
          src={atkBg}
          alt="ATK Background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        {/* Overlay hitam transparan */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: "rgba(30, 23, 36, 0.68)" }}
        />
        {/* Aksen gradient SVG sudut kanan bawah */}
        <svg
          className="absolute right-0 bottom-0 z-20"
          width="320"
          height="220"
          viewBox="0 0 320 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="260"
            cy="180"
            rx="120"
            ry="80"
            fill="url(#atkHeroGradient)"
            fillOpacity="0.45"
          />
          <defs>
            <linearGradient
              id="atkHeroGradient"
              x1="140"
              y1="100"
              x2="320"
              y2="220"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--atk-primary)" />
              <stop offset="1" stopColor="var(--atk-tertiary)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Card glassmorphism untuk teks utama */}
        <div
          className="relative z-30 w-full max-w-2xl mx-auto px-6 md:px-12 py-12 md:py-16 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col items-center text-center border border-white/20"
          style={{ boxShadow: "0 8px 48px 0 rgba(44,44,44,0.18)" }}
        >
          <img
            src={logo}
            alt="ATK Logo"
            className="h-12 w-12 rounded-full shadow border-2 border-white mb-4"
          />
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            style={{
              color: "#fff",
              textShadow: "0 2px 16px rgba(44,44,44,0.18)",
            }}
          >
            Belanja <span style={{ color: "var(--atk-primary)" }}>ATK</span>{" "}
            Kekinian
            <br />
            <span
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--atk-primary)" }}
            >
              Mudah, Cepat, &amp; Lengkap
            </span>
          </h1>
          <p
            className="text-lg md:text-xl mb-8 max-w-lg"
            style={{ color: "#f3e9f3" }}
          >
            Temukan alat tulis kantor terbaik, harga bersaing, dan promo menarik
            setiap hari. Belanja jadi menyenangkan dan efisien!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => presenter.handleNavigateToKatalog(navigate)}
              className="px-8 py-3 rounded-xl font-bold text-white shadow-lg transition hover:scale-105 text-lg w-full sm:w-auto"
              style={{ background: "var(--atk-primary)" }}
            >
              Belanja Sekarang
            </button>
            <button
              onClick={() => presenter.handleScrollToPromo()}
              className="px-8 py-3 rounded-xl font-bold border transition hover:scale-105 text-lg w-full sm:w-auto"
              style={{
                borderColor: "var(--atk-primary)",
                color: "var(--atk-primary)",
                background: "#fff",
              }}
            >
              Lihat Promo
            </button>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN SECTION */}
      <section
        className="py-12 md:py-16 px-6 md:px-16"
        style={{ background: "#fff" }}
      >
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-10"
          style={{ color: "var(--atk-dark)" }}
        >
          Kenapa Pilih{" "}
          <span style={{ color: "var(--atk-primary)" }}>LESTARI ATK?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto stats-grid">
          <div className="stats-item bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-[var(--atk-primary)]">
            <ShoppingCartIcon className="h-10 w-10 mb-3 text-[var(--atk-primary)]" />
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: "var(--atk-dark)" }}
            >
              Produk Lengkap
            </h3>
            <p className="text-slate-600 text-sm">
              Ribuan pilihan ATK dari berbagai merek dan kategori.
            </p>
          </div>
          <div className="stats-item bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-[var(--atk-secondary)]">
            <TruckIcon className="h-10 w-10 mb-3 text-[var(--atk-secondary)]" />
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: "var(--atk-dark)" }}
            >
              Pengiriman Kilat
            </h3>
            <p className="text-slate-600 text-sm">
              Pesanan dikirim cepat &amp; aman ke seluruh Indonesia.
            </p>
          </div>
          <div className="stats-item bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-[var(--atk-tertiary)]">
            <TagIcon className="h-10 w-10 mb-3 text-[var(--atk-tertiary)]" />
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: "var(--atk-dark)" }}
            >
              Harga Terbaik
            </h3>
            <p className="text-slate-600 text-sm">
              Diskon &amp; promo spesial setiap minggu.
            </p>
          </div>
          <div className="stats-item bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-[var(--atk-dark)]">
            <CheckCircleIcon className="h-10 w-10 mb-3 text-[var(--atk-dark)]" />
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: "var(--atk-dark)" }}
            >
              Support Ramah
            </h3>
            <p className="text-slate-600 text-sm">
              Tim CS siap membantu Anda setiap hari.
            </p>
          </div>
        </div>
      </section>

      {/* KATALOG PREVIEW SECTION */}
      <section
        className="py-12 md:py-16 px-6 md:px-16"
        style={{ background: "#fff" }}
      >
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-10"
          style={{ color: "var(--atk-primary)" }}
        >
          Produk ATK Populer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 max-w-6xl mx-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-100 animate-pulse h-64"
              />
            ))
          ) : atkList.length > 0 ? (
            atkList.map((atk) => (
              <div
                key={atk.id}
                className="rounded-2xl bg-white shadow-xl border border-slate-200/80 hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer relative"
                onClick={() =>
                  presenter.handleNavigateToAtkDetail(navigate, atk)
                }
              >
                {atk.gambar_utama && (
                  <img
                    src={atk.gambar_utama}
                    alt={atk.nama_atk}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="font-bold text-base mb-1 line-clamp-2"
                    style={{ color: "var(--atk-dark)" }}
                  >
                    {atk.nama_atk}
                  </h3>
                  <p
                    className="text-[15px] font-semibold mb-2"
                    style={{ color: "var(--atk-primary)" }}
                  >
                    {presenter.formatRupiah(atk.harga)}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      className="px-3 py-1.5 rounded-lg text-white font-medium text-xs shadow-md transition"
                      style={{ background: "var(--atk-primary)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        presenter.handleNavigateToAtkDetail(navigate, atk);
                      }}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
                {atk.status_ketersediaan && (
                  <span
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow"
                    style={{
                      background:
                        atk.status_ketersediaan === "Tersedia"
                          ? "var(--atk-primary)"
                          : "var(--atk-dark)",
                      color: "#fff",
                    }}
                  >
                    {atk.status_ketersediaan}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500 py-12">
              Tidak ada produk ditemukan.
            </div>
          )}
        </div>
      </section>

      {/* PROMO/TESTIMONI SECTION */}
      <section
        className="py-12 md:py-16 px-6 md:px-16"
        style={{ background: "#faf7fa" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Promo Banner */}
          <div className="flex-1 bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-[var(--atk-primary)]">
            <TagIcon className="h-12 w-12 mb-3 text-[var(--atk-primary)]" />
            <h3
              className="font-bold text-xl mb-2"
              style={{ color: "var(--atk-primary)" }}
            >
              Promo Spesial Minggu Ini!
            </h3>
            <p className="text-slate-700 mb-4">
              Dapatkan diskon hingga{" "}
              <span
                className="font-bold"
                style={{ color: "var(--atk-primary)" }}
              >
                30%
              </span>{" "}
              untuk produk pilihan. Jangan lewatkan kesempatan ini!
            </p>
            <button
              className="px-6 py-2 rounded-lg text-white font-semibold shadow transition"
              style={{ background: "var(--atk-primary)" }}
              onClick={() => presenter.handleViewPromo(navigate)}
            >
              Lihat Promo
            </button>
          </div>
          {/* Testimoni */}
          <div className="flex-1 bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-[var(--atk-secondary)]">
            <StarIcon className="h-12 w-12 mb-3 text-yellow-400" />
            <h3
              className="font-bold text-xl mb-2"
              style={{ color: "var(--atk-secondary)" }}
            >
              Apa Kata Pelanggan?
            </h3>
            <p className="text-slate-700 mb-4 italic">
              "Belanja di Lestari ATK sangat memuaskan, produknya lengkap dan
              pengiriman super cepat!"
            </p>
            <div className="flex items-center gap-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
              ))}
            </div>
            <span className="mt-2 text-sm font-semibold text-slate-600">
              - Rina, Jakarta
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
