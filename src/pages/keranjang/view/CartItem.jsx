import React from "react";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

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

function CartItem({
  item,
  isUpdating,
  isRemoving,
  onUpdateQuantity,
  onRemove,
}) {
  const namaAtk = item.atk?.nama_atk || item.atk?.nama || "ATK";
  const hargaAtk = parseInt(item.atk?.harga, 10) || 0;
  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 18,
        marginBottom: 18,
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        opacity: isUpdating || isRemoving ? 0.6 : 1,
      }}
    >
      <button
        onClick={() => onRemove(item.id, namaAtk)}
        disabled={isUpdating || isRemoving}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: 5,
          background: "none",
          border: "none",
          color: isRemoving ? "#bbb" : "#e53935",
          fontSize: 16,
          borderRadius: "50%",
          cursor: isUpdating || isRemoving ? "not-allowed" : "pointer",
          opacity: isUpdating || isRemoving ? 0.5 : 1,
        }}
        title="Hapus Item"
      >
        {isRemoving ? (
          <ArrowPathIcon className="h-5 w-5 animate-spin" />
        ) : (
          <TrashIcon className="h-5 w-5" />
        )}
      </button>
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          color: "var(--atk-dark)",
          marginBottom: 2,
        }}
      >
        {namaAtk}
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: "var(--atk-primary)",
          marginBottom: 8,
        }}
      >
        {formatRupiah(hargaAtk)}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1 || isUpdating || isRemoving}
          style={{
            padding: 6,
            border: "1px solid #eee",
            borderRadius: 6,
            background: "none",
            cursor:
              item.quantity <= 1 || isUpdating || isRemoving
                ? "not-allowed"
                : "pointer",
            opacity: item.quantity <= 1 || isUpdating || isRemoving ? 0.5 : 1,
          }}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span
          style={{
            minWidth: 28,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {isUpdating ? "..." : item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={isUpdating || isRemoving}
          style={{
            padding: 6,
            border: "1px solid #eee",
            borderRadius: 6,
            background: "none",
            cursor: isUpdating || isRemoving ? "not-allowed" : "pointer",
            opacity: isUpdating || isRemoving ? 0.5 : 1,
          }}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div
        style={{
          alignSelf: "flex-end",
          fontWeight: 700,
          fontSize: 16,
          color: "var(--atk-primary)",
        }}
      >
        {formatRupiah(hargaAtk * item.quantity)}
      </div>
    </div>
  );
}

export default CartItem;
