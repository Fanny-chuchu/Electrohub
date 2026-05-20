import React, {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import {
  AiOutlineShopping,
  AiOutlineDownload,
} from "react-icons/ai";

import { getUserOrders } from "../lib/api";

export default function Orders() {

  const router = useRouter();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD ORDERS
  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      router.push("/");
      return;
    }

    loadOrders(user.id);

  }, []);

  // FETCH
  const loadOrders = async (userId) => {

    try {

      const data =
        await getUserOrders(userId);

      setOrders(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  // LOADING
  if (loading) {

    return (
      <div className="orders-loading">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="premium-orders-page">

      {/* HEADER */}
      <div className="orders-top-section glass-card">

        <div>

          <h1>
            Order History
          </h1>

          <p>
            View and track your recent purchases.
          </p>

        </div>

        <div className="orders-summary">

          <div className="summary-box">

            <h2>
              {orders.length}
            </h2>

            <span>
              Orders
            </span>

          </div>

        </div>

      </div>

      {/* NO ORDERS */}
      {orders.length === 0 && (

        <div className="empty-orders glass-card">

          <AiOutlineShopping />

          <h2>
            No Orders Yet
          </h2>

          <p>
            Your purchases will appear here.
          </p>

        </div>

      )}

      {/* ORDERS */}
      <div className="orders-container">

        {orders.map((order) => (

          <div
            key={order.id}
            className="premium-order-card glass-card"
          >

            {/* TOP */}
            <div className="order-top">

              <div>

                <h3>
                  Order #{order.id}
                </h3>

                <p>
                  Placed on{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleDateString()}
                </p>

              </div>

              <div className="order-status-group">

                <span
                  className={`delivery-status ${order.status?.toLowerCase()}`}
                >
                  {order.status}
                </span>

                <span className="payment-status">
                  Paid
                </span>

              </div>

            </div>

            {/* PRODUCTS */}
            <div className="order-products">

              {order.items?.map((item) => (

                <div
                  key={item.id}
                  className="order-product-item"
                >

                  <img
                    src={`http://localhost:8000${item.product.image_url}`}
                    alt={item.product.name}
                  />

                  <div className="order-product-info">

                    <h4>
                      {item.product.name}
                    </h4>

                    <p>
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <h3>
                    $
                    {item.product.price}
                  </h3>

                </div>

              ))}

            </div>

            {/* FOOTER */}
            <div className="order-footer">

              <div>

                <p>
                  Shipping Address
                </p>

                <h4>
                  {order.shipping_address}
                </h4>

              </div>

              <div className="order-total-section">

                <span>
                  Total
                </span>

                <h2>
                  ${order.total}
                </h2>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="order-actions">

              <button className="track-btn">
                Track Package
              </button>

              <button className="invoice-btn">

                <AiOutlineDownload />

                Invoice

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}