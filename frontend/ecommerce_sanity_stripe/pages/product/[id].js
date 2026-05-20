import React, {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import {
  getProduct,
  getProducts,
} from "../../lib/api";

import {
  useStateContext,
} from "../../context/StateContext";

import Product from "../../components/Product";

const ProductDetails = () => {

  const router = useRouter();

  const { id } = router.query;

  const {
    decQty,
    incQty,
    qty,
    onAdd,
    setShowCart,
  } = useStateContext();

  const [product, setProduct] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  // 🔥 BACKEND URL
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";

  // 🔥 FETCH DATA
  useEffect(() => {

    if (
      !router.isReady ||
      !id
    ) return;

    getProduct(id)
      .then(setProduct);

    getProducts()
      .then(setProducts);

  }, [id, router.isReady]);

  if (!product)
    return (
      <p style={{ padding: "40px" }}>
        Loading product...
      </p>
    );

  // 🔥 IMAGE URL
  const imageSrc =
    product.image_url
      ? `${API_URL}${product.image_url}`
      : "/placeholder.png";

  const handleBuyNow = () => {

    onAdd(product, qty);

    setShowCart(true);

  };

  return (

    <div className="container section">

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      <div className="product-detail-container">

        {/* IMAGE */}
        <div>

          <div className="image-container">

            <img
              src={imageSrc}
              alt={product.name}
              className="product-detail-image"
            />

          </div>

          {/* THUMBNAILS */}
          <div className="small-images-container">

            <img
              src={imageSrc}
              alt={product.name}
              className="small-image selected-image"
            />

          </div>

        </div>

        {/* DETAILS */}
        <div className="product-detail-desc">

          <h1>
            {product.name}
          </h1>

          {/* ⭐ REVIEWS */}
          <div className="reviews">

            <div>

              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />

            </div>

            <p>(20)</p>

          </div>

          <h4>Details:</h4>

          <p>
            {product.description}
          </p>

          <p className="price">
            ${product.price}
          </p>

          {/* QUANTITY */}
          <div className="quantity">

            <h3>Quantity:</h3>

            <p className="quantity-desc">

              <span
                className="minus"
                onClick={decQty}
              >

                <AiOutlineMinus />

              </span>

              <span className="num">
                {qty}
              </span>

              <span
                className="plus"
                onClick={incQty}
              >

                <AiOutlinePlus />

              </span>

            </p>

          </div>

          {/* BUTTONS */}
          <div className="buttons">

            <button
              type="button"
              className="add-to-cart"
              onClick={() =>
                onAdd(product, qty)
              }
            >

              Add to Cart

            </button>

            <button
              type="button"
              className="buy-now"
              onClick={handleBuyNow}
            >

              Buy Now

            </button>

          </div>

        </div>

      </div>

      {/* =========================
          YOU MAY ALSO LIKE
      ========================= */}

      <div className="maylike-products-wrapper">

        <h2>
          You may also like
        </h2>

        <div className="maylike-slider">

          {products
            .filter(
              (p) => p.id !== product.id
            )
            .slice(0, 10)
            .map((item) => (

              <div
                key={item.id}
                className="maylike-slide"
              >

                <Product product={item} />

              </div>

            ))}

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;