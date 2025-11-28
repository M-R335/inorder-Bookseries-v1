import pool from "../lib/db";

async function setupTrackingTables() {
    try {
        console.log("Setting up tracking tables...");

        // Table for weekly author stats (trending)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS author_stats (
                author_id INTEGER PRIMARY KEY REFERENCES authors(id),
                clicks_weekly INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Created author_stats table.");

        // Table for daily series stats (popular today)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS series_daily_stats (
                series_id INTEGER PRIMARY KEY REFERENCES series(id),
                clicks INTEGER DEFAULT 0,
                date DATE DEFAULT CURRENT_DATE
            );
        `);
        console.log("Created series_daily_stats table.");

        // Create an index on date for faster cleanup/lookup if needed
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_series_daily_stats_date ON series_daily_stats(date);
        `);

        console.log("Tracking tables setup complete.");
    } catch (error) {
        console.error("Error setting up tracking tables:", error);
    } finally {
        await pool.end();
    }
}

setupTrackingTables();
