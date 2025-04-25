import { User } from "app/context/AuthContext";

export interface Book {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  isbn: string | null;
  published_at: string | null;
  cover_image: string;
  price: string;
  stock: number;
  language: string;
  page_count: number;
  status: string;
  publisher: Publisher;
  authors: Author[];
  categories: Category[];
  star_rating: number;
  review_count: number;
  reviews: Review[];
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
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
}
