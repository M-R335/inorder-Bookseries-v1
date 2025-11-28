import pool from "../lib/db";

async function addDescriptionColumn() {
    try {
        console.log("Adding description column to authors table...");
        await pool.query(`
            ALTER TABLE authors 
            ADD COLUMN IF NOT EXISTS description TEXT;
        `);
        console.log("Column added successfully.");
    } catch (error) {
        console.error("Error adding column:", error);
    } finally {
        await pool.end();
    }
}

addDescriptionColumn();
