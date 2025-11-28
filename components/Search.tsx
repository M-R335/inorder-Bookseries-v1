"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const pathname = usePathname();

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setQuery(q);
            // Trigger search immediately
            fetch(`/api/search?q=${encodeURIComponent(q)}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data.results);
                    // Only open dropdown if NOT on the search page
                    if (pathname !== "/search") {
                        setShowDropdown(true);
                    }
                })
                .catch(err => console.error("Error auto-searching:", err));
        }
    }, [searchParams, pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // Check for exact match in current results
            const exactMatch = results.find(
                r => r.name.toLowerCase() === query.toLowerCase() && (r.type === "Author" || r.type === "Series")
            );

            if (exactMatch) {
                router.push(exactMatch.url);
            } else {
                router.push(`/search?q=${encodeURIComponent(query)}`);
            }
            setShowDropdown(false);
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length >= 2) {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
                const data = await res.json();
                setResults(data.results);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        } else {
            setResults([]);
            setShowDropdown(false);
        }
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click
                    placeholder="Search for authors, series, or books..."
                    className="w-full px-6 py-4 text-lg rounded-xl border-2 border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 bg-white dark:bg-sepia-dark-bg/50 text-sepia-text dark:text-sepia-dark-text placeholder-sepia-text/40 dark:placeholder-sepia-dark-text/40 focus:outline-none focus:border-sepia-accent dark:focus:border-sepia-dark-accent focus:ring-2 focus:ring-sepia-accent/20 dark:focus:ring-sepia-dark-accent/20 transition-all shadow-sm"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sepia-text/40 dark:text-sepia-dark-text/40 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-sepia-dark-bg rounded-xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 shadow-lg z-50 overflow-hidden">
                    <ul>
                        {results.map((result, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => {
                                        router.push(result.url);
                                        setQuery(result.name); // Optional: update input
                                        setShowDropdown(false);
                                    }}
                                    className="w-full text-left px-6 py-3 hover:bg-sepia-bg dark:hover:bg-sepia-dark-bg/50 transition-colors flex items-center justify-between group"
                                >
                                    <span className="font-serif text-sepia-text dark:text-sepia-dark-text font-medium group-hover:text-sepia-accent dark:group-hover:text-sepia-dark-accent transition-colors">
                                        {result.name}
                                    </span>
                                    <span className="text-xs uppercase tracking-wider text-sepia-secondary dark:text-sepia-dark-secondary font-bold bg-sepia-secondary/10 dark:bg-sepia-dark-secondary/10 px-2 py-1 rounded">
                                        {result.type}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
