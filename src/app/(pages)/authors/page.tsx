import { Suspense } from "react";
import AuthorClient from "./AuthorPage/AuthorPage";
import Loading from "app/component/Loading/Loading";

export default function AuthorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthorClient />
    </Suspense>
  );
}

