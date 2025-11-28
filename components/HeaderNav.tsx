"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

export default function HeaderNav() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Search", href: "/search" },
        { label: "Authors", href: "/authors" },
        { label: "Series", href: "/series" },
        { label: "About", href: "/about" },
    ];

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname?.startsWith(href);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className="flex items-center gap-4">
                {/* Hamburger Button - Mobile Only, positioned absolutely to appear at far left */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden absolute left-4 p-2 text-sepia-text dark:text-sepia-dark-text hover:text-sepia-accent dark:hover:text-sepia-dark-accent transition-colors"
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isMobileMenuOpen ? (
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                <ThemeToggle />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`text-base font-medium transition-all duration-200 relative group ${isActive(item.href)
                                ? "text-sepia-text dark:text-sepia-dark-text"
                                : "text-sepia-text/70 dark:text-sepia-dark-text/70 hover:text-sepia-accent dark:hover:text-sepia-dark-accent"
                                }`}
                        >
                            {item.label}
                            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-sepia-accent dark:bg-sepia-dark-accent transform origin-left transition-transform duration-300 ${isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                }`} />
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-sepia-bg dark:bg-sepia-dark-bg border-r border-sepia-secondary/10 dark:border-sepia-dark-secondary/10 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text">
                            Menu
                        </h2>
                        <button
                            onClick={closeMobileMenu}
                            className="p-2 text-sepia-text dark:text-sepia-dark-text hover:text-sepia-accent dark:hover:text-sepia-dark-accent transition-colors"
                            aria-label="Close menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={`text-lg font-medium py-3 px-4 rounded-lg transition-all duration-200 ${isActive(item.href)
                                    ? "bg-sepia-accent/10 dark:bg-sepia-dark-accent/10 text-sepia-accent dark:text-sepia-dark-accent"
                                    : "text-sepia-text/70 dark:text-sepia-dark-text/70 hover:bg-sepia-secondary/5 dark:hover:bg-sepia-dark-secondary/5 hover:text-sepia-text dark:hover:text-sepia-dark-text"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
