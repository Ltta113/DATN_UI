import { Suspense } from "react";
import Home from "./(pages)/home/page";
import Loading from "./component/Loading/Loading";

export default function Index() {
  return (
    <Suspense fallback={<Loading />}>
      <Home />
    </Suspense>
  );
}
