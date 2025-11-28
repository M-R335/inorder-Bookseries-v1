import pool from "../lib/db";

async function updateTrackingSchema() {
    try {
        console.log("Updating tracking schema...");

        // 1. series_clicks_daily (Daily stats)
        // User requested: day, series_id, clicks
        await pool.query(`
            CREATE TABLE IF NOT EXISTS series_clicks_daily (
                day DATE DEFAULT CURRENT_DATE,
                series_id INTEGER REFERENCES series(id),
                clicks INTEGER DEFAULT 0,
                PRIMARY KEY (day, series_id)
            );
        `);
        console.log("Created/Verified series_clicks_daily table.");

        // 2. series_stats (Overall stats)
        // User requested: series_id, total_clicks
        await pool.query(`
            CREATE TABLE IF NOT EXISTS series_stats (
                series_id INTEGER PRIMARY KEY REFERENCES series(id),
                total_clicks INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Created/Verified series_stats table.");

        // 3. author_stats (Weekly/Trending stats) - Already exists from previous step, but good to ensure
        await pool.query(`
            CREATE TABLE IF NOT EXISTS author_stats (
                author_id INTEGER PRIMARY KEY REFERENCES authors(id),
                clicks_weekly INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Verified author_stats table.");

        console.log("Tracking schema update complete.");
    } catch (error) {
        console.error("Error updating tracking schema:", error);
    } finally {
        await pool.end();
    }
}

updateTrackingSchema();
