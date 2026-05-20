import React from "react";
import Link from "next/link";

import {
  AiOutlineShopping,
  AiOutlineSafety,
  AiOutlineRocket,
} from "react-icons/ai";

export default function About() {

  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">

        <div className="about-overlay">

          <h1>
            About ElectroHub
          </h1>

          <p>
            Premium electronics, modern experiences,
            and the future of online shopping.
          </p>

        </div>

      </section>

      {/* CONTENT */}
      <section className="about-content">

        <div className="about-grid">

          {/* CARD */}
          <div className="about-card">

            <AiOutlineShopping className="about-icon" />

            <h3>
              Premium Products
            </h3>

            <p>
              We bring the latest gadgets,
              smart devices, and electronics
              to your fingertips.
            </p>

          </div>

          {/* CARD */}
          <div className="about-card">

            <AiOutlineSafety className="about-icon" />

            <h3>
              Trusted Experience
            </h3>

            <p>
              Secure payments, fast delivery,
              and reliable customer support
              every step of the way.
            </p>

          </div>

          {/* CARD */}
          <div className="about-card">

            <AiOutlineRocket className="about-icon" />

            <h3>
              Future Ready
            </h3>

            <p>
              ElectroHub is designed for the
              next generation of ecommerce
              experiences.
            </p>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="about-cta">

        <h2>
          Explore The Future Of Tech
        </h2>

        <p>
          Discover premium gadgets curated
          for modern lifestyles.
        </p>

        <Link href="/products">

          <button>
            Shop Products
          </button>

        </Link>

      </section>

    </div>
  );
}