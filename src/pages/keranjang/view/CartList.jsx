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
    <div style={{ width: "100%", marginBottom: 24 }}>
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          isUpdating={updatingItemId === item.id}
          isRemoving={removingItemId === item.id}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default CartList;
