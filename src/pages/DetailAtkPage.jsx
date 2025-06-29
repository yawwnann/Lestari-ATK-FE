import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import Link
import apiClient from "../api/apiClient";
import {
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  MinusIcon,
  PlusIcon,
  ClockIcon,
  InformationCircleIcon,
  TagIcon, // Digunakan di AtkCard
} from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import { cn } from "../lib/utils";

// --- Helper Function: Format Rupiah ---
const formatRupiah = (angka) => {
  if (angka === null || angka === undefined) return "Rp -";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

// --- Komponen: ATK Card (Untuk Produk Terkait) --- (Diubah dari Pupuk Card)
function AtkCard({ atk }) {
  const navigate = useNavigate();
  const viewDetail = (slug) => navigate(`/atk/${slug}`); // <--- Diubah: /pupuk -> /atk
  const statusBadgeColor =
    atk.status_ketersediaan?.toLowerCase() === "tersedia"
      ? "bg-emerald-100 text-emerald-800" // <--- Warna diubah
      : "bg-rose-100 text-rose-800"; // <--- Warna diubah

  const handleSimpleAddToCart = (e) => {
    e.stopPropagation();
    alert(`Tambah ${atk.nama_atk} (dari related) (belum implementasi)`); // <--- Diubah: pupuk.nama_pupuk -> atk.nama_atk
  };

  return (
    <div className="atk-card group bg-white rounded-lg border border-slate-200/80 overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col h-full">
      {" "}
      {/* <--- Border disesuaikan */}
      <div
        className="relative overflow-hidden aspect-[4/3] cursor-pointer"
        onClick={() => viewDetail(atk.slug)}
      >
        <img
          src={
            atk.gambar_utama // <--- Menggunakan gambar_utama langsung (asumsi sudah URL lengkap)
          }
          alt={atk.nama_atk} // <--- Diubah: pupuk.nama_pupuk -> atk.nama_atk
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          {atk.kategori && (
            <span className="bg-emerald-600/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded">
              {" "}
              {/* <--- Warna diubah */}
              <TagIcon className="w-3 h-3 mr-1 opacity-80" />{" "}
              {atk.kategori.nama_kategori}{" "}
              {/* <--- Diubah: pupuk.kategori.nama_kategori -> atk.kategori.nama_kategori */}
            </span>
          )}
          {atk.status_ketersediaan && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${statusBadgeColor}`}
            >
              {atk.status_ketersediaan}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-row justify-between items-end flex-grow">
        <div
          className="flex-grow mr-2 cursor-pointer"
          onClick={() => viewDetail(atk.slug)}
        >
          <h3 className="text-base font-semibold text-slate-800 mb-1 line-clamp-2">
            {" "}
            {/* <--- Warna teks disesuaikan */}
            {atk.nama_atk} {/* <--- Diubah: pupuk.nama_pupuk -> atk.nama_atk */}
          </h3>
          <p className="text-lg font-bold text-emerald-700">
            {" "}
            {/* <--- Warna diubah */}
            {formatRupiah(atk.harga)}
          </p>
        </div>
        <button
          onClick={handleSimpleAddToCart}
          disabled={atk.status_ketersediaan?.toLowerCase() !== "tersedia"}
          className="flex-shrink-0 p-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400" // <--- Warna diubah
          title="Tambah ke Keranjang"
        >
          <ShoppingCartIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// --- Komponen Loading Detail (Skeleton) ---
const DetailLoadingSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
    <div className="mb-6 h-5 w-1/4 bg-slate-300 rounded"></div>{" "}
    {/* <--- Warna skeleton disesuaikan */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
      <div className="md:col-span-2 w-full aspect-w-1 aspect-h-1 bg-slate-300 rounded-lg"></div>{" "}
      {/* <--- Warna skeleton disesuaikan */}
      <div className="md:col-span-3">
        <div className="h-4 w-1/3 bg-slate-300 rounded mb-3"></div>
        <div className="h-8 w-3/4 bg-slate-300 rounded mb-4"></div>
        <div className="h-10 w-1/2 bg-slate-300 rounded mb-6"></div>
        <div className="h-5 w-1/4 bg-slate-300 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-300 rounded"></div>
          <div className="h-4 w-full bg-slate-300 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-300 rounded"></div>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="h-10 w-24 bg-slate-300 rounded"></div>
          <div className="h-12 w-48 bg-slate-400 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Komponen Loading Card (Skeleton) untuk related items ---
const SkeletonCard = () => (
  <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden animate-pulse shadow-md">
    {" "}
    {/* <--- Warna border disesuaikan */}
    <div className="w-full h-48 bg-slate-200/80"></div>{" "}
    {/* <--- Warna skeleton disesuaikan */}
    <div className="p-4">
      <div className="h-5 w-3/4 bg-slate-200/80 rounded mb-2"></div>
      <div className="h-6 w-1/3 bg-slate-200/80 rounded"></div>
    </div>
  </div>
);

// --- Komponen Utama Halaman Detail ATK --- (Diubah dari Detail Pupuk)
function DetailAtkPage() {
  const [atkDetail, setAtkDetail] = useState(null); // <--- Diubah: pupukDetail -> atkDetail
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedAtkList, setRelatedAtkList] = useState([]); // <--- Diubah: relatedPupukList -> relatedAtkList
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState(null);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartStatus, setAddToCartStatus] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const { slug } = useParams();

  function closeModal() {
    setIsModalOpen(false);
  }

  function openModal(type, title, message) {
    setModalContent({ type, title, message });
    setIsModalOpen(true);
  }

  // --- Fetch Data Detail ATK --- (Diubah dari Pupuk)
  useEffect(() => {
    const fetchDetailAtk = async () => {
      setLoading(true);
      setError(null);
      setAtkDetail(null); // <--- Diubah: pupukDetail -> atkDetail
      setRelatedAtkList([]); // <--- Diubah: setRelatedPupukList -> setRelatedAtkList
      try {
        const response = await apiClient.get(`/atk/${slug}`); // <--- Diubah: /pupuk -> /atk
        if (response.data && response.data.data) {
          setAtkDetail(response.data.data); // <--- Diubah: setPupukDetail -> setAtkDetail
          setQuantity(1);
        } else {
          setError("Data ATK tidak ditemukan atau format tidak sesuai."); // <--- Teks diubah
        }
      } catch (err) {
        console.error(`Gagal memuat detail ATK (slug: ${slug}):`, err); // <--- Teks diubah
        if (err.response && err.response.status === 404) {
          setError("ATK yang Anda cari tidak ditemukan."); // <--- Teks diubah
        } else {
          setError("Terjadi kesalahan saat memuat detail ATK."); // <--- Teks diubah
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDetailAtk();
    }
  }, [slug]);

  // --- Fetch Related ATK --- (Diubah dari Related Pupuk)
  useEffect(() => {
    const fetchRelatedAtk = async (categorySlug, currentAtkId) => {
      if (!categorySlug) return;

      setRelatedLoading(true);
      setRelatedError(null);
      try {
        const response = await apiClient.get(`/atk`, {
          params: {
            kategori_slug: categorySlug,
            limit: 4,
          },
        });

        if (response.data && response.data.data) {
          // Filter out current ATK from related list
          const filteredRelated = response.data.data.filter(
            (atk) => atk.id !== currentAtkId
          );
          setRelatedAtkList(filteredRelated.slice(0, 3)); // Limit to 3 items
        }
      } catch (err) {
        console.error("Gagal memuat ATK terkait:", err);
        setRelatedError("Gagal memuat ATK terkait");
      } finally {
        setRelatedLoading(false);
      }
    };

    if (atkDetail && atkDetail.kategori) {
      fetchRelatedAtk(atkDetail.kategori.slug, atkDetail.id);
    }
  }, [atkDetail]);

  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!atkDetail) return;

    setIsAddingToCart(true);
    setAddToCartStatus(null);

    try {
      const response = await apiClient.post("/keranjang", {
        atk_id: atkDetail.id,
        quantity: quantity,
      });

      if (response.status === 201 || response.status === 200) {
        setAddToCartStatus("success");
        openModal(
          "success",
          "Berhasil!",
          `${atkDetail.nama_atk} telah ditambahkan ke keranjang.`
        );
      }
    } catch (err) {
      console.error("Gagal menambahkan ke keranjang:", err);
      setAddToCartStatus("error");

      let errorMessage = "Gagal menambahkan ke keranjang.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Silakan login terlebih dahulu.";
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      openModal("error", "Gagal!", errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getButtonContent = () => {
    if (isAddingToCart) {
      return (
        <>
          <ClockIcon className="w-5 h-5 mr-2 animate-spin" />
          Menambahkan...
        </>
      );
    }

    if (addToCartStatus === "success") {
      return (
        <>
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Ditambahkan!
        </>
      );
    }

    if (addToCartStatus === "error") {
      return (
        <>
          <XCircleIcon className="w-5 h-5 mr-2" />
          Gagal!
        </>
      );
    }

    return (
      <>
        <ShoppingCartIcon className="w-5 h-5 mr-2" />
        Tambah ke Keranjang
      </>
    );
  };

  if (loading) {
    return <DetailLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Kembali
            </button>
            <Link
              to="/katalog"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Lihat Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!atkDetail) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center">
          <InformationCircleIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            ATK Tidak Ditemukan
          </h2>
          <p className="text-slate-600 mb-6">
            ATK yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link
            to="/katalog"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Lihat Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li>
              <Link
                to="/katalog"
                className="hover:text-emerald-600 transition-colors"
              >
                Katalog
              </Link>
            </li>
            <li>
              <ChevronLeftIcon className="w-4 h-4" />
            </li>
            {atkDetail.kategori && (
              <>
                <li>
                  <Link
                    to={`/katalog?kategori_slug=${atkDetail.kategori.slug}`}
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {atkDetail.kategori.nama_kategori}
                  </Link>
                </li>
                <li>
                  <ChevronLeftIcon className="w-4 h-4" />
                </li>
              </>
            )}
            <li className="text-slate-800 font-medium">{atkDetail.nama_atk}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
          {/* Image Section */}
          <div className="md:col-span-2">
            <div className="relative overflow-hidden rounded-lg border border-slate-200/80">
              <img
                src={atkDetail.gambar_utama}
                alt={atkDetail.nama_atk}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              {atkDetail.status_ketersediaan && (
                <div className="absolute top-4 right-4">
                  <span
                    className={cn(
                      "px-3 py-1 text-sm font-bold rounded-full",
                      atkDetail.status_ketersediaan.toLowerCase() === "tersedia"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    )}
                  >
                    {atkDetail.status_ketersediaan}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-3">
            {/* Category Badge */}
            {atkDetail.kategori && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                  <TagIcon className="w-4 h-4 mr-1" />
                  {atkDetail.kategori.nama_kategori}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {atkDetail.nama_atk}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-emerald-700">
                {formatRupiah(atkDetail.harga)}
              </p>
              {atkDetail.stok !== undefined && (
                <p className="text-sm text-slate-600 mt-1">
                  Stok: {atkDetail.stok} unit
                </p>
              )}
            </div>

            {/* Description */}
            {atkDetail.deskripsi && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Deskripsi
                </h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    {atkDetail.deskripsi}
                  </p>
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-lg font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-slate-100 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={
                    isAddingToCart ||
                    atkDetail.status_ketersediaan?.toLowerCase() !== "tersedia"
                  }
                  className={cn(
                    "flex items-center justify-center px-8 py-3 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-200 min-w-[200px]",
                    isAddingToCart || addToCartStatus === "success"
                      ? "bg-emerald-600 cursor-not-allowed"
                      : addToCartStatus === "error"
                      ? "bg-red-600 hover:bg-red-700"
                      : atkDetail.status_ketersediaan?.toLowerCase() ===
                        "tersedia"
                      ? "bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl"
                      : "bg-slate-400 cursor-not-allowed"
                  )}
                >
                  {getButtonContent()}
                </button>
              </div>

              {/* Stock Warning */}
              {atkDetail.status_ketersediaan?.toLowerCase() !== "tersedia" && (
                <p className="text-red-600 text-sm mt-2">
                  Maaf, ATK ini sedang tidak tersedia.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related ATK Section */}
        {relatedAtkList.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              ATK Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedAtkList.map((atk) => (
                <AtkCard key={atk.id} atk={atk} />
              ))}
            </div>
          </div>
        )}

        {/* Related Loading */}
        {relatedLoading && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              ATK Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Related Error */}
        {relatedError && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              ATK Terkait
            </h2>
            <div className="text-center py-8">
              <p className="text-slate-600">{relatedError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className={cn(
                      "text-lg font-medium leading-6 mb-4",
                      modalContent.type === "success"
                        ? "text-emerald-800"
                        : modalContent.type === "error"
                        ? "text-red-800"
                        : "text-slate-800"
                    )}
                  >
                    {modalContent.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-slate-600">
                      {modalContent.message}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className={cn(
                        "inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        modalContent.type === "success"
                          ? "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
                          : modalContent.type === "error"
                          ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                          : "bg-slate-600 hover:bg-slate-700 focus-visible:ring-slate-500"
                      )}
                      onClick={closeModal}
                    >
                      Tutup
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default DetailAtkPage;
