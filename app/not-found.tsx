import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-4xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-4">Page Not Found</h2>
            <p className="text-lg text-sepia-text/80 dark:text-sepia-dark-text/80 mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 bg-sepia-accent dark:bg-sepia-dark-accent text-white rounded-xl font-semibold hover:bg-sepia-text dark:hover:bg-sepia-dark-text transition-colors"
                >
                    Return Home
                </Link>
                <Link
                    href="/authors"
                    className="px-6 py-3 bg-white dark:bg-sepia-dark-bg text-sepia-text dark:text-sepia-dark-text font-semibold rounded-xl border border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 hover:border-sepia-accent dark:hover:border-sepia-dark-accent transition-colors"
                >
                    Browse Authors
                </Link>
            </div>
        </div>
    )
}
