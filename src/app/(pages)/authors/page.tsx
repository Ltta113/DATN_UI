import { Suspense } from "react";
import AuthorClient from "./AuthorPage";
import Loading from "app/component/Loading/Loading";

export default function AuthorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthorClient />
    </Suspense>
  );
}

