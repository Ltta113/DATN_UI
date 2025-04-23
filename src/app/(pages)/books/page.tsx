import { Suspense } from "react";
import BookClient from "./BookPage/BookPage";
import Loading from "app/component/Loading/Loading";

export default function BookPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BookClient />
    </Suspense>
  );
}

