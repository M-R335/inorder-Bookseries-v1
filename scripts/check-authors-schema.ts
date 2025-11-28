import pool from "../lib/db";

async function checkAuthorsSchema() {
    try {
        const result = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'authors';
        `);
        console.log("Authors table columns:", result.rows);

        // Also check if any descriptions are populated
        const sample = await pool.query(`SELECT description FROM authors WHERE description IS NOT NULL AND description != '' LIMIT 5`);
        console.log("Sample descriptions:", sample.rows);
    } catch (error) {
        console.error("Error checking schema:", error);
    } finally {
        await pool.end();
    }
}

checkAuthorsSchema();
