import type { Product, Order } from '../types';

const API_URL = '/api';

export const api = {
  // Produkty s filtrováním
  async getProducts(filters?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const res = await fetch(`${API_URL}/products?${params}`);
    if (!res.ok) throw new Error('Chyba při načítání produktů');
    return res.json();
  },

  // Vytvoření objednávky
  async createOrder(data: {
    customerName: string;
    email: string;
    phone?: string;
    items: { productId: number; quantity: number }[];
  }): Promise<Order> {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Chyba při vytváření objednávky');
    return res.json();
  },

  // Kategorie
  async getCategories(): Promise<string[]> {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Chyba při načítání kategorií');
    return res.json();
  }
};