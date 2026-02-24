import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = existingCart.findIndex((item) => item.id === product.id);

    if (itemIndex >= 0) {
      existingCart[itemIndex].qty += 1;
    } else {
      existingCart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h3 className="mt-2 font-bold">{product.name}</h3>
      <p className="text-orange-400 font-semibold">₹{product.price}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-orange-500 py-2 rounded-lg hover:bg-orange-600"
        >
          Add to Cart
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600"
        >
          Go to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
