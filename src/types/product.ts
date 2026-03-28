export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isMain?: boolean;
  createdAt?: string;

}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt?: string;
  user?: {
    name?: string;
    image?: string;
  };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery?: string[];
  categoryId: string;
  collectionId?: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  category?: Category;
  collection?: Collection;
  reviews?: Review[];
  createdAt?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
}

