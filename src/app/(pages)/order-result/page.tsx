import { Suspense } from "react";
import Loading from "app/component/Loading/Loading";
import PaymentResult from "./OrderResult/OrderResult";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentResult />
    </Suspense>
  );
}
