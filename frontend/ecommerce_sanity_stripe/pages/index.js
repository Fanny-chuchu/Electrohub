import React, { useEffect, useState, useRef } from "react";
import { getProducts, getCategories, getBanner } from "../lib/api";

import { Product, HeroBanner, FooterBanner } from "../components";
import CategoryBox from "../components/CategoryBox";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hero, setHero] = useState(null);
  const [footer, setFooter] = useState(null);

  const productSliderRef = useRef(null);
  const categorySliderRef = useRef(null);

  // 🔥 FETCH DATA
  useEffect(() => {
    getProducts().then(setProducts);
    getCategories().then(setCategories);
    getBanner("hero").then(setHero);
    getBanner("footer").then(setFooter);
  }, []);

  // 🔥 SCROLL HANDLER (REUSABLE)
  const scroll = (ref, direction) => {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div>

      {/* HERO */}
      {hero && <HeroBanner heroBanner={hero} />}

      {/* =========================
          🔥 PRODUCT SLIDER
      ========================= */}
      <div className="product-slider-wrapper">

        <h2 className="product-slider-title">
          Best Selling Products
        </h2>

        <div className="slider-container">

          {/* LEFT */}
          <button
            className="slider-btn left"
            onClick={() => scroll(productSliderRef, "left")}
          >
            ‹
          </button>

          {/* SLIDER */}
          <div className="product-slider" ref={productSliderRef}>
            {products.map((product) => (
              <div key={product.id} className="product-slide">
                <Product product={product} />
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <button
            className="slider-btn right"
            onClick={() => scroll(productSliderRef, "right")}
          >
            ›
          </button>

        </div>
      </div>

      {/* =========================
          🔥 CATEGORY SLIDER
      ========================= */}
      <div className="category-slider-wrapper">

        <h2 className="category-slider-title">
          Shop by Category
        </h2>

        <div className="slider-container">

          {/* LEFT */}
          <button
            className="slider-btn left"
            onClick={() => scroll(categorySliderRef, "left")}
          >
            ‹
          </button>

          {/* SLIDER */}
          <div className="category-slider" ref={categorySliderRef}>
            {categories.map((cat) => (
              <CategoryBox key={cat.id} category={cat} />
            ))}
          </div>

          {/* RIGHT */}
          <button
            className="slider-btn right"
            onClick={() => scroll(categorySliderRef, "right")}
          >
            ›
          </button>

        </div>
      </div>

      {/* FOOTER */}
      {footer && <FooterBanner footerBanner={footer} />}

    </div>
  );
};

export default Home;