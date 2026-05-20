import React, {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/router";

import {
  AiOutlineCreditCard,
  AiOutlineLock,
  AiOutlineUser,
  AiOutlineEnvironment,
  AiOutlineMail,
} from "react-icons/ai";

import getStripe from "../lib/getStripe";

import {
  useStateContext,
} from "../context/StateContext";

export default function Checkout() {

  const router =
    useRouter();

  const stripePromise =
    getStripe();

  const {
    cartItems,
    totalPrice,
  } = useStateContext();

  const [loading, setLoading] =
    useState(false);

  const [paymentMethod,
    setPaymentMethod] =
      useState("card");

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      address: "",

      city: "",

      state: "",

      country: "",

      postal_code: "",
    });

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      const user =
        JSON.parse(storedUser);

      setForm({

        name:
          user?.name || "",

        email:
          user?.email || "",

        address:
          user?.address || "",

        city:
          user?.city || "",

        state:
          user?.state || "",

        country:
          user?.country || "",

        postal_code:
          user?.postal_code || "",
      });
    }

  }, []);

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  /* =========================
     STRIPE PAYMENT
  ========================= */

  const handleStripePayment =
    async () => {

      setLoading(true);

      try {

        const stripe =
          await stripePromise;

        const response =
          await fetch(
            "/api/stripe",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                customer: form,

                items: cartItems,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          console.log(data);

          return;
        }

        stripe.redirectToCheckout({

          sessionId: data.id,
        });

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="checkout-page">

      <div className="checkout-layout">

        {/* =========================
            LEFT
        ========================= */}

        <div className="checkout-left glass-card">

          <h1>
            Checkout
          </h1>

          {/* CONTACT */}

          <div className="checkout-section">

            <h3>
              Contact Information
            </h3>

            <div className="checkout-input">

              <AiOutlineUser />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="checkout-input">

              <AiOutlineMail />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

          {/* SHIPPING */}

          <div className="checkout-section">

            <h3>
              Shipping Address
            </h3>

            <div className="checkout-input">

              <AiOutlineEnvironment />

              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={form.address}
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="checkout-grid">

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={
                  handleChange
                }
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="checkout-grid">

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={
                  handleChange
                }
              />

              <input
                type="text"
                name="postal_code"
                placeholder="Postal Code"
                value={
                  form.postal_code
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

          {/* PAYMENT */}

          <div className="checkout-section">

            <h3>
              Payment Method
            </h3>

            {/* STRIPE */}

            <div
              className={`payment-option ${
                paymentMethod ===
                "card"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setPaymentMethod(
                  "card"
                )
              }
            >

              <AiOutlineCreditCard />

              <div>

                <h4>
                  Credit / Debit Card
                </h4>

                <p>
                  Secure Stripe
                  payment
                </p>

              </div>

            </div>

            {/* PAYSTACK FUTURE */}

            <div
              className={`payment-option disabled`}
            >

              <AiOutlineLock />

              <div>

                <h4>
                  Bank Transfer
                </h4>

                <p>
                  Coming soon
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            RIGHT
        ========================= */}

        <div className="checkout-right glass-card">

          <h2>
            Order Summary
          </h2>

          {/* ITEMS */}

          <div className="checkout-products">

            {cartItems.map(
              (item) => (

              <div
                key={item.id}
                className="checkout-product"
              >

                <img
                  src={`http://localhost:8000${item.image_url}`}
                  alt={item.name}
                />

                <div>

                  <h4>
                    {item.name}
                  </h4>

                  <p>
                    Qty:
                    {" "}
                    {item.quantity}
                  </p>

                </div>

                <h3>
                  $
                  {item.price}
                </h3>

              </div>

            ))}

          </div>

          {/* TOTAL */}

          <div className="checkout-total">

            <div>

              <span>
                Subtotal
              </span>

              <h2>
                ${totalPrice}
              </h2>

            </div>

          </div>

          {/* BUTTON */}

          <button
            className="place-order-btn"
            onClick={
              handleStripePayment
            }
          >

            {loading
              ? "Processing..."
              : "Pay Securely"}

          </button>

          <p className="secure-note">

            Secure payments powered
            by Stripe

          </p>

        </div>

      </div>

    </div>
  );
}