"use client";

import Loading from "app/component/Loading/Loading";
import AuthorsSection from "app/component/Search/AuthorSection";
import { Author } from "app/lib/books";
import { useTopAuthor } from "hooks/useGetTopAuthor";

const AuthorContent = () => {
  const { data, isPending, isError } = useTopAuthor();

  const authors = data?.data as Author[];

  return (
    <div className="container mx-auto py-8">
      {isPending && <Loading />}
      {isError && (
        <p className="text-center text-red-500">Có lỗi khi tải dữ liệu!</p>
      )}

      {authors && (
        <div className="container mx-auto px-4 py-8">
          <AuthorsSection authors={authors} />
        </div>
      )}
    </div>
  );
};

export default AuthorContent;
