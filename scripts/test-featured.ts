import pool from "../lib/db";
import { slugify } from "../lib/utils";

async function testFeaturedAuthor() {
    try {
        console.log("Testing getFeaturedAuthor logic...");

        // Step 1: Get #1 trending author
        const result = await pool.query(`
            SELECT a.id, a.name
            FROM authors a
            JOIN author_stats s ON a.id = s.author_id
            ORDER BY s.clicks_weekly DESC
            LIMIT 1
        `);

        console.log("Step 1: Top author from query:", result.rows);

        if (result.rows.length === 0) {
            console.log("No trending authors found!");
            return;
        }

        const authorId = result.rows[0].id;
        console.log(`\nStep 2: Fetching full details for author ID ${authorId}...`);

        // Step 2: Fetch full author details
        const fullAuthorResult = await pool.query("SELECT * FROM authors WHERE id = $1", [authorId]);
        console.log("Full author row:", fullAuthorResult.rows[0]);

        // Step 3: Fetch series for this author
        const seriesResult = await pool.query(
            `SELECT * FROM series WHERE author_id = $1 ORDER BY name`,
            [authorId]
        );
        console.log(`\nStep 3: Found ${seriesResult.rows.length} series for this author`);

        // Step 4: Fetch books for the first series (if any)
        if (seriesResult.rows.length > 0) {
            const firstSeriesId = seriesResult.rows[0].id;
            const booksResult = await pool.query(
                `SELECT * FROM books WHERE series_id = $1 ORDER BY id ASC`,
                [firstSeriesId]
            );
            console.log(`\nStep 4: Found ${booksResult.rows.length} books in first series`);
            console.log("Sample book:", booksResult.rows[0]);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await pool.end();
    }
}

testFeaturedAuthor();
