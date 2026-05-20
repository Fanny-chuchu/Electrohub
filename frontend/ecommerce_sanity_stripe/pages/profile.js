import React, {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
  AiOutlineLock,
  AiOutlineCreditCard,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSave,
} from "react-icons/ai";

import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../lib/api";

export default function Profile() {

  const router = useRouter();

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
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

    if (!storedUser) {

      router.push("/");

      return;
    }

    const parsedUser =
      JSON.parse(storedUser);

    loadProfile(parsedUser.id);

  }, []);

  /* =========================
     FETCH PROFILE
  ========================= */

  const loadProfile = async (id) => {

    try {

      const data =
        await getProfile(id);

      setUser(data);

      setForm({
        name: data?.name || "",
        phone: data?.phone || "",
        address: data?.address || "",
        city: data?.city || "",
        state: data?.state || "",
        country: data?.country || "",
        postal_code:
          data?.postal_code || "",
      });

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================
     SAVE PROFILE
  ========================= */

  const handleSave = async () => {

    try {

      const updated =
        await updateProfile(
          user?.id,
          form
        );

      setUser(updated.user);

      localStorage.setItem(
        "user",
        JSON.stringify(updated.user)
      );

      setEditing(false);

    } catch (err) {

      console.error(err);
    }
  };

  /* =========================
     DELETE ACCOUNT
  ========================= */

  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Delete your account permanently?"
      );

    if (!confirmDelete) return;

    try {

      await deleteProfile(
        user?.id
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      window.location.href = "/";

    } catch (err) {

      console.error(err);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading || !user) {

    return (

      <div className="profile-loading">

        <div className="profile-loader-card glass-card">

          <div className="loader-avatar"></div>

          <div className="loader-line"></div>

          <div className="loader-line short"></div>

        </div>

      </div>

    );
  }

  return (

    <div className="premium-profile-page">

      {/* HERO */}
      <div className="profile-hero-card glass-card">

        <div className="profile-hero-left">

          <div className="premium-avatar">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

          <div>

            <h1>
              {user?.name}
            </h1>

            <p>
              {user?.email}
            </p>

            <span className="premium-badge">
              Premium Member
            </span>

          </div>

        </div>

        {/* STATS */}
{/* REAL ACCOUNT META */}
<div className="profile-meta">

  <div className="profile-meta-item">

    <span>
      Account Type
    </span>

    <h4>
      {user?.role || "Customer"}
    </h4>

  </div>

  <div className="profile-meta-item">

    <span>
      Member Since
    </span>

    <h4>

      {user?.member_since
        ? new Date(
            user.member_since
          ).toLocaleDateString()
        : "Recently Joined"}

    </h4>

  </div>

  <div className="profile-meta-item">

    <span>
      Preferred Currency
    </span>

    <h4>
      {user?.preferred_currency || "USD"}
    </h4>

  </div>

</div>

      </div>

      {/* MAIN GRID */}
      <div className="profile-main-grid">

        {/* LEFT */}
        <div className="profile-left-column">

          {/* PERSONAL */}
          <div className="profile-section glass-card">

            <div className="section-header">

              <h2>
                Personal Information
              </h2>

              {!editing ? (

                <button
                  className="edit-btn"
                  onClick={() =>
                    setEditing(true)
                  }
                >

                  <AiOutlineEdit />

                  Edit

                </button>

              ) : (

                <button
                  className="save-btn"
                  onClick={handleSave}
                >

                  <AiOutlineSave />

                  Save

                </button>

              )}

            </div>

            <div className="profile-form-grid">

              {/* NAME */}
              <div className="premium-input-box">

                <label>

                  <AiOutlineUser />

                  Full Name

                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  disabled={!editing}
                />

              </div>

              {/* EMAIL */}
              <div className="premium-input-box">

                <label>

                  <AiOutlineMail />

                  Email Address

                </label>

                <input
                  type="email"
                  value={
                    user?.email || ""
                  }
                  disabled
                />

              </div>

              {/* PHONE */}
              <div className="premium-input-box">

                <label>

                  <AiOutlinePhone />

                  Phone Number

                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={
                    handleChange
                  }
                  disabled={!editing}
                />

              </div>

            </div>

          </div>

          {/* BILLING */}
          <div className="profile-section glass-card">

            <div className="section-header">

              <h2>
                Billing Address
              </h2>

            </div>

            <div className="profile-form-grid">

              {/* ADDRESS */}
              <div className="premium-input-box full-width">

                <label>

                  <AiOutlineEnvironment />

                  Street Address

                </label>

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={
                    handleChange
                  }
                  disabled={!editing}
                />

              </div>

              {/* CITY */}
              <div className="premium-input-box">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={
                    handleChange
                  }
                  disabled={!editing}
                />

              </div>

              {/* STATE */}
              <div className="premium-input-box">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={
                    handleChange
                  }
                  disabled={!editing}
                />

              </div>

              {/* COUNTRY */}
              <div className="premium-input-box">

                <label>
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={
                    handleChange
                  }
                  disabled={!editing}
                />

              </div>

              {/* POSTAL */}
              <div className="premium-input-box">

                <label>
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postal_code"
                  value={
                    form.postal_code
                  }
                  onChange={
                    handleChange
                  }
                  disabled={!editing}
                />

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="profile-right-column">

          {/* SECURITY */}
          <div className="profile-side-card glass-card">

            <h3>
              Security
            </h3>

            <div className="security-item">

              <AiOutlineLock />

              <div>

                <h4>
                  Password
                </h4>

                <p>
                  Last changed
                  recently
                </p>

              </div>

            </div>

            <button className="security-btn">

              Change Password

            </button>

          </div>

          {/* PAYMENT */}
          <div className="profile-side-card glass-card">

            <h3>
              Payment Methods
            </h3>

            <div className="payment-card-ui">

              <AiOutlineCreditCard />

              <div>

                <h4>
                  Visa ending in
                  2048
                </h4>

                <p>
                  Expires 08/28
                </p>

              </div>

            </div>

            <button className="secondary-btn">

              Add Payment Method

            </button>

          </div>

          {/* DANGER */}
          <div className="danger-zone glass-card">

            <h3>
              Danger Zone
            </h3>

            <p>
              Permanently delete
              your account and
              associated data.
            </p>

            <button
              className="delete-account-btn"
              onClick={
                handleDelete
              }
            >

              <AiOutlineDelete />

              Delete Account

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}