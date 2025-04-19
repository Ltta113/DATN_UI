import { Author } from "app/lib/books";
import Link from "next/link";
import AuthorsList from "./AuthorList";

interface AuthorsSectionProps {
  authors: Author[];
}

const AuthorsSection = ({ authors }: AuthorsSectionProps) => {
  return (
    <section className="py-6 px-4">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-lg font-bold text-right">Tác giả nổi bật</h2>
        <Link href="/authors" className="text-gray-700 flex items-center gap-1">
          <span className="text-sm">Xem tất cả</span>
        </Link>
      </div>
      <AuthorsList authors={authors} />
    </section>
  );
};

export default AuthorsSection;
