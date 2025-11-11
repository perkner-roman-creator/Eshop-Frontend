export interface Product {
  id: string; // Changed from number to string
  name: string;
  description?: string;
  price: number;
  imageUrl: string; // Made imageUrl required
  category: string;
  stock: number;
  reviewCount?: number; // Přidání reviewCount
  averageRating?: number; // Přidání averageRating
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}