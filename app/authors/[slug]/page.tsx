import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorBySlug } from "@/lib/api";
import JsonLd from "@/components/JsonLd";
import AffiliateLink from "@/components/AffiliateLink";
import { Metadata } from "next";
import TrackAuthor from "@/components/TrackAuthor";
import Image from "next/image";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);
    if (!author) return {};

    const title = `${author.name} Books in Order – Complete Reading Order Guide`;
    const description = `Find the complete list of books by ${author.name} in order, including the ${author.series[0]?.name || "popular"} series.`;
    const url = `https://readingorderbooks.com/authors/${author.slug}`;

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
            type: "profile",
            images: [
                {
                    url: "/og-image.jpg", // Fallback or dynamic image if available
                    width: 1200,
                    height: 630,
                    alt: `${author.name} Reading Order`,
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

export default async function AuthorPage({ params }: Props) {
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);

    if (!author) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author.name,
        url: `https://readingorderbooks.com/authors/${author.slug}`,
        description: author.description,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://readingorderbooks.com/authors/${author.slug}`,
        },
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
                name: author.name,
                item: `https://readingorderbooks.com/authors/${author.slug}`,
            },
        ],
    };

    return (
        <div className="space-y-10">
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
                    <li className="text-sepia-text font-bold" aria-current="page">{author.name}</li>
                </ol>
            </nav>

            <div className="bg-white dark:bg-sepia-dark-bg/50 rounded-2xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 p-8 md:p-12 shadow-soft backdrop-blur-sm">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6 tracking-tight">{author.name} Books in Order</h1>
                <p className="text-lg text-sepia-text/80 dark:text-sepia-dark-text/80 leading-relaxed max-w-3xl font-serif">
                    {author.description}
                </p>
            </div>

            <section>
                <h2 className="text-3xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-10">Book Series by {author.name}</h2>
                <div className="grid grid-cols-1 gap-12">
                    {author.series.map((series) => (
                        <div key={series.slug} className="bg-white dark:bg-sepia-dark-bg/40 rounded-2xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 p-8 shadow-card">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-2">
                                        <Link href={`/series/${series.slug}`} className="hover:text-sepia-accent dark:hover:text-sepia-dark-accent transition-colors">
                                            {series.name} Series
                                        </Link>
                                    </h3>
                                    {series.description && (
                                        <p className="text-sepia-text/70 dark:text-sepia-dark-text/70 text-sm max-w-2xl">{series.description}</p>
                                    )}
                                </div>
                                <Link
                                    href={`/series/${series.slug}`}
                                    className="text-sepia-link dark:text-sepia-dark-link font-bold hover:text-sepia-accent dark:hover:text-sepia-dark-accent transition-colors whitespace-nowrap self-start md:self-center"
                                >
                                    View Series Page &rarr;
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {series.books.length > 0 ? (
                                    <ul className="space-y-2">
                                        {series.books.map((book, index) => (
                                            <li key={book.id || book.slug + index} className="flex items-start justify-between gap-4 p-3 bg-sepia-bg/30 dark:bg-sepia-dark-bg/30 rounded-lg hover:bg-sepia-bg/50 dark:hover:bg-sepia-dark-bg/50 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <span className="text-sepia-text/40 dark:text-sepia-dark-text/40 font-mono text-sm w-6 text-right flex-shrink-0 mt-1">
                                                        #{index + 1}
                                                    </span>
                                                    {book.imageUrl && (
                                                        <div className="w-12 flex-shrink-0">
                                                            <div className="aspect-[2/3] relative rounded overflow-hidden shadow-sm border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10">
                                                                <Image
                                                                    src={book.imageUrl}
                                                                    alt={`Cover of ${book.title}`}
                                                                    fill
                                                                    sizes="48px"
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-sepia-text dark:text-sepia-dark-text font-medium">
                                                            {book.title}
                                                        </span>
                                                        {book.publicationYear > 0 && (
                                                            <span className="text-sepia-text/50 dark:text-sepia-dark-text/50 text-xs">
                                                                ({book.publicationYear})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {book.amazonLink && (
                                                    <AffiliateLink
                                                        href={book.amazonLink}
                                                        className="text-sm font-bold text-sepia-accent dark:text-sepia-dark-accent hover:underline flex-shrink-0"
                                                    >
                                                        Get on Amazon &rarr;
                                                    </AffiliateLink>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sepia-text/60 italic">No books found for this series.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Author Section */}
            <section className="bg-white dark:bg-sepia-dark-bg/50 rounded-2xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 p-8 md:p-12 shadow-soft backdrop-blur-sm">
                <h2 className="text-3xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6">About {author.name}</h2>
                <p className="text-lg text-sepia-text/80 dark:text-sepia-dark-text/80 leading-relaxed max-w-3xl font-serif mb-8">
                    {author.description || `Discover more about ${author.name}, the creator of these amazing series.`}
                </p>
                <AffiliateLink
                    href={`https://www.amazon.com/s?k=${encodeURIComponent(author.name)}&i=stripbooks`}
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-sepia-accent dark:bg-sepia-dark-accent text-white rounded-xl font-semibold hover:bg-sepia-text dark:hover:bg-sepia-dark-text transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Read full bio on Amazon &rarr;
                </AffiliateLink>
            </section>

            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            {author.id && <TrackAuthor id={author.id} />}
        </div>
    );
}
