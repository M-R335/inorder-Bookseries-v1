import pool from "../lib/db";

async function fixBio() {
    try {
        console.log("Clearing bio for A. American...");
        await pool.query("UPDATE authors SET description = NULL WHERE name = 'A. American'");
        console.log("Done.");

        // Optional: Check for other suspicious bios (e.g. containing 'football' but not 'book')
        const suspicious = await pool.query("SELECT id, name, description FROM authors WHERE description ILIKE '%football%' AND description NOT ILIKE '%book%'");
        console.log("Other suspicious 'football' bios:", suspicious.rows.map(r => r.name));

        if (suspicious.rows.length > 0) {
            console.log("Clearing suspicious bios...");
            for (const row of suspicious.rows) {
                await pool.query("UPDATE authors SET description = NULL WHERE id = $1", [row.id]);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await pool.end();
    }
}

fixBio();
