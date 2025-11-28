import Link from "next/link";
import { getAllAuthors } from "@/lib/api";
import AuthorList from "@/components/AuthorList";
import JsonLd from "@/components/JsonLd";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Authors – Reading Order Books",
    description: "Browse our complete list of authors and find their book series in order.",
    alternates: {
        canonical: "https://readingorderbooks.com/authors",
    },
    openGraph: {
        title: "All Authors – Reading Order Books",
        description: "Browse our complete list of authors and find their book series in order.",
        url: "https://readingorderbooks.com/authors",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Reading Order Books Authors",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "All Authors – Reading Order Books",
        description: "Browse our complete list of authors and find their book series in order.",
        images: ["/og-image.jpg"],
    },
};

export default async function AuthorsPage() {
    const authors = await getAllAuthors();

    // Sort authors alphabetically
    const sortedAuthors = authors.sort((a, b) => a.name.localeCompare(b.name));

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
        ],
    };

    return (
        <div>
            <JsonLd data={breadcrumbLd} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-10 tracking-tight">Authors</h1>
            <AuthorList authors={sortedAuthors} />
        </div>
    );
}
