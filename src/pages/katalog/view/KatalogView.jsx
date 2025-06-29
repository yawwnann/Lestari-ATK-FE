"use client";

import React, { useState, useEffect } from "react";
import { KatalogPresenter } from "../presenter/KatalogPresenter";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  FunnelIcon,
  InboxIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  TagIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ArrowsUpDownIcon, HeartIcon } from "@heroicons/react/24/outline";
import { cn } from "../../../lib/utils";
import { useNavigate } from "react-router-dom";

const formatRupiah = (angka) => {
  const number = typeof angka === "string" ? parseInt(angka, 10) : angka;
  if (isNaN(number) || number === null || number === undefined) return "Rp -";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

function FilterChips({ filters, onRemoveFilter, onResetAll }) {
  const activeFilters = [];
  if (filters.search)
    activeFilters.push({ type: "search", label: `"${filters.search}"` });
  if (filters.kategori)
    activeFilters.push({ type: "kategori", label: filters.kategori });
  if (filters.sort && filters.sort !== "latest") {
    const sortLabels = {
      oldest: "Terlama",
      price_low: "Harga Terendah",
      price_high: "Harga Tertinggi",
      name_asc: "Nama A-Z",
      name_desc: "Nama Z-A",
    };
    activeFilters.push({ type: "sort", label: sortLabels[filters.sort] });
  }
  if (activeFilters.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs font-medium text-slate-600">Filter Aktif:</span>
      {activeFilters.map((filter, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200"
        >
          <FunnelIcon className="w-3 h-3" />
          {filter.label}
          <button
            onClick={() => onRemoveFilter(filter.type)}
            className="ml-1 hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onResetAll}
        className="text-xs text-slate-500 hover:text-slate-700 font-medium underline"
      >
        Reset Semua
      </button>
    </div>
  );
}

function AtkCard({ atk, presenter }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isLiked, setIsLiked] = useState(false);

  const viewDetail = (e) => {
    if (
      e.target.closest(".add-to-cart-button") ||
      e.target.closest(".view-detail-button") ||
      e.target.closest(".like-button")
    )
      return;
    presenter.handleNavigateToDetail(null, atk);
  };

  const navigateToDetailFromButton = (e) => {
    e.stopPropagation();
    presenter.handleNavigateToDetail(null, atk);
  };

  const statusKetersediaan = atk?.status_ketersediaan?.toLowerCase();
  const isTersedia = presenter.isProductAvailable(atk);
  const statusBadgeColor = presenter.getStatusBadgeColor(
    atk?.status_ketersediaan
  );

  const namaAtkDisplay =
    atk?.nama_atk || atk?.nama || "Nama ATK Tidak Tersedia";
  const gambarUtama = atk?.gambar_utama;
  const hargaAtk = atk?.harga;
  const kategoriNama = atk?.kategori?.nama_kategori || atk?.kategori?.nama;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAddingToCart || !isTersedia) return;
    setIsAddingToCart(true);
    setFeedback({ type: "", message: "" });

    const result = await presenter.handleAddToCart(atk.id, 1);

    if (result.success) {
      setFeedback({
        type: "success",
        message: `${namaAtkDisplay} ditambahkan!`,
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
    } else {
      setFeedback({ type: "error", message: result.error });
      setTimeout(() => setFeedback({ type: "", message: "" }), 2500);
    }

    setIsAddingToCart(false);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full relative shadow-lg border border-slate-100 hover:border-emerald-300"
      onClick={viewDetail}
    >
      {feedback.message && (
        <div
          className={cn(
            "absolute inset-x-0 top-0 z-30 p-3 text-center text-xs font-bold transition-all duration-300",
            feedback.type === "success"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
              : "bg-gradient-to-r from-rose-500 to-rose-600 text-white"
          )}
        >
          {feedback.message}
        </div>
      )}

      <div className="relative overflow-hidden aspect-[4/3] cursor-pointer">
        <img
          src={
            gambarUtama
              ? gambarUtama
              : "https://placehold.co/450x338/e2e8f0/94a3b8?text=Gambar+ATK"
          }
          alt={namaAtkDisplay}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/450x338/fecaca/991b1b?text=Error";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          {kategoriNama && (
            <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide flex items-center">
              <TagIcon className="w-3 h-3 mr-1" /> {kategoriNama}
            </span>
          )}
          {statusKetersediaan && (
            <span
              className={cn(
                "text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide backdrop-blur-sm",
                statusBadgeColor
              )}
            >
              {statusKetersediaan.charAt(0).toUpperCase() +
                statusKetersediaan.slice(1)}
            </span>
          )}
        </div>

        <button
          onClick={handleLike}
          className="like-button absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group/like"
        >
          <HeartIcon
            className={cn(
              "w-5 h-5 transition-all duration-200",
              isLiked
                ? "text-rose-500 fill-rose-500 scale-110"
                : "text-slate-600 group-hover/like:text-rose-500"
            )}
          />
        </button>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!isTersedia || isAddingToCart}
            className="add-to-cart-button bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 transform scale-90 group-hover:scale-100"
          >
            {isAddingToCart ? (
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
            ) : (
              <ShoppingCartIcon className="w-5 h-5" />
            )}
            {isAddingToCart ? "Menambahkan..." : "Tambah ke Keranjang"}
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors cursor-pointer">
          {namaAtkDisplay}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className="w-4 h-4 text-yellow-400 fill-current"
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">(4.8)</span>
        </div>

        <p className="text-xl font-bold text-emerald-600 mb-6">
          {formatRupiah(hargaAtk)}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <button
            onClick={navigateToDetailFromButton}
            className="view-detail-button w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            aria-label={`Lihat detail ${namaAtkDisplay}`}
          >
            <EyeIcon className="w-4 h-4 mr-2" /> Detail
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!isTersedia || isAddingToCart}
            title={isTersedia ? "Beli Sekarang" : "Stok Habis"}
            className="add-to-cart-button w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-slate-400/70 disabled:text-slate-100 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:bg-slate-400/70 group/button"
          >
            {isAddingToCart ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCartIcon className="w-4 h-4 mr-2 transition-transform duration-200 group-hover/button:scale-110" />
            )}
            <span className="transition-all duration-200">
              {isAddingToCart ? "..." : isTersedia ? "Beli" : "Habis"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ meta, onPageChange }) {
  if (!meta || !meta.links || meta.last_page <= 1) return null;

  const handlePageClick = (pageUrl) => {
    if (!pageUrl) return;
    try {
      const url = new URL(pageUrl);
      const page = url.searchParams.get("page");
      if (page) onPageChange(page);
    } catch (e) {
      const match = pageUrl.match(/[?&]page=(\d+)/);
      if (match && match[1]) onPageChange(match[1]);
      else console.error("Invalid URL for pagination:", pageUrl, e);
    }
  };

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/70 bg-white/95 backdrop-blur-sm px-6 py-6 mt-10 rounded-3xl shadow-xl">
      <div className="text-sm text-slate-600 mb-4 sm:mb-0">
        Menampilkan{" "}
        <span className="font-bold text-slate-800">{meta.from || 0}</span> -{" "}
        <span className="font-bold text-slate-800">{meta.to || 0}</span> dari{" "}
        <span className="font-bold text-slate-800">{meta.total || 0}</span>{" "}
        hasil
      </div>
      <div className="isolate inline-flex -space-x-px rounded-2xl shadow-lg">
        {meta.links.map((link, index) => {
          let labelContent = link.label.replace(/&laquo;|&raquo;/g, "").trim();
          const isPrev =
            link.label.includes("Previous") || link.label.includes("&laquo;");
          const isNext =
            link.label.includes("Next") || link.label.includes("&raquo;");

          if (isPrev)
            labelContent = (
              <>
                <ChevronLeftIcon
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
                <span className="sr-only">Sebelumnya</span>
              </>
            );
          if (isNext)
            labelContent = (
              <>
                <ChevronRightIcon
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
                <span className="sr-only">Berikutnya</span>
              </>
            );

          if (link.label === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-slate-600 ring-1 ring-inset ring-slate-300/70 cursor-default"
              >
                {labelContent}
              </span>
            );
          }

          return (
            <button
              key={index}
              onClick={() => handlePageClick(link.url)}
              disabled={!link.url || link.active}
              aria-current={link.active ? "page" : undefined}
              className={cn(
                "relative inline-flex items-center justify-center px-4 py-3 text-sm font-medium ring-1 ring-inset ring-slate-300/70 focus:z-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200 ease-in-out",
                link.active
                  ? "z-10 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white cursor-default ring-emerald-600"
                  : !link.url
                  ? "text-slate-400 cursor-not-allowed bg-slate-50/50"
                  : "text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700",
                index === 0 && "rounded-l-2xl",
                index === meta.links.length - 1 && "rounded-r-2xl",
                (isPrev || isNext) && "px-3 sm:px-4"
              )}
            >
              {labelContent}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden animate-pulse shadow-lg">
    <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300"></div>
    <div className="p-6">
      <div className="h-5 w-4/5 bg-slate-200 rounded-lg mb-3"></div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-slate-200 rounded"></div>
          ))}
        </div>
        <div className="w-8 h-3 bg-slate-200 rounded"></div>
      </div>
      <div className="h-6 w-2/5 bg-slate-200 rounded-lg mb-6"></div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="h-12 w-full bg-slate-200 rounded-2xl"></div>
        <div className="h-12 w-full bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

function KatalogPage() {
  const [presenter] = useState(() => new KatalogPresenter());
  const [atkList, setAtkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    kategori: "",
    sort: "latest",
    minPrice: "",
    maxPrice: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      await presenter.initialize();
      setAtkList(presenter.getAtkList());
      setLoading(presenter.getLoading());
      setError(presenter.getError());
      setMeta(presenter.getMeta());
    };
    initializeData();
  }, [presenter]);

  const handleFilterOrSortChange = async (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    await presenter.handleFilterOrSortChange(type, value);
    setAtkList(presenter.getAtkList());
    setMeta(presenter.getMeta());
    setLoading(presenter.getLoading());
    setError(presenter.getError());
  };

  const handlePageChange = async (page) => {
    await presenter.handlePageChange(page);
    setAtkList(presenter.getAtkList());
    setMeta(presenter.getMeta());
    setLoading(presenter.getLoading());
    setError(presenter.getError());
  };

  const resetAllFilters = async () => {
    setFilters({
      search: "",
      kategori: "",
      sort: "latest",
      minPrice: "",
      maxPrice: "",
    });
    await presenter.resetAllFilters();
    setAtkList(presenter.getAtkList());
    setMeta(presenter.getMeta());
    setLoading(presenter.getLoading());
    setError(presenter.getError());
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <header style={{ padding: "2.5rem 0 1.5rem 0", textAlign: "center" }}>
        <h1
          style={{
            fontWeight: 800,
            fontSize: "2.2rem",
            color: "var(--atk-dark)",
            marginBottom: "0.5rem",
          }}
        >
          Katalog ATK
        </h1>
        <p
          style={{
            color: "var(--atk-secondary)",
            fontSize: "1.1rem",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Temukan alat tulis kantor berkualitas untuk kebutuhan Anda.
        </p>
      </header>

      <div className="container mx-auto px-4 sm:px-5 lg:px-6 py-4 md:py-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input
            type="text"
            placeholder="Cari produk, merek, atau kategori..."
            value={filters.search}
            onChange={(e) => handleFilterOrSortChange("search", e.target.value)}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: "0.75rem 1rem",
              fontSize: 15,
              width: "100%",
              maxWidth: 340,
              background: "#fafafa",
              color: "var(--atk-dark)",
            }}
          />
          <div className="flex gap-2 items-center">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterOrSortChange("sort", e.target.value)}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: "0.5rem 1rem",
                fontSize: 15,
                background: "#fafafa",
                color: "var(--atk-dark)",
              }}
            >
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="price_low">Harga Terendah</option>
              <option value="price_high">Harga Tertinggi</option>
              <option value="name_asc">Nama A-Z</option>
              <option value="name_desc">Nama Z-A</option>
            </select>
            <button
              onClick={resetAllFilters}
              style={{
                border: "1px solid var(--atk-primary)",
                background: "none",
                color: "var(--atk-primary)",
                borderRadius: 10,
                padding: "0.5rem 1.2rem",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: meta?.per_page || 12 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    background: "#fafafa",
                    borderRadius: 16,
                    border: "1px solid #eee",
                    height: 220,
                  }}
                />
              ))
            : atkList.length > 0
            ? atkList.map((atk) => (
                <div
                  key={atk.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: 16,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    minHeight: 220,
                  }}
                >
                  <img
                    src={
                      atk?.gambar_utama ||
                      "https://placehold.co/300x200/eee/ccc?text=Gambar"
                    }
                    alt={atk?.nama_atk || "ATK"}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 10,
                      marginBottom: 10,
                      background: "#f5f5f5",
                    }}
                  />
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--atk-dark)",
                      marginBottom: 2,
                      lineHeight: 1.2,
                    }}
                  >
                    {atk?.nama_atk || atk?.nama}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--atk-secondary)",
                      marginBottom: 2,
                    }}
                  >
                    {atk?.kategori?.nama_kategori || "-"}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--atk-primary)",
                      marginBottom: 6,
                    }}
                  >
                    {formatRupiah(atk?.harga)}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    <button
                      onClick={() =>
                        presenter.handleNavigateToDetail(navigate, atk)
                      }
                      style={{
                        flex: 1,
                        border: "1px solid #eee",
                        background: "#fafafa",
                        color: "var(--atk-dark)",
                        borderRadius: 8,
                        padding: "0.5rem 0",
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => presenter.handleAddToCart(atk.id, 1)}
                      style={{
                        flex: 1,
                        border: "none",
                        background: "var(--atk-primary)",
                        color: "#fff",
                        borderRadius: 8,
                        padding: "0.5rem 0",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              ))
            : !error && (
                <div
                  className="col-span-full text-center py-16"
                  style={{ color: "var(--atk-secondary)" }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}
                  >
                    Produk Tidak Ditemukan
                  </div>
                  <div style={{ fontSize: 15, marginBottom: 18 }}>
                    Coba kata kunci lain atau reset filter.
                  </div>
                  <button
                    onClick={resetAllFilters}
                    style={{
                      border: "1px solid var(--atk-primary)",
                      background: "none",
                      color: "var(--atk-primary)",
                      borderRadius: 10,
                      padding: "0.5rem 1.2rem",
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    Reset Filter
                  </button>
                </div>
              )}
        </div>

        {!loading && meta && meta.last_page > 1 && (
          <nav className="flex justify-center mt-10">
            <div style={{ display: "flex", gap: 4 }}>
              {meta.links.map((link, idx) => {
                if (link.label === "...") {
                  return (
                    <span
                      key={idx}
                      style={{
                        padding: "0.5rem 0.9rem",
                        color: "#bbb",
                        fontSize: 15,
                      }}
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() =>
                      link.url &&
                      handlePageChange(
                        new URL(link.url).searchParams.get("page")
                      )
                    }
                    disabled={!link.url || link.active}
                    style={{
                      padding: "0.5rem 0.9rem",
                      border: "1px solid #eee",
                      background: link.active ? "var(--atk-primary)" : "#fff",
                      color: link.active ? "#fff" : "var(--atk-dark)",
                      borderRadius: 8,
                      fontWeight: link.active ? 700 : 500,
                      fontSize: 15,
                      cursor: link.url ? "pointer" : "not-allowed",
                      opacity: link.url ? 1 : 0.5,
                    }}
                  >
                    {link.label.replace(/&laquo;|&raquo;/g, "").trim()}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}

export default KatalogPage;
