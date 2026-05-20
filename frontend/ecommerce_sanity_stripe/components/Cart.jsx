import React, {
  useRef,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/router";

import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
  AiOutlineArrowRight,
} from "react-icons/ai";

import {
  TiDeleteOutline,
} from "react-icons/ti";

import {
  useStateContext,
} from "../context/StateContext";

const Cart = () => {

  const cartRef =
    useRef();

  const router =
    useRouter();

  const {

    totalPrice,

    totalQuantities,

    cartItems,

    setShowCart,

    toggleCartItemQuanitity,

    onRemove,

  } = useStateContext();

  /* =========================
     GO TO CHECKOUT
  ========================= */

  const goToCheckout =
    () => {

      setShowCart(false);

      router.push(
        "/checkout"
      );
    };

  return (

    <div
      className="cart-wrapper"
      ref={cartRef}
    >

      <div className="cart-container">

        {/* =========================
            HEADER
        ========================= */}

        <button
          type="button"
          className="cart-heading"
          onClick={() =>
            setShowCart(false)
          }
        >

          <AiOutlineLeft />

          <span>
            Your Cart
          </span>

          <span className="cart-num-items">

            ({totalQuantities} items)

          </span>

        </button>

        {/* =========================
            EMPTY CART
        ========================= */}

        {cartItems.length < 1 && (

          <div className="empty-cart">

            <AiOutlineShopping
              size={120}
            />

            <h3>
              Your cart is empty
            </h3>

            <p>
              Looks like you
              haven’t added any
              products yet.
            </p>

            <Link href="/">

              <button
                type="button"
                onClick={() =>
                  setShowCart(false)
                }
                className="btn"
              >

                Continue Shopping

              </button>

            </Link>

          </div>

        )}

        {/* =========================
            PRODUCTS
        ========================= */}

        <div className="product-container">

          {cartItems.map(
            (item) => (

            <div
              className="product"
              key={item.id}
            >

              {/* IMAGE */}

              <img
                src={`http://localhost:8000${item.image_url}`}
                className="cart-product-image"
                alt={item.name}
              />

              {/* DETAILS */}

              <div className="item-desc">

                {/* TOP */}

                <div className="flex top">

                  <div>

                    <h5>
                      {item.name}
                    </h5>

                    <p className="cart-category">

                      {item.category
                        ?.name ||
                        "Electronics"}

                    </p>

                  </div>

                  <h4>
                    $
                    {item.price}
                  </h4>

                </div>

                {/* BOTTOM */}

                <div className="flex bottom">

                  {/* QUANTITY */}

                  <p className="quantity-desc">

                    <span
                      className="minus"
                      onClick={() =>
                        toggleCartItemQuanitity(
                          item.id,
                          "dec"
                        )
                      }
                    >

                      <AiOutlineMinus />

                    </span>

                    <span className="num">

                      {item.quantity}

                    </span>

                    <span
                      className="plus"
                      onClick={() =>
                        toggleCartItemQuanitity(
                          item.id,
                          "inc"
                        )
                      }
                    >

                      <AiOutlinePlus />

                    </span>

                  </p>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() =>
                      onRemove(item)
                    }
                  >

                    <TiDeleteOutline />

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        {cartItems.length >= 1 && (

          <div className="cart-bottom">

            {/* TOTAL */}

            <div className="total">

              <div>

                <p>
                  Subtotal
                </p>

                <span>
                  Taxes and
                  shipping calculated
                  at checkout
                </span>

              </div>

              <h3>
                ${totalPrice}
              </h3>

            </div>

            {/* ACTIONS */}

            <div className="cart-actions">

              <button
                type="button"
                className="continue-btn"
                onClick={() =>
                  setShowCart(false)
                }
              >

                Continue Shopping

              </button>

              <button
                type="button"
                className="checkout-btn"
                onClick={
                  goToCheckout
                }
              >

                Checkout

                <AiOutlineArrowRight />

              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default Cart;