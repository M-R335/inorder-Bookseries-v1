import Search from "@/components/Search";
import { Metadata } from "next";
import { Suspense } from "react";
import { searchEverything } from "@/lib/api";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Search – Reading Order Books",
    description: "Search for your favorite authors and book series.",
    alternates: {
        canonical: "https://readingorderbooks.com/search",
    },
};

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;
    const results = q ? await searchEverything(q) : null;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6">
                    {q ? `Results for "${q}"` : "Search the Library"}
                </h1>
                {!q && (
                    <p className="text-lg text-sepia-text/80 dark:text-sepia-dark-text/80 mb-8 font-serif">
                        Find reading orders for thousands of authors and series.
                    </p>
                )}
                <Suspense fallback={<div className="text-sepia-text/60">Loading search...</div>}>
                    <Search />
                </Suspense>
            </div>

            {results && (
                <div className="space-y-12">
                    {/* Authors */}
                    {results.authors.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6 border-b border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 pb-2">
                                Authors
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.authors.map((author: any) => (
                                    <Link
                                        key={author.slug}
                                        href={author.url}
                                        className="block p-6 bg-white dark:bg-sepia-dark-bg/40 rounded-xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 hover:border-sepia-accent dark:hover:border-sepia-dark-accent transition-colors shadow-sm"
                                    >
                                        <h3 className="text-xl font-bold text-sepia-text dark:text-sepia-dark-text">
                                            {author.name}
                                        </h3>
                                        <span className="text-sepia-accent dark:text-sepia-dark-accent text-sm font-medium mt-2 inline-block">
                                            View Author Page &rarr;
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Series */}
                    {results.series.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6 border-b border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 pb-2">
                                Series
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.series.map((series: any) => (
                                    <Link
                                        key={series.slug}
                                        href={series.url}
                                        className="block p-6 bg-white dark:bg-sepia-dark-bg/40 rounded-xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 hover:border-sepia-accent dark:hover:border-sepia-dark-accent transition-colors shadow-sm"
                                    >
                                        <h3 className="text-xl font-bold text-sepia-text dark:text-sepia-dark-text">
                                            {series.name}
                                        </h3>
                                        <span className="text-sepia-accent dark:text-sepia-dark-accent text-sm font-medium mt-2 inline-block">
                                            View Series Page &rarr;
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Books */}
                    {results.books.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6 border-b border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 pb-2">
                                Books
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {results.books.map((book: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 bg-sepia-bg/30 dark:bg-sepia-dark-bg/30 rounded-lg"
                                    >
                                        {book.imageUrl && (
                                            <div className="w-16 flex-shrink-0">
                                                <div className="aspect-[2/3] relative rounded overflow-hidden shadow-sm border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10">
                                                    <img
                                                        src={book.imageUrl}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-medium text-sepia-text dark:text-sepia-dark-text">
                                                {book.title}
                                            </h3>
                                            {book.publicationYear > 0 && (
                                                <p className="text-sepia-text/60 dark:text-sepia-dark-text/60 text-sm">
                                                    Published: {book.publicationYear}
                                                </p>
                                            )}
                                            {book.amazonLink && (
                                                <a
                                                    href={book.amazonLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sepia-accent dark:text-sepia-dark-accent text-sm font-bold hover:underline mt-1 inline-block"
                                                >
                                                    Get on Amazon &rarr;
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {results.authors.length === 0 && results.series.length === 0 && results.books.length === 0 && (
                        <div className="text-center py-12 bg-sepia-bg/20 dark:bg-sepia-dark-bg/20 rounded-2xl">
                            <p className="text-xl text-sepia-text/60 dark:text-sepia-dark-text/60 font-serif">
                                No results found for "{q}". Try checking the spelling or searching for something else.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
