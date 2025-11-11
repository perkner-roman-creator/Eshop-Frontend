export type Review = {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  imageUrl?: string;
  category?: string;
  stock: number;
  reviewCount?: number;
  averageRating?: number;
  reviews?: Review[];
};