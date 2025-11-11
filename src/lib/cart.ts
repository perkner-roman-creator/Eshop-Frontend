import type { Product, CartItem } from '../types';

const CART_KEY = 'eshop-cart';

export const getCart = (): CartItem[] => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = async (product: Product, quantity: number): Promise<void> => {
  const cart = getCart();
  const existing = cart.find(item => item.product.id === product.id);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  
  saveCart(cart);
  
  // Volání endpointu pro snížení skladu
  await updateStock(product.id, -quantity); // Snížení skladu (záporné číslo)
};

const updateStock = async (productId: string, quantityChange: number): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:4000/api/products/${productId}/update-stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantityChange }),
    });
    
    if (!response.ok) {
      console.error('Failed to update stock');
    }
  } catch (error) {
    console.error('Error updating stock:', error);
  }
};

export const removeFromCart = async (productId: string): Promise<CartItem[]> => {
  const cart = getCart();
  const item = cart.find(i => i.product.id === productId);
  
  // Vrátit množství zpět na sklad
  if (item) {
    await updateStock(productId, item.quantity); // Zvýšení skladu (kladné číslo)
  }
  
  const updatedCart = cart.filter(item => item.product.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

export const updateQuantity = async (productId: string, newQuantity: number): Promise<CartItem[]> => {
  const cart = getCart();
  const item = cart.find(i => i.product.id === productId);
  
  if (item) {
    const difference = newQuantity - item.quantity;
    await updateStock(productId, -difference); // Aktualizace skladu podle rozdílu
    item.quantity = newQuantity;
  }
  
  saveCart(cart);
  return cart;
};

export const clearCart = async (): Promise<void> => {
  const cart = getCart();
  
  // Vrátit všechno množství zpět na sklad
  for (const item of cart) {
    await updateStock(item.product.id, item.quantity);
  }
  
  localStorage.removeItem(CART_KEY);
};

export const getCartTotal = (): number => {
  return getCart().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};