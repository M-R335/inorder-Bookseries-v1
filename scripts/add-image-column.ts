import pool from "../lib/db";

async function addImageColumn() {
    try {
        console.log("Adding image_url column to books table...");
        await pool.query(`
            ALTER TABLE books 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `);
        console.log("Column added successfully.");
    } catch (error) {
        console.error("Error adding column:", error);
    } finally {
        await pool.end();
    }
}

addImageColumn();
