"use client";

import { Book } from 'app/lib/books';
import type { NextPage } from 'next';
import Head from 'next/head';
import BookSection from './BookSection/BookSection';
import { useNewestBooks } from 'hooks/useGetNewestBook';
import { useBestSoldBooks } from 'hooks/useGetBestSoldBook';
import { useListBookMarks } from 'hooks/useGetListBookMarks';

const BookMarkPage: NextPage = () => {
    const { data: bookMarkData, isPending: isBookMarkPending } = useListBookMarks();

    const bookMark = (bookMarkData?.data as { books: Book[] })?.books;

    const { data, isPending } = useNewestBooks();

    const newBooks = data?.data as Book[];

    const { data: bestSold, isPending: isBestSoldPending } = useBestSoldBooks();

    const classicBooks = bestSold?.data as Book[];

    return (
        <div className="min-h-screen bg-white text-right" dir="rtl">
            <Head>
                <title>Hiệu sách trực tuyến</title>
                <meta name="description" content="Hiệu sách trực tuyến" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <BookSection
                    title="Sách yêu thích"
                    viewAllLink="/bookmarks"
                    books={bookMark}
                    isLoading={isBookMarkPending}
                />

                <BookSection
                    title="Sách mới"
                    viewAllLink="/books"
                    books={newBooks as Book[]}
                    isLoading={isPending}
                />

                <BookSection
                    title="Sách bán chạy nhất"
                    viewAllLink="/books/best-sold"
                    books={classicBooks}
                    isLoading={isBestSoldPending}
                />
            </main>
        </div>
    );
};

export default BookMarkPage;