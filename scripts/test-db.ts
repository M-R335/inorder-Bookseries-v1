import pool from "../lib/db";

async function test() {
    try {
        console.log("Testing DB connection...");
        const res = await pool.query("SELECT NOW()");
        console.log("DB Connected Successfully:", res.rows[0]);

        const authors = await pool.query("SELECT count(*) FROM authors");
        console.log("Author count:", authors.rows[0].count);
    } catch (e) {
        console.error("DB Connection Failed:", e);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

test();
