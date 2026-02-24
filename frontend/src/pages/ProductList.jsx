import React from "react";
import ProductCard from "./ProductCard";

const products = [
  { id: 1, name: "T-shirt", price: 499, image: "/images/tshirt.jpg" },
  { id: 2, name: "Jeans", price: 999, image: "/images/jeans.jpg" },
  { id: 3, name: "Jacket", price: 1499, image: "/images/jacket.jpg" },
];

const ProductList = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
