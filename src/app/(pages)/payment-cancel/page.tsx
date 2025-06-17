import { Suspense } from "react";
import PaymentCancelClient from "./PaymentCancel";
import Loading from "app/component/Loading/Loading";

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentCancelClient />
    </Suspense>
  );
}

