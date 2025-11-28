import pool from "../lib/db";

async function checkAuthorBio() {
    try {
        const authors = ["A. Bertram Chandler", "J.K. Rowling", "Stephen King"];

        for (const name of authors) {
            const res = await pool.query("SELECT name, description FROM authors WHERE name = $1", [name]);
            if (res.rows.length > 0) {
                console.log(`Author: ${res.rows[0].name}`);
                console.log(`Description Length: ${res.rows[0].description ? res.rows[0].description.length : 0}`);
                console.log(`Description Preview: ${res.rows[0].description ? res.rows[0].description.substring(0, 50) : "NULL"}`);
                console.log("---");
            } else {
                console.log(`Author ${name} not found in DB.`);
            }
        }
    } catch (error) {
        console.error("Error checking bio:", error);
    } finally {
        await pool.end();
    }
}

checkAuthorBio();
