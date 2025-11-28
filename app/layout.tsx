import type { Metadata, Viewport } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const crimsonPro = Crimson_Pro({
    weight: ["200", "300", "400", "500", "600", "700", "900"],
    subsets: ["latin"],
    variable: "--font-serif",
});

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fdf6e3" },
        { media: "(prefers-color-scheme: dark)", color: "#2b2b2b" },
    ],
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL("https://inorderbookseries.com"),
    title: {
        default: "Reading Order Books | Complete Series & Author Guides",
        template: "%s | Reading Order Books",
    },
    description: "Find the complete reading order for your favorite book series and authors. Comprehensive guides for book lovers to read in the correct order.",
    keywords: ["reading order", "book series", "author bibliography", "book list", "chronological reading order"],
    authors: [{ name: "Reading Order Books Team" }],
    creator: "Reading Order Books",
    publisher: "Reading Order Books",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://inorderbookseries.com",
        title: "Reading Order Books | Complete Series & Author Guides",
        description: "Find the complete reading order for your favorite book series and authors. Comprehensive guides for book lovers.",
        siteName: "Reading Order Books",
        images: [
            {
                url: "/og-image.jpg", // Make sure this exists or use a default
                width: 1200,
                height: 630,
                alt: "Reading Order Books",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Reading Order Books | Complete Series & Author Guides",
        description: "Find the complete reading order for your favorite book series and authors.",
        images: ["/og-image.jpg"], // Fallback to OG image
    },
    icons: {
        icon: "/book2.svg",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${crimsonPro.variable}`} suppressHydrationWarning>
            <body className="bg-sepia-bg dark:bg-sepia-dark-bg text-sepia-text dark:text-sepia-dark-text font-sans antialiased transition-colors duration-300">
                <div className="min-h-screen flex flex-col">
                    {/* Header */}
                    <header className="bg-sepia-bg/95 dark:bg-sepia-dark-bg/95 border-b border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 sticky top-0 z-50 backdrop-blur-md transition-all duration-300">
                        <div className="container h-24 flex items-center justify-between">
                            <Link href="/" className="flex items-center space-x-3 group pl-14 md:pl-0">
                                <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
                                    <Image
                                        src="/logo.png"
                                        alt="Reading Order Books Logo"
                                        fill
                                        sizes="40px"
                                        className="object-contain block dark:hidden"
                                        priority
                                    />
                                    <Image
                                        src="/logo2.png"
                                        alt="Reading Order Books Logo"
                                        fill
                                        sizes="40px"
                                        className="object-contain hidden dark:block"
                                        priority
                                    />
                                </div>
                                <span className="text-2xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text tracking-tight group-hover:text-sepia-accent dark:group-hover:text-sepia-dark-accent transition-colors">
                                    Reading Order
                                </span>
                            </Link>
                            <HeaderNav />
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-grow container py-12 md:py-16 w-full">
                        {children}
                    </main>

                    <Footer />
                </div>
            </body>
        </html>
    );
}
