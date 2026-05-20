import React from "react";
import Link from "next/link";

const Product = ({ product }) => {

  // 🔥 PREVENT CRASHES
  if (!product || !product.id) {
    return null;
  }

  const {
    id,
    name,
    price,
    image_url,
    category,
  } = product;

  // 🔥 BACKEND URL
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";

  // 🔥 IMAGE URL
  const imageSrc =
    image_url
      ? `${API_URL}${image_url}`
      : "/placeholder.png";

  return (

    <Link href={`/product/${id}`}>

      <div className="premium-card">

        <div className="premium-image-wrapper">

          <img
            src={imageSrc}
            alt={name || "product"}
            className="premium-image"
          />

        </div>

        <div className="premium-content">

          {category?.name && (
            <span className="premium-category">
              {category.name}
            </span>
          )}

          <p className="premium-name">
            {name || "Unnamed Product"}
          </p>

          <p className="premium-price">
            ${price || 0}
          </p>

        </div>

      </div>

    </Link>
  );
};

export default Product;