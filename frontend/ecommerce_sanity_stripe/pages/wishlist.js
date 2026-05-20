import React from "react";
import Link from "next/link";

export default function Wishlist() {

  const items = [
    {
      id: 1,
      name: "Apple AirPods Max",
      price: "$599",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },
    {
      id: 2,
      name: "MacBook Pro M3",
      price: "$2,499",
      image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    },
  ];

  return (
    <div className="wishlist-page">

      <div className="wishlist-header glass-card">

        <h1>
          My Wishlist
        </h1>

        <p>
          Save products you love and revisit them anytime.
        </p>

      </div>

      <div className="wishlist-grid">

        {items.map((item) => (

          <div
            key={item.id}
            className="wishlist-card glass-card"
          >

            <img
              src={item.image}
              alt={item.name}
            />

            <div className="wishlist-content">

              <h3>{item.name}</h3>

              <p>{item.price}</p>

              <Link href={`/product/${item.id}`}>
                <button>
                  View Product
                </button>
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}