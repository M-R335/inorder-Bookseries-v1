import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesBySlug, getAuthorBySlug } from "@/lib/api";
import JsonLd from "@/components/JsonLd";
import AffiliateLink from "@/components/AffiliateLink";
import { Metadata } from "next";
import TrackSeries from "@/components/TrackSeries";
import Image from "next/image";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const series = await getSeriesBySlug(slug);
    if (!series) return {};

    const author = await getAuthorBySlug(series.authorSlug);
    const authorName = author ? author.name : series.authorSlug;

    const title = `${series.name} Books in Order – Publication & Chronological Order`;
    const description = `Find the complete ${series.name} books in order by ${authorName}, with publication and chronological reading orders plus quick notes for each book.`;
    const url = `https://readingorderbooks.com/series/${series.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            type: "book",
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: `${series.name} Reading Order`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.jpg"],
        },
    };
}

export default async function SeriesPage({ params }: Props) {
    const { slug } = await params;
    const series = await getSeriesBySlug(slug);

    if (!series) {
        notFound();
    }

    const author = await getAuthorBySlug(series.authorSlug);
    const authorName = author ? author.name : series.authorSlug;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BookSeries",
        name: `${series.name} Series`,
        url: `https://readingorderbooks.com/series/${series.slug}`,
        author: {
            "@type": "Person",
            name: authorName,
            url: `https://readingorderbooks.com/authors/${series.authorSlug}`,
        },
        workExample: series.books.map((book, index) => ({
            "@type": "Book",
            name: book.title,
            position: index + 1,
            isbn: book.isbn,
            datePublished: book.publicationYear.toString(),
        })),
    };

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://readingorderbooks.com",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Authors",
                item: "https://readingorderbooks.com/authors",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: authorName,
                item: `https://readingorderbooks.com/authors/${series.authorSlug}`,
            },
            {
                "@type": "ListItem",
                position: 4,
                name: series.name,
                item: `https://readingorderbooks.com/series/${series.slug}`,
            },
        ],
    };

    return (
        <div className="space-y-10">
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            {series.id && <TrackSeries id={series.id} />}

            <nav className="flex text-sm font-medium" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sepia-text/60">
                    <li>
                        <Link href="/" className="hover:text-sepia-accent transition-colors">Home</Link>
                    </li>
                    <li>/</li>
                    <li>
                        <Link href="/authors" className="hover:text-sepia-accent transition-colors">Authors</Link>
                    </li>
                    <li>/</li>
                    <li>
                        <Link href={`/authors/${series.authorSlug}`} className="hover:text-sepia-accent transition-colors">
                            {authorName}
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-sepia-text font-bold" aria-current="page">{series.name}</li>
                </ol>
            </nav>

            <div className="bg-white dark:bg-sepia-dark-bg/50 rounded-2xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 p-8 md:p-12 shadow-soft backdrop-blur-sm">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6 tracking-tight">{series.name} Books in Order</h1>
                <p className="text-lg text-sepia-text/80 dark:text-sepia-dark-text/80 leading-relaxed max-w-3xl mb-8 font-serif">
                    {series.description}
                </p>
                <div className="prose max-w-none text-sepia-text/80 dark:text-sepia-dark-text/80 font-serif">
                    <p>
                        Below you'll find the complete list of <strong>{series.name}</strong> books in publication order.
                        This is generally the recommended reading order for the series.
                    </p>
                </div>
            </div>

            <section>
                <h2 className="text-3xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-10">Publication Order</h2>
                <div className="space-y-6">
                    {series.books.map((book, index) => (
                        <div key={book.slug} className="group relative bg-white dark:bg-sepia-dark-bg/40 rounded-2xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 p-8 shadow-card hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1">
                            {/* Number Badge */}
                            <div className="absolute -left-3 -top-3 w-10 h-10 bg-sepia-accent dark:bg-sepia-dark-accent text-white rounded-xl shadow-md flex items-center justify-center font-bold text-lg z-10">
                                {index + 1}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                {/* Book Cover */}
                                {book.imageUrl && (
                                    <div className="flex-shrink-0 w-full md:w-32 lg:w-40">
                                        <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-md border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10">
                                            <Image
                                                src={book.imageUrl}
                                                alt={`Cover of ${book.title}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 160px, 160px"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex-grow">
                                    <h3 className="text-2xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-2 group-hover:text-sepia-accent dark:group-hover:text-sepia-dark-accent transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-sepia-secondary dark:text-sepia-dark-secondary font-medium mb-4 uppercase tracking-wider flex items-center gap-3">
                                        <span>{book.publicationYear}</span>
                                        {book.isbn && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-sepia-secondary/40 dark:bg-sepia-dark-secondary/40"></span>
                                                <span>ISBN: {book.isbn}</span>
                                            </>
                                        )}
                                    </p>
                                    {book.description && (
                                        <p className="text-sepia-text/80 dark:text-sepia-dark-text/80 leading-relaxed font-serif max-w-3xl">
                                            {book.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-shrink-0 pt-2">
                                    <AffiliateLink
                                        href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + " " + authorName)}`}
                                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-sepia-accent dark:border-sepia-dark-accent text-sm font-bold rounded-xl text-sepia-accent dark:text-sepia-dark-accent hover:bg-sepia-accent hover:text-white dark:hover:bg-sepia-dark-accent dark:hover:text-sepia-dark-bg transition-all duration-300 w-full md:w-auto"
                                    >
                                        View on Amazon
                                    </AffiliateLink>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
