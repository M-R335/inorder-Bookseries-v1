import pool from "../lib/db";
import { slugify } from "../lib/utils";

async function migrate() {
    try {
        console.log("Starting SEO columns migration...");

        // 1. Add columns if they don't exist
        console.log("Adding columns...");
        await pool.query(`
            ALTER TABLE authors 
            ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
            ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP DEFAULT NOW();
        `);

        await pool.query(`
            ALTER TABLE series 
            ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
            ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP DEFAULT NOW();
        `);

        await pool.query(`
            ALTER TABLE books 
            ADD COLUMN IF NOT EXISTS slug TEXT,
            ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP DEFAULT NOW();
        `);
        // Note: Books slug might not be unique globally, but we index it for speed
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug);`);

        // 2. Populate Authors
        console.log("Populating Authors slugs...");
        const authors = await pool.query("SELECT id, name FROM authors WHERE slug IS NULL");
        for (const author of authors.rows) {
            const slug = slugify(author.name);
            // Handle potential duplicates (though unlikely for authors if names are unique)
            try {
                await pool.query("UPDATE authors SET slug = $1 WHERE id = $2", [slug, author.id]);
            } catch (e) {
                console.error(`Failed to update author ${author.name}:`, e);
                // Fallback for duplicates: append ID
                const newSlug = `${slug}-${author.id}`;
                await pool.query("UPDATE authors SET slug = $1 WHERE id = $2", [newSlug, author.id]);
            }
        }

        // 3. Populate Series
        console.log("Populating Series slugs...");
        const series = await pool.query("SELECT id, name FROM series WHERE slug IS NULL");
        for (const s of series.rows) {
            const slug = slugify(s.name);
            try {
                await pool.query("UPDATE series SET slug = $1 WHERE id = $2", [slug, s.id]);
            } catch (e) {
                console.error(`Failed to update series ${s.name}:`, e);
                const newSlug = `${slug}-${s.id}`;
                await pool.query("UPDATE series SET slug = $1 WHERE id = $2", [newSlug, s.id]);
            }
        }

        // 4. Populate Books
        console.log("Populating Books slugs...");
        // Do this in batches to avoid memory issues if there are many books
        let offset = 0;
        const limit = 1000;
        while (true) {
            const books = await pool.query(`SELECT id, title FROM books WHERE slug IS NULL LIMIT ${limit}`);
            if (books.rows.length === 0) break;

            for (const book of books.rows) {
                const slug = slugify(book.title);
                await pool.query("UPDATE books SET slug = $1 WHERE id = $2", [slug, book.id]);
            }
            console.log(`Processed ${books.rows.length} books...`);
        }

        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await pool.end();
    }
}

migrate();
