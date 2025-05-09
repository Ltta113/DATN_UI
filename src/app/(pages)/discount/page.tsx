import { Suspense } from "react";
import Loading from "app/component/Loading/Loading";

export default function BookPage() {
  return <Suspense fallback={<Loading />}></Suspense>;
}
