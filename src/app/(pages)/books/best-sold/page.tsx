import { Suspense } from "react";
import Loading from "app/component/Loading/Loading";
import BestSoldPage from "./BestSold/BestSoldPage";

export default function BestSoldClient() {
    return (
        <Suspense fallback={<Loading />}>
            <BestSoldPage />
        </Suspense>
    );
}

