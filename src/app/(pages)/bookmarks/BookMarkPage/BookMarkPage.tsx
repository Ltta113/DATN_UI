"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import BookmarkList from './BookMarkList/BookMarkList';
import { useListBookMarks } from 'hooks/useGetListBookMarks';
import { Book } from 'app/lib/books';

const BookmarksPage: NextPage = () => {

    const { data: bookMarkData, isPending: isBookMarkPending } = useListBookMarks();

    const bookMark = (bookMarkData?.data as { books: Book[] })?.books;

    return (
        <div className="min-h-screen bg-gray-50 text-left rounded-xl" dir="ltr">
            <Head>
                <meta name="description" content="Các sách tôi đã đánh dấu" />
                <link rel="icon" href="/favicon.ico" />
                <title>Các sách đã đánh dấu</title>
            </Head>

            <header className="bg-white shadow-sm py-4 rounded-sm">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-amber-500">Sách được đánh dấu của tôi</h1>
                </div>
            </header>

            <main className="container py-2">
                <BookmarkList
                    title="Sách đã đánh dấu"
                    bookmarks={bookMark}
                    isLoading={isBookMarkPending}
                />
            </main>

        </div>
    );
};

export default BookmarksPage;
