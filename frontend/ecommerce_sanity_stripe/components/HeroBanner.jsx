import React from "react";
import Link from "next/link";

const HeroBanner = ({
  heroBanner,
}) => {

  // 🔥 PREVENT CRASH
  if (!heroBanner) {
    return null;
  }

  // 🔥 BACKEND URL
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";

  // 🔥 SAFE IMAGE URL
  const image =
    heroBanner.image
      ? `${API_URL}${heroBanner.image}`
      : heroBanner.image_url
      ? `${API_URL}${heroBanner.image_url}`
      : "/placeholder.png";

  return (

    <div className="hero-banner-container">

      <div>

        <p className="beats-solo">

          {heroBanner.smallText ||
            "Latest Collection"}

        </p>

        <h3>

          {heroBanner.midText ||
            "Best Products"}

        </h3>

        <h1>

          {heroBanner.largeText1 ||
            "ElectroHub"}

        </h1>

        {/* IMAGE */}

        <img
          src={image}
          alt="hero-banner"
          className="hero-banner-image"
        />

        <div>

          <Link href="/products">
            <button type="button">

              {heroBanner.buttonText ||
                "Shop Now"}

            </button>

          </Link>

          <div className="desc">

            <h5>
              Description
            </h5>

            <p>

              {heroBanner.desc ||
                "Premium electronics for you"}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroBanner;