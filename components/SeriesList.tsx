"use client";

import { useState } from "react";
import Link from "next/link";
import { Series } from "@/lib/api";

interface SeriesListProps {
    series: Series[];
}

export default function SeriesList({ series }: SeriesListProps) {
    const [filter, setFilter] = useState<string>("A");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const filteredSeries = series.filter((s) => {
        const firstChar = s.name.charAt(0).toUpperCase();
        if (filter === "#") {
            return !/^[A-Z]/.test(firstChar);
        }
        return firstChar === filter;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredSeries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSeries = filteredSeries.slice(startIndex, startIndex + itemsPerPage);

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="space-y-10">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                {alphabet.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => handleFilterChange(letter)}
                        className={`w-10 h-10 rounded-lg font-serif font-bold text-lg transition-all duration-200 flex items-center justify-center border ${filter === letter
                            ? "bg-sepia-accent dark:bg-sepia-dark-accent text-white border-sepia-accent dark:border-sepia-dark-accent shadow-md transform scale-105"
                            : "bg-white dark:bg-sepia-dark-bg/50 text-sepia-text dark:text-sepia-dark-text border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 hover:border-sepia-accent dark:hover:border-sepia-dark-accent hover:bg-sepia-bg dark:hover:bg-sepia-dark-bg"
                            }`}
                    >
                        {letter}
                    </button>
                ))}
            </div>

            {/* Series List */}
            <div className="bg-white dark:bg-sepia-dark-bg/40 rounded-2xl border border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 p-8 shadow-soft min-h-[300px]">
                {paginatedSeries.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mb-8">
                            {paginatedSeries.map((s) => (
                                <Link
                                    key={s.id || s.slug} // Use ID if available, fallback to slug
                                    href={`/series/${s.slug}`}
                                    className="group flex flex-col py-3 border-b border-dashed border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 last:border-0 hover:bg-sepia-bg/50 dark:hover:bg-sepia-dark-bg/50 rounded px-2 -mx-2 transition-colors"
                                >
                                    <span className="text-lg text-sepia-link dark:text-sepia-dark-link font-medium group-hover:text-sepia-accent dark:group-hover:text-sepia-dark-accent transition-colors">
                                        {s.name}
                                    </span>
                                    <span className="text-sm text-sepia-secondary dark:text-sepia-dark-secondary">
                                        by {s.authorSlug.replace(/-/g, " ")}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center border border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 bg-white dark:bg-sepia-dark-bg/50 text-sepia-text dark:text-sepia-dark-text hover:bg-sepia-bg dark:hover:bg-sepia-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${currentPage === page
                                            ? "bg-sepia-accent dark:bg-sepia-dark-accent text-white border-sepia-accent dark:border-sepia-dark-accent font-bold"
                                            : "bg-white dark:bg-sepia-dark-bg/50 text-sepia-text dark:text-sepia-dark-text border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 hover:bg-sepia-bg dark:hover:bg-sepia-dark-bg"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center border border-sepia-secondary/20 dark:border-sepia-dark-secondary/20 bg-white dark:bg-sepia-dark-bg/50 text-sepia-text dark:text-sepia-dark-text hover:bg-sepia-bg dark:hover:bg-sepia-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-sepia-text/60 dark:text-sepia-dark-text/60 font-serif italic">
                            No series found starting with "{filter}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
