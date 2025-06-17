import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccess";
import Loading from "app/component/Loading/Loading";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentSuccessClient />
    </Suspense>
  );
}

