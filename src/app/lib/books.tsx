import { Combo } from "app/component/Payment/OrderSummery/OrderSummery";
import { User } from "app/context/AuthContext";

export interface Book {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  isbn: string | null;
  published_at: string | null;
  cover_image: string;
  images: string[];
  price: string;
  stock: number;
  sold: number;
  language: string;
  page_count: number;
  status: string;
  publisher: Publisher;
  authors: Author[];
  categories: Category[];
  star_rating: number;
  review_count: number;
  reviews: Review[];
  final_price: string;
  discount: Discount;
  combos: Combo[];
}

export interface Discount {
  id: number;
  name: string;
  description: string | null;
  starts_at: string;
  expires_at: string;
  type: 'percent' | 'amount';
  value: number;
  books: Book[];
}

export interface Review {
  id: number;
  rating: number;
  content: string | null;
  created_at: string;
  updated_at: string;
  user: User;
}
interface Publisher {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  website: string | null;
  logo: string | null;
}

export interface Author {
  id: number;
  name: string;
  biography: string | null;
  slug: string;
  photo: string | null;
  birth_date: string | null;
  book_count: number;
  star_rating: number;
  review_count: number;
  reviews: Review[];
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
}
