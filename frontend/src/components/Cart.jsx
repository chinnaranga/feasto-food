import React, { useState } from "react";
import axios from "axios";
import { logRequest, logResponse, logError } from "./utils/logger";

function Cart() {
  const [cartItem, setCartItem] = useState("");

  const addToCart = async () => {
    try {
      logRequest("Cart - Add", { item: cartItem });
      const res = await axios.post("/api/cart/add", { item: cartItem });
      logResponse("Cart - Add", res);
      alert("Item added to cart!");
    } catch (err) {
      logError("Cart - Add", err);
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      <input
        type="text"
        placeholder="Item name"
        value={cartItem}
        onChange={(e) => setCartItem(e.target.value)}
      />
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default Cart;
