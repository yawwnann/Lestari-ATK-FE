import React, { useState, useEffect } from "react";
import axios from "axios";

function AtkList() {
  const [atkData, setAtkData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = "http://localhost:8000/api/atk?page=3";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(apiUrl);
        console.log("Full API Response:", response); // Untuk debug

        // --- PENYESUAIAN 1: Ambil array dari response.data.data ---
        // Cek dulu apakah response.data dan response.data.data ada
        const dataFromApi = response.data?.data;
        console.log("Extracted Data Array:", dataFromApi); // Untuk debug

        // Set state dengan data yang diekstrak atau array kosong jika tidak ada
        setAtkData(Array.isArray(dataFromApi) ? dataFromApi : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Render Logic ---

  if (isLoading) {
    return <p>Memuat data ATK...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Gagal memuat data: {error.message}</p>;
  }

  return (
    <div>
      <h1>Daftar ATK</h1>
      {/* Cek panjang array atkData */}
      {atkData.length > 0 ? (
        <ul>
          {/* Map melalui array atkData */}
          {atkData.map((atk) => (
            // --- PENYESUAIAN 2: Gunakan properti yang benar ---
            // Gunakan atk.id sebagai key (sudah benar karena ada di data)
            <li key={atk.id}>
              {/* Tampilkan nama ATK */}
              Nama: {atk.nama_atk ?? "N/A"},
              {/* Tampilkan nama kategori (akses atk.kategori.nama_kategori) */}
              {/* Gunakan optional chaining (?.) untuk keamanan jika kategori null/undefined */}
              Kategori: {atk.kategori?.nama_kategori ?? "N/A"}
              {/* Anda bisa tambahkan data lain dari API di sini, contoh: */}
              {/* , Harga: {atk.harga ?? 'N/A'} */}
              {/* , Stok: {atk.stok ?? 0} */}
              {/* , Deskripsi: {atk.deskripsi ?? ''} */}
            </li>
          ))}
        </ul>
      ) : (
        // Tampilkan pesan jika atkData kosong setelah fetch
        <p>Tidak ada data ATK ditemukan.</p>
      )}
    </div>
  );
}

export default AtkList;
