import pool from "../lib/db";

async function populateCovers() {
    try {
        console.log("Fetching books with Amazon links...");
        const result = await pool.query(`
            SELECT id, title, amazon_link 
            FROM books 
            WHERE amazon_link IS NOT NULL 
            AND image_url IS NULL
        `);

        console.log(`Found ${result.rows.length} books to process.`);

        let updatedCount = 0;

        for (const book of result.rows) {
            const link = book.amazon_link;
            // Regex to find ASIN: look for /dp/ASIN or /product/ASIN or /gp/product/ASIN
            // ASIN is usually 10 characters, alphanumeric, starting with B or numbers (for ISBN-10)
            const asinMatch = link.match(/(?:\/dp\/|\/gp\/product\/|\/product\/)([A-Z0-9]{10})/);

            if (asinMatch && asinMatch[1]) {
                const asin = asinMatch[1];
                // Construct Amazon Image URL
                // Format: https://images-na.ssl-images-amazon.com/images/P/[ASIN].01.L.jpg
                const imageUrl = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`;

                await pool.query(`
                    UPDATE books 
                    SET image_url = $1 
                    WHERE id = $2
                `, [imageUrl, book.id]);

                updatedCount++;
                if (updatedCount % 100 === 0) {
                    console.log(`Updated ${updatedCount} books...`);
                }
            }
        }

        console.log(`Finished! Updated ${updatedCount} books with cover images.`);

    } catch (error) {
        console.error("Error populating covers:", error);
    } finally {
        await pool.end();
    }
}

populateCovers();
