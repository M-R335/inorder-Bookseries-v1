import Link from "next/link";
import Image from "next/image";
import { Book, Author } from "@/lib/api";

interface Props {
    author: Author;
}

export default function BookGallery({ author }: Props) {
    // Collect all books from all series, then take the first 8 for the gallery
    const allBooks: Book[] = [];
    author.series.forEach(series => {
        allBooks.push(...series.books);
    });

    const books = allBooks.slice(0, 8); // Show max 8 books in the gallery

    if (books.length === 0) return null;

    return (
        <section className="relative overflow-hidden rounded-3xl bg-sepia-accent/5 dark:bg-sepia-dark-accent/5 border border-sepia-accent/10 dark:border-sepia-dark-accent/10 p-8 md:p-12">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sepia-accent/10 dark:bg-sepia-dark-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-sepia-secondary/10 dark:bg-sepia-dark-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-sepia-accent dark:text-sepia-dark-accent font-bold tracking-wider uppercase text-sm mb-2 block">
                        Trending Now
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text">
                        The {author.name} Collection
                    </h2>
                    <p className="text-sepia-text/70 dark:text-sepia-dark-text/70 mt-2 max-w-xl">
                        Explore the most popular books from our #1 trending author this week.
                    </p>
                </div>
                <Link
                    href={`/authors/${author.slug}`}
                    className="px-6 py-3 bg-white dark:bg-sepia-dark-bg text-sepia-text dark:text-sepia-dark-text font-semibold rounded-xl shadow-sm border border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 hover:border-sepia-accent dark:hover:border-sepia-dark-accent transition-all hover:-translate-y-0.5"
                >
                    View All Books &rarr;
                </Link>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {books.map((book, index) => (
                    <div
                        key={book.id || book.slug}
                        className="group relative aspect-[2/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                    >
                        {book.imageUrl ? (
                            <Image
                                src={book.imageUrl}
                                alt={`Cover of ${book.title}`}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-sepia-secondary/20 dark:bg-sepia-dark-secondary/20 flex items-center justify-center p-4 text-center">
                                <span className="font-serif font-bold text-sepia-text/40 dark:text-sepia-dark-text/40">
                                    {book.title}
                                </span>
                            </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-white font-bold font-serif text-lg leading-tight mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {book.title}
                            </h3>
                            {book.publicationYear > 0 && (
                                <p className="text-white/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    {book.publicationYear}
                                </p>
                            )}
                            {book.amazonLink && (
                                <a
                                    href={book.amazonLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block text-xs font-bold text-white bg-sepia-accent/90 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-sepia-accent transition-colors translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                                >
                                    Get on Amazon
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
