import { Suspense } from "react";
import Loading from "app/component/Loading/Loading";
import BestSoldPage from "./BestSoldPage";

export default function BestSoldClient() {
    return (
        <Suspense fallback={<Loading />}>
            <BestSoldPage />
        </Suspense>
    );
}

