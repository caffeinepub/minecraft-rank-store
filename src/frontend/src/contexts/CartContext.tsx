import { type ReactNode, createContext, useContext, useState } from "react";
import type { Rank } from "../backend.d";

interface CartItem {
  rank: Rank;
}

interface CartContextType {
  items: CartItem[];
  addItem: (rank: Rank) => void;
  removeItem: (rankId: string) => void;
  clearCart: () => void;
  isInCart: (rankId: string) => boolean;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (rank: Rank) => {
    setItems((prev) => {
      if (prev.some((item) => item.rank.id === rank.id)) return prev;
      return [...prev, { rank }];
    });
  };

  const removeItem = (rankId: string) => {
    setItems((prev) => prev.filter((item) => item.rank.id !== rankId));
  };

  const clearCart = () => setItems([]);

  const isInCart = (rankId: string) =>
    items.some((item) => item.rank.id === rankId);

  const total = items.reduce((sum, item) => sum + item.rank.price, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        total,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
