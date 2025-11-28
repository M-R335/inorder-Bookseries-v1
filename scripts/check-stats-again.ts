import pool from "../lib/db";

async function checkStats() {
    try {
        console.log("Checking author_stats table...");
        const res = await pool.query("SELECT * FROM author_stats ORDER BY clicks_weekly DESC LIMIT 10");
        console.log("Top 10 Authors by Weekly Clicks:", res.rows);

        console.log("\nChecking if we have a #1 author:");
        const top = await pool.query("SELECT a.id, a.name FROM authors a JOIN author_stats s ON a.id = s.author_id ORDER BY s.clicks_weekly DESC LIMIT 1");
        console.log("Top author:", top.rows);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await pool.end();
    }
}

checkStats();
