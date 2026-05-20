import React, {
  useState,
} from "react";

import {
  useRouter,
} from "next/router";

export default function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const router = useRouter();

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const res = await fetch(

        "http://localhost:8000/api/auth/login",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await res.json();

      // ERROR
      if (!res.ok) {

        throw new Error(
          data.detail ||
          "Login failed"
        );
      }

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

      // REDIRECT
      if (
        data.user.role === "admin"
      ) {

        router.push("/admin");

      } else {

        router.push("/");
      }

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="auth-page">

      <form
        onSubmit={handleLogin}
        className="auth-card"
      >

        {/* TITLE */}
        <h2 className="auth-title">

          Admin Login

        </h2>

        {/* ERROR */}
        {error && (

          <p className="auth-error">
            {error}
          </p>

        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
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

            ? "Logging in..."

            : "Login"}

        </button>

        {/* NOTE */}
        <p className="auth-note">

          This is an admin-only
          system.

        </p>

      </form>

    </div>
  );
}