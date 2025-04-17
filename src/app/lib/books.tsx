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
  publisher: Publisher;
  authors: Author[];
  categories: Category[];
}

interface Publisher {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  website: string | null;
  logo: string | null;
}

interface Author {
  id: number;
  name: string;
  biography: string | null;
  slug: string;
  photo: string | null;
  birth_date: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
}
