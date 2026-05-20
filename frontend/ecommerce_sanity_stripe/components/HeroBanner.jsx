import React from "react";
import Link from "next/link";

const HeroBanner = ({ heroBanner }) => {
  if (!heroBanner) {
    return <p style={{ padding: "20px" }}>No hero data</p>;
  }

  const image = heroBanner.image
    ? `http://localhost:8000${heroBanner.image}`
    : heroBanner.image_url
    ? `http://localhost:8000${heroBanner.image_url}`
    : null;

  return (
    <div className="hero-banner-container">
      <div>

        <p className="beats-solo">
          {heroBanner.smallText || "Latest Collection"}
        </p>

        <h3>{heroBanner.midText || "Best Products"}</h3>

        <h1>{heroBanner.largeText1 || "ElectroHub"}</h1>

        {image && (
          <img src={image} alt="hero" className="hero-banner-image" />
        )}

        <div>
          <Link href={`/product/${heroBanner.product || 1}`}>
            <button type="button">
              {heroBanner.buttonText || "Shop Now"}
            </button>
          </Link>

          <div className="desc">
            <h5>Description</h5>
            <p>{heroBanner.desc || "Premium electronics for you"}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;