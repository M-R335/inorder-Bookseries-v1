import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Reading Order",
    description: "Learn about the mission behind Reading Order Books - helping readers find their way through series without the frustration.",
    alternates: {
        canonical: "https://inorderbookseries.com/about",
    },
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-8 border-b-2 border-sepia-accent/30 dark:border-sepia-dark-accent/30 pb-4">
                About Reading Order
            </h1>

            <div className="prose prose-lg prose-sepia dark:prose-invert max-w-none font-serif text-sepia-text/80 dark:text-sepia-dark-text/80 leading-relaxed">
                <p>
                    Reading Order is built for readers who just want a clear path through a series without digging through search results, forum threads, or publisher pages. The goal is simple: make it easy to see what comes first, what comes next, and how it all fits together.
                </p>

                <h3 className="text-2xl font-bold text-sepia-text dark:text-sepia-dark-text mt-8 mb-4">Why this site exists</h3>
                <p>
                    Many readers have run into the same problem: picking up a book and discovering it’s book three, trying to gift a series and not knowing where to start, or wanting to reread in the proper order but not being sure which list to trust.
                </p>
                <p>
                    This site grew out of a simple passion for helping people enjoy stories without the frustration. It’s designed to be a calm, reliable place you can open in a browser, type an author or title, and immediately see a clean, organized reading order.
                </p>

                <h3 className="text-2xl font-bold text-sepia-text dark:text-sepia-dark-text mt-8 mb-4">What you’ll find here</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Series reading order</strong> – numbered from book one onward, so you can start in the right place.</li>
                    <li><strong>Publication years</strong> – to show how a series has unfolded over time.</li>
                    <li><strong>Clear book links</strong> – quick ways to jump out and learn more about a specific title or find a copy.</li>
                    <li><strong>Notes on tricky orders</strong> – when publication and in-world chronology differ, pages will call that out or provide a separate list.</li>
                </ul>
                <p>
                    The emphasis is on clarity over clutter: clean typography, consistent layout, and a straightforward search experience.
                </p>

                <h3 className="text-2xl font-bold text-sepia-text dark:text-sepia-dark-text mt-8 mb-4">How the information is kept current</h3>
                <p>
                    The underlying database is updated over time as new authors and books are added, and existing series are extended. Entries may be reviewed when:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>New books are released in an ongoing series.</li>
                    <li>Alternate titles or new editions appear.</li>
                    <li>Readers report a missing, mis-ordered, or mis-labeled book.</li>
                </ul>
                <p>
                    When something is wrong—whether it’s a missing title or a date that doesn’t match your copy—the intention is to correct it as quickly as possible so the site remains a dependable reference.
                </p>

                <h3 className="text-2xl font-bold text-sepia-text dark:text-sepia-dark-text mt-8 mb-4">Linking to Reading Order</h3>
                <p>
                    If you’d like to link to the site from your own blog, website, or reading group page, you’re welcome to do so. A simple text link works well, for example:
                </p>
                <div className="bg-white/50 dark:bg-sepia-dark-bg/50 p-4 rounded-lg border border-sepia-accent/20 dark:border-sepia-dark-accent/20 my-4 font-mono text-sm text-sepia-text dark:text-sepia-dark-text">
                    &lt;a href="https://inorderbookseries.com/"&gt;Reading Order&lt;/a&gt;
                </div>
                <p>
                    Sharing the site helps other readers find clear reading orders without having to puzzle it out themselves.
                </p>

                <h3 className="text-2xl font-bold text-sepia-text dark:text-sepia-dark-text mt-8 mb-4">Suggestions and corrections</h3>
                <p>
                    Reader feedback is a big part of keeping things accurate. If you notice a missing book, a title in the wrong spot, or anything else that doesn’t look right, please feel free to reach out using the contact form on the site.
                </p>
                <p>
                    Whether it’s a quick correction or a request for a new series, every message helps make Reading Order more useful for everyone who visits after you.
                </p>
                <p className="italic mt-8">
                    Thanks again for visiting, and happy reading.
                </p>
            </div>
        </div>
    );
}
