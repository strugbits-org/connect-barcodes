"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Cart, CartItem } from "@/types";
import { getCart, createCart, addToCart, updateCartItem, removeCartItem } from "@/lib/medusa";
import toast from "react-hot-toast";

type CartContextType = {
  cart: Cart | null;
  cartId: string | null;
  isLoading: boolean;
  itemCount: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    const storedId = localStorage.getItem("cb_cart_id");
    if (!storedId) return;
    const data = await getCart(storedId);
    if (data?.cart) setCart(data.cart as Cart);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("cb_cart_id");
    if (stored) {
      setCartId(stored);
      refreshCart();
    }
  }, [refreshCart]);

  const ensureCart = async (): Promise<string> => {
    if (cartId) return cartId;
    const data = await createCart();
    if (!data?.cart) throw new Error("Failed to create cart");
    const id = data.cart.id;
    setCartId(id);
    setCart(data.cart as Cart);
    localStorage.setItem("cb_cart_id", id);
    return id;
  };

  const addItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      const id = await ensureCart();
      const data = await addToCart(id, variantId, quantity);
      if (data?.cart) {
        setCart(data.cart as Cart);
        toast.success("Added to cart!");
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const data = await updateCartItem(cartId, lineId, quantity);
      if (data?.cart) setCart(data.cart as Cart);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      await removeCartItem(cartId, lineId);
      await refreshCart();
      toast.success("Item removed");
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, cartId, isLoading, itemCount, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
