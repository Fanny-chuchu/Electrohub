import React from "react";
import Link from "next/link";

const FooterBanner = ({
  footerBanner,
}) => {

  if (!footerBanner)
    return null;

  // 🔥 BACKEND URL
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";

  // 🔥 IMAGE URL
  const image =
    footerBanner.image
      ? `${API_URL}${footerBanner.image}`
      : footerBanner.image_url
      ? `${API_URL}${footerBanner.image_url}`
      : null;

  return (

    <div className="footer-banner-container">

      <div className="banner-desc">

        {/* LEFT */}
        <div className="left">

          <p className="discount">
            {footerBanner.discount}
          </p>

          <h3>
            {footerBanner.largeText1}
          </h3>

          <h3>
            {footerBanner.largeText2}
          </h3>

          <p className="sale-time">
            {footerBanner.saleTime}
          </p>

        </div>

        {/* IMAGE */}
        <div className="banner-image-wrapper">

          {image && (
            <img
              src={image}
              alt="footer-banner"
            />
          )}

        </div>

        {/* RIGHT */}
        <div className="right">

          <p className="small-text">
            {footerBanner.smallText}
          </p>

          <h3>
            {footerBanner.midText}
          </h3>

          <p className="desc">
            {footerBanner.desc}
          </p>

          <Link
            href={`/product/${footerBanner.product}`}
          >

            <button type="button">
              {footerBanner.buttonText}
            </button>

          </Link>

        </div>

      </div>

    </div>
  );
};

export default FooterBanner;