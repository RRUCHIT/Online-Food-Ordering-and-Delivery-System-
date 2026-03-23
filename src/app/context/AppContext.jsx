import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(undefined);

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getItemKey = (item) => item._id || item.id;

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage("foodhub_cart", []));
  const [currentUser, setCurrentUser] = useState(() => readStorage("user", null));

  useEffect(() => {
    localStorage.setItem("foodhub_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(readStorage("user", null));
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("foodhub-auth-changed", syncUser);
    syncUser();

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("foodhub-auth-changed", syncUser);
    };
  }, []);

  const addToCart = (item) => {
    const itemKey = getItemKey(item);

    setCart((prev) => {
      const existingItem = prev.find((cartItem) => getItemKey(cartItem) === itemKey);

      if (existingItem) {
        return prev.map((cartItem) =>
          getItemKey(cartItem) === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => getItemKey(item) !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        getItemKey(item) === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
