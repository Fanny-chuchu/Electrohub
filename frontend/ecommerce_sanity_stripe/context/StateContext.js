import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({
  children,
}) => {

  // =========================
  // CART STATE
  // =========================
  const [showCart, setShowCart] =
    useState(false);

  const [cartItems, setCartItems] =
    useState([]);

  const [totalPrice, setTotalPrice] =
    useState(0);

  const [
    totalQuantities,
    setTotalQuantities,
  ] = useState(0);

  const [qty, setQty] =
    useState(1);

  // =========================
  // FILTER STATE
  // =========================
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  // =========================
  // ADD TO CART
  // =========================
  const onAdd = (
    product,
    quantity
  ) => {

    // 🔥 SAFETY CHECK
    if (
      !product ||
      !product.id
    ) {
      return;
    }

    const cleanCartItems =
      cartItems.filter(Boolean);

    const checkProductInCart =
      cleanCartItems.find(
        (item) =>
          item &&
          item.id === product.id
      );

    setTotalPrice(
      (prev) =>
        prev +
        product.price * quantity
    );

    setTotalQuantities(
      (prev) =>
        prev + quantity
    );

    if (checkProductInCart) {

      const updatedCartItems =
        cleanCartItems.map(
          (cartProduct) => {

            if (
              cartProduct &&
              cartProduct.id === product.id
            ) {

              return {
                ...cartProduct,
                quantity:
                  cartProduct.quantity +
                  quantity,
              };

            }

            return cartProduct;

          }
        );

      setCartItems(
        updatedCartItems
      );

    } else {

      setCartItems([
        ...cleanCartItems,
        {
          ...product,
          quantity,
        },
      ]);

    }

    toast.success(
      `${quantity} ${product.name} added to cart`
    );
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const onRemove = (product) => {

    if (
      !product ||
      !product.id
    ) return;

    const cleanCartItems =
      cartItems.filter(Boolean);

    const foundProduct =
      cleanCartItems.find(
        (item) =>
          item &&
          item.id === product.id
      );

    if (!foundProduct) return;

    const newCartItems =
      cleanCartItems.filter(
        (item) =>
          item &&
          item.id !== product.id
      );

    setTotalPrice(
      (prev) =>
        prev -
        foundProduct.price *
          foundProduct.quantity
    );

    setTotalQuantities(
      (prev) =>
        prev -
        foundProduct.quantity
    );

    setCartItems(
      newCartItems
    );
  };

  // =========================
  // TOGGLE QUANTITY
  // =========================
  const toggleCartItemQuantity = (
    id,
    value
  ) => {

    if (!id) return;

    const cleanCartItems =
      cartItems.filter(Boolean);

    const foundProduct =
      cleanCartItems.find(
        (item) =>
          item &&
          item.id === id
      );

    if (!foundProduct) return;

    const newCartItems =
      cleanCartItems.filter(
        (item) =>
          item &&
          item.id !== id
      );

    if (value === "inc") {

      setCartItems([
        ...newCartItems,
        {
          ...foundProduct,
          quantity:
            foundProduct.quantity + 1,
        },
      ]);

      setTotalPrice(
        (prev) =>
          prev +
          foundProduct.price
      );

      setTotalQuantities(
        (prev) => prev + 1
      );
    }

    if (value === "dec") {

      if (
        foundProduct.quantity > 1
      ) {

        setCartItems([
          ...newCartItems,
          {
            ...foundProduct,
            quantity:
              foundProduct.quantity - 1,
          },
        ]);

        setTotalPrice(
          (prev) =>
            prev -
            foundProduct.price
        );

        setTotalQuantities(
          (prev) => prev - 1
        );
      }
    }
  };

  // =========================
  // PRODUCT PAGE QUANTITY
  // =========================
  const incQty = () =>
    setQty(
      (prev) => prev + 1
    );

  const decQty = () => {

    setQty((prev) =>
      prev - 1 < 1
        ? 1
        : prev - 1
    );

  };

  return (

    <Context.Provider
      value={{

        // CART
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,

        // FILTERS
        search,
        setSearch,
        category,
        setCategory,

      }}
    >

      {children}

    </Context.Provider>

  );
};

export const useStateContext =
  () => useContext(Context);