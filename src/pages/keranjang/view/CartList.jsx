import React from "react";
import CartItem from "./CartItem";

function CartList({
  items,
  updatingItemId,
  removingItemId,
  onUpdateQuantity,
  onRemove,
}) {
  return (
    <ul
      role="list"
      className="divide-y divide-slate-200 border-t border-b border-slate-200"
    >
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          isUpdating={updatingItemId === item.id}
          isRemoving={removingItemId === item.id}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          gambar_url={item.atk.gambar_utama_url}
        />
      ))}
    </ul>
  );
}

export default CartList;
