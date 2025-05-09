import { Suspense } from "react";
import Loading from "app/component/Loading/Loading";
import DepositPage from "./DepositPage/DepositPage";

export default function BookPage() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="container">
        <DepositPage />
      </div>
    </Suspense>
  );
}
