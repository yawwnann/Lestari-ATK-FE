import React from "react";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const formatRupiah = (angka) => {
  const number = typeof angka === "string" ? parseInt(angka, 10) : angka;
  if (isNaN(number) || number === null || number === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

function CartItem({
  item,
  isUpdating,
  isRemoving,
  onUpdateQuantity,
  onRemove,
  gambar_url,
}) {
  const { atk, quantity } = item;
  const namaAtk = atk?.nama_atk || "Nama Produk Tidak Tersedia";
  const hargaAtk = parseInt(atk?.harga, 10) || 0;
  const subtotal = hargaAtk * quantity;
  const slug = atk?.slug || "#";

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/100x100/e2e8f0/94a3b8?text=Error";
  };

  return (
    <li
      className={`flex py-6 px-4 sm:px-6 transition-opacity duration-300 ${
        isUpdating || isRemoving ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex-shrink-0">
        <img
          src={
            gambar_url ||
            "https://placehold.co/100x100/e2e8f0/94a3b8?text=Gambar"
          }
          alt={namaAtk}
          className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32"
          onError={handleImageError}
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <Link
                  to={`/atk/${slug}`}
                  className="font-semibold text-atk-dark hover:text-atk-primary"
                >
                  {namaAtk}
                </Link>
              </h3>
            </div>
            <p className="mt-1 text-sm font-medium text-atk-primary">
              {formatRupiah(hargaAtk)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <label htmlFor={`quantity-${item.id}`} className="sr-only">
              Quantity, {namaAtk}
            </label>
            <div className="flex items-center">
              <button
                onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                disabled={quantity <= 1 || isUpdating || isRemoving}
                className="p-1.5 border rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold text-sm text-atk-dark">
                {isUpdating ? (
                  <ArrowPathIcon className="h-4 w-4 mx-auto animate-spin" />
                ) : (
                  quantity
                )}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                disabled={isUpdating || isRemoving}
                className="p-1.5 border rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 flex text-sm font-bold text-slate-700 items-end justify-between">
          <span>Subtotal: {formatRupiah(subtotal)}</span>
          <button
            onClick={() => onRemove(item.id, namaAtk)}
            disabled={isRemoving || isUpdating}
            className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {isRemoving ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <TrashIcon className="h-5 w-5" />
            )}
          </button>
        </p>
      </div>
    </li>
  );
}

export default CartItem;
