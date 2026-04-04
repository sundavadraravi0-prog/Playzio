import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from server whenever user changes
  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await cartAPI.get();
      setItems(data.items || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Clean up old localStorage cart data
  useEffect(() => {
    localStorage.removeItem('playzio_cart');
  }, []);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      const { data } = await cartAPI.add(product._id, quantity);
      setItems(data.items || []);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const { data } = await cartAPI.remove(productId);
      setItems(data.items || []);
      toast.success('Removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user || quantity < 1) return;
    try {
      const { data } = await cartAPI.update(productId, quantity);
      setItems(data.items || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartAPI.clear();
      setItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, loading, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
