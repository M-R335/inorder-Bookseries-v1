import Link from "next/link";
import { getTodaysPopularSeries } from "@/lib/api";
import ContactForm from "./ContactForm";

export default async function Footer() {
    const todaysPopular = await getTodaysPopularSeries();

    return (
        <footer className="bg-sepia-bg dark:bg-sepia-dark-bg border-t border-sepia-accent/20 dark:border-sepia-dark-accent/20 mt-auto pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Column 1: Today's Popular Series */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6">Today's Popular Series</h3>
                        <ul className="space-y-3">
                            {todaysPopular.map((series) => (
                                <li key={series.id || series.slug}>
                                    <Link href={`/series/${series.slug}`} className="text-sepia-link dark:text-sepia-dark-link hover:text-sepia-accent dark:hover:text-sepia-dark-accent transition-colors">
                                        {series.name}
                                    </Link>
                                </li>
                            ))}
                            {todaysPopular.length === 0 && (
                                <li className="text-sepia-text/60 dark:text-sepia-dark-text/60 italic">No data yet today.</li>
                            )}
                        </ul>
                    </div>

                    {/* Column 2: Thank You */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6">Thank you</h3>
                        <p className="text-sepia-text/80 dark:text-sepia-dark-text/80 leading-relaxed font-serif mb-4">
                            Thank you for stopping by and spending a little time here. I hope the reading orders help you discover new favourites and make it easier to enjoy the series you love.
                        </p>
                        <p className="text-xs text-sepia-text/50 dark:text-sepia-dark-text/50 leading-relaxed">
                            Please note: The links next to each book title lead to Amazon where you can read more about the book, check availability, or purchase a copy. As an Amazon Associate, I earn from qualifying purchases made through these links.
                        </p>
                    </div>

                    {/* Column 3: Contact Form */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-6">Contact us</h3>
                        <ContactForm />
                    </div>

                </div>

                <div className="border-t border-sepia-accent/20 dark:border-sepia-dark-accent/20 pt-8 text-center text-sepia-text/40 dark:text-sepia-dark-text/40 text-sm font-serif">
                    &copy; {new Date().getFullYear()} Reading Order Books. Crafted for book lovers.
                </div>
            </div>
        </footer>
    );
}
