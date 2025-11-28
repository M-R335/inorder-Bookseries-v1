import pool from "../lib/db";

async function checkDuplicates() {
    try {
        const res = await pool.query("SELECT id, name, author_id FROM series WHERE name ILIKE '%Jack Reacher%'");
        console.log("Jack Reacher Series Entries:", res.rows);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await pool.end();
    }
}

checkDuplicates();
