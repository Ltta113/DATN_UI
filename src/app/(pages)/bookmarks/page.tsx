import { Suspense } from "react";
import Loading from "app/component/Loading/Loading";
import BookMarkClient from "./BookMarkPage/BookMarkPage";


export default function BookMarkPage() {
    return (
        <Suspense fallback={<Loading />}>
            <BookMarkClient />
        </Suspense>
    );
}