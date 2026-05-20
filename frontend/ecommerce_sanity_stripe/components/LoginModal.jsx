import React, {
  useState,
} from "react";

import {
  toast,
} from "react-hot-toast";

import {
  loginUser,
  registerUser,
} from "../lib/api";

const LoginModal = ({
  onClose,
}) => {

  const [
    isRegister,
    setIsRegister,
  ] = useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  // LOGIN
  const handleLogin =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        const data =
          await loginUser({
            email,
            password,
          });

        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );

        toast.success(
          "Welcome back ✨"
        );

        onClose();

        window.location.href =
          "/";

      } catch (err) {

        toast.error(
          err.message ||
          "Login failed"
        );

      } finally {

        setLoading(false);

      }
    };

  // REGISTER
  const handleRegister =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        await registerUser({
          name,
          email,
          password,
        });

        toast.success(
          "Account created ✨"
        );

        setIsRegister(false);

      } catch (err) {

        toast.error(
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

        {/* LOGO */}

        <div className="auth-logo">

          E

        </div>

        {/* TITLE */}

        <h2>

          {isRegister
            ? "Create account"
            : "Welcome back"}

        </h2>

        {/* SUBTITLE */}

        <p className="auth-subtitle">

          {isRegister
            ? "Join ElectroHub today"
            : "Login to continue shopping"}

        </p>

        {/* FORM */}

        <form
          onSubmit={
            isRegister
              ? handleRegister
              : handleLogin
          }
        >

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
            onClick={() =>
              setIsRegister(
                !isRegister
              )
            }
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