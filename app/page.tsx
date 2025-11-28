import Link from "next/link";
import { Suspense } from "react";
import { getTrendingAuthors, getFeaturedAuthor } from "@/lib/api";
import JsonLd from "@/components/JsonLd";
import Search from "@/components/Search";
import BookGallery from "@/components/BookGallery";

export const metadata = {
    title: "Reading Order Books – Book Series in Order by Author",
    description: "Find the complete reading order for your favorite book series and authors. Comprehensive guides for book lovers.",
    alternates: {
        canonical: "https://inorderbookseries.com",
    },
};

export default async function Home() {
    const authors = await getTrendingAuthors();
    const featuredAuthor = await getFeaturedAuthor();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Reading Order Books",
        url: "https://inorderbookseries.com",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://inorderbookseries.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <div className="space-y-16">
            <JsonLd data={jsonLd} />

            {/* Hero Section */}
            <section className="text-center space-y-6 py-8 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text tracking-tight leading-tight">
                    Find the reading order for <span className="relative inline-block px-2">
                        any series
                        <span className="absolute bottom-1 left-0 w-full h-4 bg-sepia-accent/30 dark:bg-sepia-dark-accent/30 -z-10 transform -rotate-1 rounded-sm"></span>
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-sepia-text/70 dark:text-sepia-dark-text/70 max-w-2xl mx-auto font-sans leading-relaxed">
                    Search by <strong className="font-semibold text-sepia-text dark:text-sepia-dark-text">series, book</strong>, or <strong className="font-semibold text-sepia-text dark:text-sepia-dark-text">author</strong>. Jump straight to the recommended reading order.
                </p>

                <div className="pt-2 pb-6">
                    <Suspense fallback={<div className="h-14 bg-white/50 rounded-xl animate-pulse"></div>}>
                        <Search />
                    </Suspense>
                </div>

                {/* Welcome Card */}
                <div className="bg-white dark:bg-sepia-dark-bg/50 p-6 md:p-8 rounded-2xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 text-left max-w-3xl mx-auto shadow-soft backdrop-blur-sm">
                    <h2 className="text-2xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-3">Welcome to your new reading nook</h2>
                    <p className="text-lg text-sepia-text/80 dark:text-sepia-dark-text/80 mb-6 leading-relaxed font-serif">
                        This site makes it easy to browse authors, explore their series, and see the correct order to read each one. Designed to be simple, fast, and distraction-free.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/search" className="bg-sepia-accent dark:bg-sepia-dark-accent text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-sepia-text dark:hover:bg-sepia-dark-text transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block text-center">
                            Start searching
                        </Link>
                        <Link href="/search?q=Jack+Reacher" className="bg-transparent border-2 border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 text-sepia-text dark:text-sepia-dark-text px-8 py-3.5 rounded-xl font-semibold hover:border-sepia-text dark:hover:border-sepia-dark-text hover:bg-sepia-secondary/5 transition-all duration-300 inline-block text-center">
                            Try a sample search
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trending Authors */}
            <section>
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text">Trending Authors</h2>
                    <Link href="/authors" className="text-sepia-link dark:text-sepia-dark-link font-medium hover:text-sepia-accent dark:hover:text-sepia-dark-accent transition-colors flex items-center gap-2">
                        View All <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {authors.map((author) => (
                        <Link
                            key={author.slug}
                            href={`/authors/${author.slug}`}
                            className="group block p-8 bg-white dark:bg-sepia-dark-bg/40 rounded-2xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 shadow-card hover:shadow-soft hover:border-sepia-accent/30 dark:hover:border-sepia-dark-accent/30 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <h3 className="text-xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text group-hover:text-sepia-accent dark:group-hover:text-sepia-dark-accent transition-colors mb-3">
                                {author.name}
                            </h3>
                            <p className="text-sepia-text/60 dark:text-sepia-dark-text/60 line-clamp-3 leading-relaxed text-sm">
                                {author.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Author Gallery */}
            {featuredAuthor && <BookGallery author={featuredAuthor} />}
        </div>
    );
}
