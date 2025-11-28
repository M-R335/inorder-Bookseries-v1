import pool from "../lib/db";

async function checkSchema() {
    try {
        const result = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'books';
        `);
        console.log("Books table columns:", result.rows);
    } catch (error) {
        console.error("Error checking schema:", error);
    } finally {
        await pool.end();
    }
}

checkSchema();
