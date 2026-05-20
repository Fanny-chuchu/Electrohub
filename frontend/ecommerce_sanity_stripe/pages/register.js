import React, { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "../lib/api";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser({
        name,
        email,
        password,
      });

      router.push("/");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">

      <form className="auth-card" onSubmit={handleRegister}>

        <h2>Create Account</h2>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}