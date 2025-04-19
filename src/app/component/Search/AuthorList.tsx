"use client";

import { Author } from "app/lib/books";
import AuthorItem from "./AuthorItem";

interface AuthorsListProps {
  authors: Author[];
}

const AuthorsList = ({ authors }: AuthorsListProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {authors.map((author) => (
        <AuthorItem key={author.id} author={author} />
      ))}
    </div>
  );
};

export default AuthorsList;
