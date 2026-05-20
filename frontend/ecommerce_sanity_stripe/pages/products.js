import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProducts } from "../lib/api";
import Product from "../components/Product";

export default function ProductsPage() {
  const router = useRouter();
  const { category, search } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    if (!router.isReady) return;

    setLoading(true);

    getProducts({ category, search })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category, search, router.isReady]);

  // 🔥 FIX: GET CATEGORY NAME FROM PRODUCTS
  const categoryName =
    products.length > 0 && category
      ? products[0]?.category?.name
      : null;

  return (
    <div className="products-page">

      {/* TITLE */}
      <h2 className="products-title">
        {category
          ? categoryName
            ? `Category: ${categoryName}`
            : ""
          : search
          ? `Search: ${search}`
          : "All Products"}
      </h2>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* PRODUCTS GRID */}
      <div className="products-container">
        {!loading && products.length === 0 && (
          <p>No products found</p>
        )}

        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}