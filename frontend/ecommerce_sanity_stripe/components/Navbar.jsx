import React, {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { useRouter } from "next/router";

import {
  AiOutlineShopping,
  AiOutlineSearch,
} from "react-icons/ai";

import { Cart } from "./";

import LoginModal from "./LoginModal";

import { useStateContext } from "../context/StateContext";

import {
  getCategories,
  searchProducts,
} from "../lib/api";

const Navbar = () => {

  const router = useRouter();

  const {
    showCart,
    setShowCart,
    totalQuantities,
  } = useStateContext();

  /* =========================
     STATE
  ========================= */

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [showProfile, setShowProfile] =
    useState(false);

  const [showLogin, setShowLogin] =
    useState(false);

  /* =========================
     LOAD CATEGORIES
  ========================= */

  useEffect(() => {

    getCategories()
      .then(setCategories)
      .catch(console.error);

  }, []);

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );
    }

  }, [router.pathname]);

  /* =========================
     CLOSE PROFILE OUTSIDE
  ========================= */

  useEffect(() => {

    const handleOutsideClick =
      () => {

        setShowProfile(false);
      };

    window.addEventListener(
      "click",
      handleOutsideClick
    );

    return () => {

      window.removeEventListener(
        "click",
        handleOutsideClick
      );
    };

  }, []);

  /* =========================
     LIVE SEARCH
  ========================= */

  useEffect(() => {

    if (!search.trim()) {

      setResults([]);

      return;
    }

    const delay = setTimeout(() => {

      searchProducts(search)
        .then((data) => {

          setResults(data);

          setShowDropdown(true);

        })
        .catch(console.error);

    }, 300);

    return () =>
      clearTimeout(delay);

  }, [search]);

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setShowProfile(false);

    window.location.href = "/";
  };

  /* =========================
     SEARCH
  ========================= */

  const handleSearchEnter =
    (e) => {

      if (
        e.key === "Enter" &&
        search.trim()
      ) {

        router.push(
          `/products?search=${search}`
        );

        setShowDropdown(false);
      }
    };

  return (

    <>

      {/* =========================
          NAVBAR
      ========================= */}

      <div className="navbar-container">

        {/* LEFT */}
        <div className="nav-left">

          {/* LOGO */}
          <Link
            href="/"
            className="logo"
          >

            <span>

              <span className="logo-main">
                Electro
              </span>

              <span className="logo-accent">
                Hub
              </span>

            </span>

          </Link>

          {/* PRODUCTS */}
          <div className="nav-item products">

            <span className="nav-link">
              Products
            </span>

            {/* MEGA MENU */}
            <div className="mega-menu">

              {categories.map((cat) => (

                <div
                  key={cat.id}
                  className="mega-column"
                >

                  <h4>
                    {cat.name}
                  </h4>

                  <Link
                    href={`/products?category=${cat.id}`}
                  >

                    <span>
                      View {cat.name}
                    </span>

                  </Link>

                </div>

              ))}

            </div>

          </div>

          {/* ABOUT */}
          <Link href="/about">

            <span className="nav-item">
              About
            </span>

          </Link>

        </div>

        {/* SEARCH */}
        <div className="search-box">

          <AiOutlineSearch />

          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            onKeyDown={
              handleSearchEnter
            }
            onFocus={() =>
              setShowDropdown(true)
            }
          />

          {/* SEARCH RESULTS */}
          {showDropdown &&
            results.length > 0 && (

            <div className="search-dropdown">

              {results
                .slice(0, 6)
                .map((item) => (

                <div
                  key={item.id}
                  className="search-item"
                  onClick={() => {

                    router.push(
                      `/product/${item.id}`
                    );

                    setSearch("");

                    setShowDropdown(false);
                  }}
                >

                  <img
                    src={`http://localhost:8000${item.image_url}`}
                    className="search-img"
                    alt={item.name}
                  />

                  <div>

                    <p>
                      {item.name}
                    </p>

                    <span>
                      ${item.price}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* RIGHT */}
        <div className="nav-right">

          {/* CART */}
          <button
            className="cart-icon"
            onClick={() =>
              setShowCart(true)
            }
          >

            <AiOutlineShopping />

            <span className="cart-count">

              {totalQuantities}

            </span>

          </button>

          {/* =========================
              AUTH
          ========================= */}

          {!user ? (

            <button
              className="login-btn"
              onClick={() =>
                setShowLogin(true)
              }
            >
              Login
            </button>

          ) : (

            <div className="profile-container">

              {/* AVATAR */}
              <div
                className="profile-avatar"
                onClick={(e) => {

                  e.stopPropagation();

                  setShowProfile(
                    !showProfile
                  );
                }}
              >

                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

              {/* DROPDOWN */}
              {showProfile && (

                <div
                  className="profile-dropdown"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  {/* HEADER */}
                  <div className="profile-header">

                    <div className="profile-avatar large">

                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                    <div>

                      <h4>
                        {user?.name}
                      </h4>

                      <p>
                        {user?.email}
                      </p>

                    </div>

                  </div>

                  {/* PROFILE */}
                  <Link href="/profile">

                    <span
                      className="dropdown-link"
                      onClick={() =>
                        setShowProfile(
                          false
                        )
                      }
                    >
                      My Profile
                    </span>

                  </Link>

                  {/* ORDERS */}
                  <Link href="/orders">

                    <span
                      className="dropdown-link"
                      onClick={() =>
                        setShowProfile(
                          false
                        )
                      }
                    >
                      Order History
                    </span>

                  </Link>

                  {/* WISHLIST */}
                  <Link href="/wishlist">

                    <span
                      className="dropdown-link"
                      onClick={() =>
                        setShowProfile(
                          false
                        )
                      }
                    >
                      Wishlist
                    </span>

                  </Link>

                  {/* ADMIN */}
                  {user?.role ===
                    "admin" && (

                    <Link href="/admin">

                      <span
                        className="dropdown-link"
                        onClick={() =>
                          setShowProfile(
                            false
                          )
                        }
                      >
                        Admin Dashboard
                      </span>

                    </Link>

                  )}

                  {/* LOGOUT */}
                  <button
                    className="logout-btn"
                    onClick={logout}
                  >
                    Logout
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

        {/* CART */}
        {showCart && <Cart />}

      </div>

      {/* =========================
          LOGIN MODAL
      ========================= */}

      {showLogin && (

        <LoginModal
          onClose={() =>
            setShowLogin(false)
          }
        />

      )}

    </>

  );
};

export default Navbar;