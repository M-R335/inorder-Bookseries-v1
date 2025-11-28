import pool from "../lib/db";

async function seedStats() {
    try {
        console.log("Seeding author_stats...");

        // Get some popular authors
        const authors = await pool.query("SELECT id, name FROM authors WHERE name IN ('J.K. Rowling', 'Lee Child', 'Stephen King', 'Agatha Christie', 'James Patterson')");

        for (const author of authors.rows) {
            const clicks = Math.floor(Math.random() * 500) + 100; // Random clicks between 100-600
            console.log(`Seeding ${author.name} with ${clicks} clicks...`);

            await pool.query(`
                INSERT INTO author_stats (author_id, clicks_weekly, last_updated)
                VALUES ($1, $2, NOW())
                ON CONFLICT (author_id) 
                DO UPDATE SET clicks_weekly = $2, last_updated = NOW()
            `, [author.id, clicks]);
        }

        console.log("Seeding complete.");
    } catch (error) {
        console.error("Error seeding stats:", error);
    } finally {
        await pool.end();
    }
}

seedStats();
