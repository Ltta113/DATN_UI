import { Suspense } from "react";
import SearchClient from "./SearchPage/SearchPage";
import Loading from "app/component/Loading/Loading";

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchClient />
    </Suspense>
  );
}

