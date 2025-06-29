// File: src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  CreditCardIcon,
  ArrowPathIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as SolidCheckCircle,
  XCircleIcon as SolidXCircle,
} from "@heroicons/react/24/solid";
import { CheckoutPageSkeleton } from "../../../components/CheckoutSkeletons";
import { formatRupiah } from "../../../components/formatRupiah";

function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [checkoutError, setCheckoutError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    namaPemesan: "",
    nomorHp: "",
    alamatPengiriman: "",
    catatan: "",
  });
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCartAndUser = async () => {
      setLoadingCart(true);
      setCheckoutError(null);
      setCurrentUser(null);
      setCartItems([]);
      try {
        let userData = null;
        try {
          const userResponse = await apiClient.get("/user");
          if (isMounted && userResponse.data) {
            userData = userResponse.data.user;
            setCurrentUser(userData);
            setFormData((prev) => ({
              ...prev,
              namaPemesan: userData.name || "",
              nomorHp: userData.phone || userData.nomor_whatsapp || "",
            }));
          }
        } catch (userErr) {
          if (isMounted)
            console.warn("Gagal memuat data user:", userErr.message);
          if (userErr.response && userErr.response.status === 401) {
            navigate("/login");
            return;
          }
        }
        const cartResponse = await apiClient.get("/keranjang");
        if (isMounted) {
          if (cartResponse.data && Array.isArray(cartResponse.data.data)) {
            setCartItems(cartResponse.data.data);
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Gagal memuat data checkout:", err);
          if (err.response && err.response.status === 401) {
            setCheckoutError("Sesi Anda berakhir. Silakan login kembali.");
          } else {
            setCheckoutError(
              "Gagal memuat data keranjang. Muat ulang halaman."
            );
          }
          setCartItems([]);
        }
      } finally {
        if (isMounted) setLoadingCart(false);
      }
    };
    fetchCartAndUser();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalHarga = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.atk?.harga || 0) * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  const orderItems = cartItems.map((item) => ({
    atk_id: item.atk.id,
    quantity: item.quantity,
    harga_saat_pesanan: item.atk.harga,
  }));

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong.");
      return;
    }
    if (
      !formData.namaPemesan.trim() ||
      !formData.nomorHp.trim() ||
      !formData.alamatPengiriman.trim()
    ) {
      alert("Harap lengkapi Nama Penerima, Nomor HP, dan Alamat Pengiriman.");
      return;
    }
    setIsProcessingOrder(true);
    setCheckoutError(null);

    // Dapatkan tanggal saat ini dalam format YYYY-MM-DD
    const today = new Date();
    const tanggalPesananFormatted = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const orderPayload = {
      user_id: currentUser?.id || null,
      nama_pelanggan: formData.namaPemesan,
      nomor_whatsapp: formData.nomorHp,
      alamat_pengiriman: formData.alamatPengiriman,
      catatan: formData.catatan,
      tanggal_pesanan: tanggalPesananFormatted, // <--- PERBAIKAN: Tambahkan tanggal_pesanan
      items: orderItems,
      total_harga: totalHarga,
    };
    try {
      const response = await apiClient.post("/pesanan", orderPayload);
      if (response.data && response.data.data && response.data.data.id) {
        const createdOrderData = response.data.data;
        setCartItems([]); // Kosongkan keranjang setelah order dibuat
        navigate(`/payment/${createdOrderData.id}`, {
          state: { order: createdOrderData },
        });
      } else {
        throw new Error("Respons pembuatan pesanan tidak valid.");
      }
    } catch (error) {
      console.error(
        "Gagal membuat pesanan:",
        error.response?.data || error.message
      );
      const serverErrorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat membuat pesanan.";
      const validationErrors = error.response?.data?.errors;
      let displayError = serverErrorMessage;
      if (validationErrors) {
        displayError +=
          "\n\nDetail:\n" + Object.values(validationErrors).flat().join("\n");
      }
      setCheckoutError(displayError);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <main className="container mx-auto px-2 sm:px-4 py-6 md:py-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          {/* SHIPPING FORM */}
          <section style={{ flex: 2, minWidth: 0 }}>
            <div style={{ marginBottom: 24 }}>
              <Link
                to="/keranjang"
                style={{
                  color: "var(--atk-primary)",
                  fontWeight: 500,
                  fontSize: 15,
                  textDecoration: "underline",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ArrowLeftIcon className="h-5 w-5" /> Kembali ke Keranjang
              </Link>
            </div>
            <h1
              style={{
                fontWeight: 800,
                fontSize: 22,
                color: "var(--atk-dark)",
                marginBottom: 18,
              }}
            >
              Checkout
            </h1>
            {loadingCart ? (
              <CheckoutPageSkeleton />
            ) : checkoutError ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #eee",
                  padding: 36,
                  textAlign: "center",
                }}
              >
                <XCircleIcon
                  className="h-12 w-12"
                  style={{
                    color: "var(--atk-primary)",
                    margin: "0 auto 18px auto",
                  }}
                />
                <p
                  style={{
                    color: "var(--atk-primary)",
                    fontSize: 16,
                    marginBottom: 18,
                    whiteSpace: "pre-line",
                  }}
                >
                  {checkoutError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: "12px 32px",
                    background: "var(--atk-primary)",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Coba Lagi
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #eee",
                  padding: 40,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: "#f5f5f5",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px auto",
                  }}
                >
                  <ShoppingCartIcon
                    className="h-8 w-8"
                    style={{ color: "var(--atk-primary)" }}
                  />
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--atk-dark)",
                    marginBottom: 6,
                  }}
                >
                  Keranjang Anda kosong
                </h3>
                <p
                  style={{
                    color: "var(--atk-secondary)",
                    marginBottom: 18,
                    fontSize: 14,
                  }}
                >
                  Tambahkan ATK ke keranjang untuk melanjutkan
                </p>
                <Link
                  to="/katalog"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "10px 28px",
                    border: "none",
                    borderRadius: 8,
                    background: "var(--atk-primary)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  Lihat Katalog
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleCreateOrder}
                style={{ display: "flex", flexDirection: "column", gap: 0 }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid #eee",
                    padding: 22,
                    marginBottom: 0,
                  }}
                >
                  <h2
                    style={{
                      fontWeight: 700,
                      fontSize: 17,
                      color: "var(--atk-dark)",
                      marginBottom: 16,
                    }}
                  >
                    Informasi Pengiriman
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 18,
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <label
                        htmlFor="namaPemesan"
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--atk-dark)",
                          marginBottom: 6,
                        }}
                      >
                        Nama Penerima{" "}
                        <span style={{ color: "#e53935" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="namaPemesan"
                        id="namaPemesan"
                        value={formData.namaPemesan}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #eee",
                          borderRadius: 8,
                          fontSize: 14,
                          color: "var(--atk-dark)",
                        }}
                        required
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <label
                        htmlFor="nomorHp"
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--atk-dark)",
                          marginBottom: 6,
                        }}
                      >
                        Nomor HP (WhatsApp){" "}
                        <span style={{ color: "#e53935" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        name="nomorHp"
                        id="nomorHp"
                        value={formData.nomorHp}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #eee",
                          borderRadius: 8,
                          fontSize: 14,
                          color: "var(--atk-dark)",
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label
                      htmlFor="alamatPengiriman"
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--atk-dark)",
                        marginBottom: 6,
                      }}
                    >
                      Alamat Pengiriman Lengkap{" "}
                      <span style={{ color: "#e53935" }}>*</span>
                    </label>
                    <textarea
                      name="alamatPengiriman"
                      id="alamatPengiriman"
                      rows="3"
                      value={formData.alamatPengiriman}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #eee",
                        borderRadius: 8,
                        fontSize: 14,
                        color: "var(--atk-dark)",
                      }}
                      required
                    ></textarea>
                    <p
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: "var(--atk-secondary)",
                      }}
                    >
                      Detail: Jalan, No Rumah, RT/RW, Kel/Desa, Kec, Kab/Kota,
                      Prov, Kode Pos
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="catatan"
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--atk-dark)",
                        marginBottom: 6,
                      }}
                    >
                      Catatan (Opsional)
                    </label>
                    <textarea
                      name="catatan"
                      id="catatan"
                      rows="2"
                      value={formData.catatan}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #eee",
                        borderRadius: 8,
                        fontSize: 14,
                        color: "var(--atk-dark)",
                      }}
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessingOrder || cartItems.length === 0}
                  style={{
                    width: "100%",
                    marginTop: 18,
                    padding: "15px 0",
                    borderRadius: 8,
                    background:
                      isProcessingOrder || cartItems.length === 0
                        ? "#bbb"
                        : "var(--atk-primary)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 17,
                    border: "none",
                    cursor:
                      isProcessingOrder || cartItems.length === 0
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      isProcessingOrder || cartItems.length === 0 ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {isProcessingOrder ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-5 w-5" />{" "}
                      Memproses Pesanan...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="h-5 w-5" /> Lanjut ke
                      Pembayaran
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* ORDER SUMMARY */}
          <aside
            style={{
              flex: 1,
              minWidth: 260,
              maxWidth: 340,
              alignSelf: "flex-start",
              position: "sticky",
              top: 32,
              height: "fit-content",
            }}
          >
            {!loadingCart && cartItems.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #eee",
                  padding: 22,
                  boxShadow: "none",
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: "var(--atk-dark)",
                    marginBottom: 16,
                  }}
                >
                  Ringkasan Pesanan
                </h2>
                {/* Order Items */}
                <div
                  style={{
                    marginBottom: 18,
                    maxHeight: 180,
                    overflowY: "auto",
                    paddingRight: 4,
                  }}
                >
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <img
                        src={item.atk?.gambar_utama}
                        alt={item.atk?.nama_atk}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          objectFit: "cover",
                          background: "#f5f5f5",
                        }}
                        loading="lazy"
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "var(--atk-dark)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 120,
                          }}
                        >
                          {item.atk?.nama_atk || "Item"}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--atk-secondary)",
                          }}
                        >
                          {formatRupiah(item.atk?.harga || 0)} x {item.quantity}
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: "var(--atk-primary)",
                        }}
                      >
                        {formatRupiah((item.atk?.harga || 0) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Price Summary */}
                <div
                  style={{
                    borderTop: "1px solid #eee",
                    paddingTop: 10,
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: "var(--atk-secondary)",
                      marginBottom: 4,
                    }}
                  >
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600, color: "var(--atk-dark)" }}>
                      {formatRupiah(totalHarga)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: "var(--atk-secondary)",
                      marginBottom: 4,
                    }}
                  >
                    <span>Pengiriman</span>
                    <span style={{ color: "var(--atk-primary)" }}>
                      Dihitung saat checkout
                    </span>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #eee",
                      margin: "10px 0 6px 0",
                      paddingTop: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--atk-dark)",
                    }}
                  >
                    <span>Total</span>
                    <span>{formatRupiah(totalHarga)}</span>
                  </div>
                </div>
                <p
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    textAlign: "center",
                    color: "var(--atk-secondary)",
                  }}
                >
                  <InformationCircleIcon
                    className="h-4 w-4"
                    style={{ marginRight: 4, verticalAlign: "middle" }}
                  />{" "}
                  Biaya pengiriman akan dihitung pada langkah berikutnya
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
export default CheckoutPage;
