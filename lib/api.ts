import pool from "./db";
import { slugify, deslugify } from "./utils";

export interface Book {
    id?: number; // Added for unique keys
    title: string;
    slug: string;
    coverImage?: string;
    publicationYear: number;
    isbn?: string;
    description?: string;
    amazonLink?: string;
    imageUrl?: string;
}

export interface Series {
    id?: number;
    name: string;
    slug: string;
    authorSlug: string;
    description?: string;
    books: Book[];
}

export interface Author {
    id?: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    series: Series[];
    standalones?: Book[];
}

// Helper to map DB rows to our interfaces
async function mapAuthorRow(row: any): Promise<Author> {
    // Fetch series for this author
    const seriesResult = await pool.query(
        `SELECT * FROM series WHERE author_id = $1 ORDER BY name`,
        [row.id]
    );

    const seriesList: Series[] = await Promise.all(
        seriesResult.rows.map(async (sRow: any) => {
            const booksResult = await pool.query(
                `SELECT * FROM books WHERE series_id = $1 ORDER BY id ASC`,
                [sRow.id]
            );

            const books: Book[] = booksResult.rows.map((bRow: any) => ({
                id: bRow.id,
                title: bRow.title,
                slug: bRow.slug || slugify(bRow.title),
                publicationYear: parseInt(bRow.publish_year) || 0,
                amazonLink: bRow.amazon_link,
                imageUrl: bRow.image_url,
            }));

            return {
                id: sRow.id,
                name: sRow.name,
                slug: sRow.slug || slugify(sRow.name),
                authorSlug: row.slug || slugify(row.name),
                description: sRow.description,
                books,
            };
        })
    );

    return {
        id: row.id,
        name: row.name,
        slug: row.slug || slugify(row.name),
        description: row.description || `Author of ${row.num_series} series.`,
        series: seriesList,
    };
}

export async function getAllAuthors(): Promise<Author[]> {
    try {
        // Optimization: Only fetch basic info. Do NOT fetch series/books for the list view.
        const result = await pool.query("SELECT name, slug FROM authors ORDER BY name");

        return result.rows.map((row: any) => ({
            name: row.name,
            slug: row.slug || slugify(row.name),
            description: "",
            series: [], // Empty series for list view to avoid N+1 queries
        }));
    } catch (error) {
        console.error("Error fetching authors:", error);
        return [];
    }
}

export async function getPopularAuthors(): Promise<Author[]> {
    try {
        // Fetch a small subset of authors for the homepage
        // Ideally this would be based on popularity, but random or first 6 is fine for now
        const result = await pool.query("SELECT name, slug FROM authors LIMIT 6");

        return result.rows.map((row: any) => ({
            name: row.name,
            slug: row.slug || slugify(row.name),
            description: "Popular author",
            series: [],
        }));
    } catch (error) {
        console.error("Error fetching popular authors:", error);
        return [];
    }
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
    try {
        // Optimization: Fetch directly by slug column (indexed)
        const result = await pool.query("SELECT * FROM authors WHERE slug = $1", [slug]);

        if (result.rows.length === 0) return undefined;

        return mapAuthorRow(result.rows[0]);
    } catch (error) {
        console.error("Error fetching author by slug:", error);
        return undefined;
    }
}

export async function getAllSeries(): Promise<Series[]> {
    try {
        // Optimization: Only fetch basic info for the list view.
        // Do NOT fetch books for every series to avoid N+1 queries.
        const result = await pool.query(`
            SELECT s.id, s.name, s.slug, a.name as author_name, a.slug as author_slug 
            FROM series s 
            JOIN authors a ON s.author_id = a.id 
            ORDER BY s.name
        `);

        return result.rows.map((row: any) => ({
            id: row.id, // Added ID for React keys
            name: row.name,
            slug: row.slug || slugify(row.name),
            authorSlug: row.author_slug || slugify(row.author_name),
            books: [], // Empty books for list view
        }));
    } catch (error) {
        console.error("Error fetching all series:", error);
        return [];
    }
}



export async function getSeriesBySlug(slug: string): Promise<Series | undefined> {
    try {
        // Optimization: Fetch directly by slug column (indexed)
        const result = await pool.query(`
            SELECT s.*, a.name as author_name, a.slug as author_slug
            FROM series s 
            JOIN authors a ON s.author_id = a.id 
            WHERE s.slug = $1
        `, [slug]);

        if (result.rows.length === 0) return undefined;

        const row = result.rows[0];
        // ORDER BY id ASC as requested
        const booksResult = await pool.query(
            `SELECT * FROM books WHERE series_id = $1 ORDER BY id ASC`,
            [row.id]
        );

        const books: Book[] = booksResult.rows.map((bRow: any) => ({
            id: bRow.id,
            title: bRow.title,
            slug: bRow.slug || slugify(bRow.title), // Use DB slug if available, else fallback
            publicationYear: parseInt(bRow.publish_year) || 0,
            amazonLink: bRow.amazon_link,
            imageUrl: bRow.image_url,
        }));

        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            authorSlug: row.author_slug || slugify(row.author_name),
            books,
        };
    } catch (error) {
        console.error("Error fetching series by slug:", error);
        return undefined;
    }
}

export async function getRecentUpdates(): Promise<Series[]> {
    try {
        // Fetch recently updated series
        const result = await pool.query(`
            SELECT s.*, a.name as author_name, a.slug as author_slug
            FROM series s 
            JOIN authors a ON s.author_id = a.id 
            LIMIT 6
        `);

        return Promise.all(
            result.rows.map(async (row: any) => {
                // ORDER BY id ASC
                const booksResult = await pool.query(
                    `SELECT * FROM books WHERE series_id = $1 ORDER BY id ASC`,
                    [row.id]
                );

                const books: Book[] = booksResult.rows.map((bRow: any) => ({
                    id: bRow.id,
                    title: bRow.title,
                    slug: bRow.slug || slugify(bRow.title),
                    publicationYear: parseInt(bRow.publish_year) || 0,
                    amazonLink: bRow.amazon_link,
                    imageUrl: bRow.image_url,
                }));

                return {
                    id: row.id,
                    name: row.name,
                    slug: row.slug || slugify(row.name),
                    authorSlug: row.author_slug || slugify(row.author_name),
                    books,
                };
            })
        );
    } catch (error) {
        console.error("Error fetching recent updates:", error);
        return [];
    }
}

// --- Tracking & Trending Functions ---

export async function incrementAuthorClick(authorId: number) {
    try {
        await pool.query(`
            INSERT INTO author_stats (author_id, clicks_weekly, last_updated)
            VALUES ($1, 1, NOW())
            ON CONFLICT (author_id) 
            DO UPDATE SET clicks_weekly = author_stats.clicks_weekly + 1, last_updated = NOW()
        `, [authorId]);
    } catch (error) {
        console.error("Error incrementing author click:", error);
    }
}

export async function incrementSeriesClick(seriesId: number) {
    try {
        // 1. Update Daily Stats (series_clicks_daily)
        await pool.query(`
            INSERT INTO series_clicks_daily (day, series_id, clicks)
            VALUES (CURRENT_DATE, $1, 1)
            ON CONFLICT (day, series_id) 
            DO UPDATE SET clicks = series_clicks_daily.clicks + 1
        `, [seriesId]);

        // 2. Update Weekly Stats (series_stats)
        await pool.query(`
            INSERT INTO series_stats (series_id, clicks_weekly, last_updated)
            VALUES ($1, 1, NOW())
            ON CONFLICT (series_id) 
            DO UPDATE SET clicks_weekly = series_stats.clicks_weekly + 1, last_updated = NOW()
        `, [seriesId]);

    } catch (error) {
        console.error("Error incrementing series click:", error);
    }
}

export async function getTrendingAuthors(): Promise<Author[]> {
    try {
        // Top 3 authors by weekly clicks
        const result = await pool.query(`
            SELECT a.id, a.name, s.clicks_weekly
            FROM authors a
            JOIN author_stats s ON a.id = s.author_id
            ORDER BY s.clicks_weekly DESC
            LIMIT 3
        `);

        // If no stats yet, fallback to random/popular
        if (result.rows.length === 0) {
            return getPopularAuthors(); // Fallback
        }

        return result.rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            slug: slugify(row.name),
            description: "Trending Author",
            series: [],
        }));
    } catch (error) {
        console.error("Error fetching trending authors:", error);
        return [];
    }
}

export async function getFeaturedAuthor(): Promise<Author | undefined> {
    try {
        // Get #1 trending author
        const result = await pool.query(`
            SELECT a.id, a.name
            FROM authors a
            JOIN author_stats s ON a.id = s.author_id
            ORDER BY s.clicks_weekly DESC
            LIMIT 1
        `);

        if (result.rows.length === 0) return undefined;

        const authorId = result.rows[0].id;
        const fullAuthorResult = await pool.query("SELECT * FROM authors WHERE id = $1", [authorId]);
        return mapAuthorRow(fullAuthorResult.rows[0]);
    } catch (error) {
        console.error("Error fetching featured author:", error);
        return undefined;
    }
}

export async function searchEverything(query: string) {
    if (!query || query.length < 2) return { authors: [], series: [], books: [] };

    try {
        // Normalize query for fuzzy matching (remove dots and spaces)
        // This allows "jk rowling" to match "J.K. Rowling"
        const cleanQuery = query.replace(/[. ]/g, "");
        const fuzzyParam = `%${cleanQuery}%`;
        const normalParam = `%${query}%`;

        const authorsResult = await pool.query(`
            SELECT name, slug FROM authors 
             WHERE name ILIKE $1 
             OR REPLACE(REPLACE(name, '.', ''), ' ', '') ILIKE $2 
             LIMIT 10`,
            [normalParam, fuzzyParam]
        );

        const seriesResult = await pool.query(`
            SELECT name, slug FROM series 
             WHERE name ILIKE $1 
             OR REPLACE(REPLACE(name, '.', ''), ' ', '') ILIKE $2 
             LIMIT 10`,
            [normalParam, fuzzyParam]
        );

        const booksResult = await pool.query(`
            SELECT title, slug, amazon_link, image_url, publish_year FROM books 
             WHERE title ILIKE $1 
             OR REPLACE(REPLACE(title, '.', ''), ' ', '') ILIKE $2 
             LIMIT 20`,
            [normalParam, fuzzyParam]
        );

        // Helper to deduplicate by slug
        const unique = (items: any[]) => {
            const seen = new Set();
            return items.filter(item => {
                const duplicate = seen.has(item.slug);
                seen.add(item.slug);
                return !duplicate;
            });
        };

        return {
            authors: unique(authorsResult.rows.map((row: any) => ({
                name: row.name,
                slug: row.slug || slugify(row.name),
                url: `/authors/${row.slug || slugify(row.name)}`
            }))),
            series: unique(seriesResult.rows.map((row: any) => ({
                name: row.name,
                slug: row.slug || slugify(row.name),
                url: `/series/${row.slug || slugify(row.name)}`
            }))),
            books: unique(booksResult.rows.map((row: any) => ({
                title: row.title,
                slug: row.slug || slugify(row.title),
                publicationYear: parseInt(row.publish_year) || 0,
                amazonLink: row.amazon_link,
                imageUrl: row.image_url,
            }))),
        };
    } catch (error) {
        console.error("Search error:", error);
        return { authors: [], series: [], books: [] };
    }
}

export async function getTodaysPopularSeries(): Promise<Series[]> {
    try {
        // Fetch top 5 series by daily clicks
        const result = await pool.query(`
            SELECT s.id, s.name, s.slug, a.name as author_name, a.slug as author_slug, d.clicks
            FROM series s
            JOIN series_clicks_daily d ON s.id = d.series_id
            JOIN authors a ON s.author_id = a.id
            WHERE d.day = CURRENT_DATE
            ORDER BY d.clicks DESC
            LIMIT 5
        `);

        // If no clicks today, fallback to random/recent
        if (result.rows.length === 0) {
            const fallback = await pool.query(`
                SELECT s.id, s.name, s.slug, a.name as author_name, a.slug as author_slug 
                FROM series s 
                JOIN authors a ON s.author_id = a.id 
                ORDER BY RANDOM() 
                LIMIT 5
            `);
            return fallback.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                slug: row.slug || slugify(row.name),
                authorSlug: row.author_slug || slugify(row.author_name),
                books: [],
            }));
        }

        return result.rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            slug: row.slug || slugify(row.name),
            authorSlug: row.author_slug || slugify(row.author_name),
            books: [],
        }));
    } catch (error) {
        console.error("Error fetching today's popular series:", error);
        return [];
    }
}
