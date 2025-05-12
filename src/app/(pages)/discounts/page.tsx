import { Suspense } from "react";
import Loading from "app/component/Loading/Loading";
import DiscountPage from "./DiscountPage/DiscountPage";

export default function BookPage() {
  return <Suspense fallback={<Loading />}>
    <DiscountPage />
  </Suspense>;
}
