const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8000";

/* =========================
   🔍 SEARCH
========================= */

export const searchProducts = async (query) => {
  const res = await fetch(
    `${BASE_URL}/api/products?search=${query}`
  );

  if (!res.ok) throw new Error("Search failed");

  return res.json();
};

/* =========================
   🛍 PRODUCTS
========================= */

export const getProducts = async ({
  search = "",
  category = "",
} = {}) => {

  const params = new URLSearchParams();

  if (search && search !== "undefined") {
    params.append("search", search);
  }

  if (category && category !== "undefined") {
    params.append("category", category);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${BASE_URL}/api/products?${queryString}`
    : `${BASE_URL}/api/products`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};


/* =========================
   🔍 SINGLE PRODUCT
========================= */

export const getProduct = async (id) => {

  if (!id) {
    throw new Error("Product ID required");
  }

  const res = await fetch(
    `${BASE_URL}/api/products/${id}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};


/* =========================
   ➕ CREATE PRODUCT
========================= */

export const createProduct = async (formData) => {

  const res = await fetch(
    `${BASE_URL}/api/products`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  return res.json();
};


/* =========================
   ✏️ UPDATE PRODUCT
========================= */

export const updateProduct = async (
  id,
  formData
) => {

  const res = await fetch(
    `${BASE_URL}/api/products/${id}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
};


/* =========================
   ❌ DELETE PRODUCT
========================= */

export const deleteProduct = async (id) => {

  const res = await fetch(
    `${BASE_URL}/api/products/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }

  return res.json();
};


/* =========================
   📦 CATEGORIES
========================= */

export const getCategories = async () => {

  const res = await fetch(
    `${BASE_URL}/api/categories`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};


/* =========================
   🎯 BANNERS
========================= */

export const getBanner = async (type) => {

  const res = await fetch(
    `${BASE_URL}/api/banners/${type}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch banner");
  }

  return res.json();
};


export const getBanners = async () => {

  const res = await fetch(
    `${BASE_URL}/api/banners`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch banners");
  }

  return res.json();
};


export const createBanner = async (data) => {

  const res = await fetch(
    `${BASE_URL}/api/banners`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create banner");
  }

  return res.json();
};


/* =========================
   🛒 CART
========================= */

// ➕ ADD TO CART
export const addToCartAPI = async (
  userId,
  productId,
  quantity
) => {

  const res = await fetch(
    `${BASE_URL}/api/cart/add?user_id=${userId}&product_id=${productId}&quantity=${quantity}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to add to cart");
  }

  return res.json();
};


// 📦 GET CART
export const getCartAPI = async (userId) => {

  const res = await fetch(
    `${BASE_URL}/api/cart/${userId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return res.json();
};


// 🔄 UPDATE CART
export const updateCartItemAPI = async (
  itemId,
  quantity
) => {

  const res = await fetch(
    `${BASE_URL}/api/cart/update/${itemId}?quantity=${quantity}`,
    {
      method: "PUT",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update cart");
  }

  return res.json();
};


// ❌ REMOVE CART ITEM
export const removeCartItemAPI = async (
  itemId
) => {

  const res = await fetch(
    `${BASE_URL}/api/cart/remove/${itemId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to remove item");
  }

  return res.json();
};


/* =========================
   🧾 ORDERS
========================= */

// CREATE ORDER
export const createOrder = async (
  userId
) => {

  const res = await fetch(
    `${BASE_URL}/api/orders/create/${userId}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create order");
  }

  return res.json();
};


// GET ORDERS
export const getOrders = async (
  userId
) => {

  const res = await fetch(
    `${BASE_URL}/api/orders/${userId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
};

const BASE_URRL =
  "http://localhost:8000/api";


/* =========================
   🔐 AUTH
========================= */

// REGISTER
export const registerUser = async (data) => {

  const res = await fetch(
    `${BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {

    const error = await res.json();

    throw new Error(
      error.detail || "Registration failed"
    );
  }

  return res.json();
};


// LOGIN
export const loginUser = async (data) => {

  const res = await fetch(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {

    const error = await res.json();

    throw new Error(
      error.detail || "Login failed"
    );
  }

  return res.json();
};

export const getUserOrders = async (
  userId
) => {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/api/orders/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch orders"
    );
  }

  return res.json();
};

/* =========================
PROFILE API
========================= */

export const getProfile = async (
  userId
) => {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/api/profile/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {

    throw new Error(
      "Failed to fetch profile"
    );
  }

  return res.json();
};

/* =========================
UPDATE PROFILE
========================= */

export const updateProfile =
  async (userId, data) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const res = await fetch(
      `${BASE_URL}/api/profile/${userId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(
          data
        ),
      }
    );

    if (!res.ok) {

      throw new Error(
        "Failed to update profile"
      );
    }

    return res.json();
  };

/* =========================
DELETE PROFILE
========================= */

export const deleteProfile =
  async (userId) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const res = await fetch(
      `${BASE_URL}/api/profile/${userId}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {

      throw new Error(
        "Failed to delete account"
      );
    }

    return res.json();
  };

  