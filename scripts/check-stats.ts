import pool from "../lib/db";

async function checkStats() {
    try {
        console.log("Checking author_stats table...");
        const res = await pool.query("SELECT * FROM author_stats ORDER BY clicks_weekly DESC LIMIT 10");
        console.log("Top 10 Authors by Weekly Clicks:", res.rows);

        console.log("Checking total count of stats:");
        const count = await pool.query("SELECT COUNT(*) FROM author_stats");
        console.log("Total rows in author_stats:", count.rows[0].count);

        console.log("Checking specific author 'Jack Reacher' (Lee Child) stats if exists:");
        const leeChild = await pool.query("SELECT id FROM authors WHERE name = 'Lee Child'");
        if (leeChild.rows.length > 0) {
            const stats = await pool.query("SELECT * FROM author_stats WHERE author_id = $1", [leeChild.rows[0].id]);
            console.log("Lee Child Stats:", stats.rows);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await pool.end();
    }
}

checkStats();
