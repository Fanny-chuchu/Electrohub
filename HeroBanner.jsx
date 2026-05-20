import React from "react";
import Link from "next/link";

const Product = ({ product }) => {
  const { id, name, price, image_url, category } = product;

  const imageSrc = image_url
    ? `http://localhost:8000${image_url}`
    : "/placeholder.png";

  return (
    <Link href={`/product/${id}`}>
      <div className="premium-card">

        <div className="premium-image-wrapper">
          <img src={imageSrc} alt={name} className="premium-image" />
        </div>

        <div className="premium-content">
          {category && (
            <span className="premium-category">
              {category.name}
            </span>
          )}

          <p className="premium-name">{name}</p>
          <p className="premium-price">${price}</p>
        </div>

      </div>
    </Link>
  );
};

export default Product;