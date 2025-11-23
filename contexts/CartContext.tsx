'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  salePrice: number | null;
  isOnSale: boolean;
  imageUrl: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, size: string) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('lorelei_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lorelei_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, size: string) => {
    // Find existing item with same product ID AND same size
    // This allows the same product to be added multiple times with different sizes
    const existingItem = items.find(
      (item) => item.productId === product.id && item.size === size
    );

    if (existingItem) {
      // If same product + same size exists, increase quantity
      setItems(
        items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // If same product + different size (or new product), create new cart item
      const newItem: CartItem = {
        id: Date.now(), // Unique ID for each cart item
        productId: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        isOnSale: product.isOnSale,
        imageUrl: product.imageUrl,
        size,
        quantity: 1,
      };
      setItems([...items, newItem]);
    }
    setIsOpen(true);
  };

  const removeFromCart = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setItems(
        items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.isOnSale && item.salePrice ? item.salePrice : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

