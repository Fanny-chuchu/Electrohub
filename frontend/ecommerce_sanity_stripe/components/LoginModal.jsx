import React, {
  useState,
} from "react";

import {
  useRouter,
} from "next/router";

import {
  loginUser,
  registerUser,
} from "../lib/api";

const LoginModal = ({
  onClose,
}) => {

  const router = useRouter();

  const [isRegister, setIsRegister] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const data = await loginUser({
        email,
        password,
      });

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.access_token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // CLOSE MODAL
      onClose();

      // REDIRECT BASED ON ROLE
      if (
        data.user.role === "admin"
      ) {

        window.location.href =
          "/admin";

      } else {

        window.location.href =
          "/";
      }

    } catch (err) {

      setError(
        err.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================
     REGISTER
  ========================= */

  const handleRegister = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const data =
        await registerUser({

          name,
          email,
          password,

        });

      // OPTIONAL AUTO LOGIN
      if (data?.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      alert(
        "Account created successfully"
      );

      // SWITCH TO LOGIN
      setIsRegister(false);

      // CLEAR FIELDS
      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {

      setError(
        err.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      className="login-overlay"
      onClick={onClose}
    >

      <div
        className="login-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* CLOSE */}
        <button
          className="close-modal"
          onClick={onClose}
        >
          ×
        </button>

        {/* TITLE */}
        <h2>

          {isRegister
            ? "Create Account"
            : "Welcome Back"}

        </h2>

        {/* SUBTITLE */}
        <p className="auth-subtitle">

          {isRegister

            ? "Create your ElectroHub account"

            : "Login to continue shopping"}

        </p>

        {/* ERROR */}
        {error && (

          <p className="auth-error">
            {error}
          </p>

        )}

        {/* FORM */}
        <form
          onSubmit={
            isRegister
              ? handleRegister
              : handleLogin
          }
        >

          {/* NAME */}
          {isRegister && (

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
            />

          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >

            {loading

              ? "Please wait..."

              : isRegister

              ? "Create Account"

              : "Login"}

          </button>

        </form>

        {/* SWITCH */}
        <p className="auth-switch">

          {isRegister

            ? "Already have an account?"

            : "Don't have an account?"}

          <span
            onClick={() => {

              setIsRegister(
                !isRegister
              );

              setError("");

            }}
          >

            {isRegister
              ? " Login"
              : " Register"}

          </span>

        </p>

      </div>

    </div>
  );
};

export default LoginModal;