import pool from "../lib/db";

async function populateBios() {
    try {
        console.log("Fetching authors without descriptions...");
        const result = await pool.query(`
            SELECT id, name 
            FROM authors 
            WHERE description IS NULL OR description = ''
        `);

        console.log(`Found ${result.rows.length} authors to process.`);

        let updatedCount = 0;
        let notFoundCount = 0;

        for (const author of result.rows) {
            try {
                // Wiki expects underscores for spaces
                let wikiSlug = author.name.replace(/ /g, "_");
                let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiSlug)}`;

                let res = await fetch(url);

                // If direct lookup fails, try searching
                if (!res.ok) {
                    // console.log(`Direct lookup failed for ${author.name}, searching...`);
                    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(author.name)}&format=json`;
                    const searchRes = await fetch(searchUrl);
                    if (searchRes.ok) {
                        const searchData = await searchRes.json();
                        if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
                            const bestMatch = searchData.query.search[0];
                            // console.log(`Found match for ${author.name}: ${bestMatch.title}`);
                            wikiSlug = bestMatch.title.replace(/ /g, "_");
                            url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiSlug)}`;
                            res = await fetch(url);
                        }
                    }
                }

                if (res.ok) {
                }
            } catch (err) {
                console.error(`Error fetching bio for ${author.name}:`, err);
            }

            // Be nice to Wikipedia API
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log(`Finished! Updated ${updatedCount} authors. Could not find ${notFoundCount}.`);

    } catch (error) {
        console.error("Error populating bios:", error);
    } finally {
        await pool.end();
    }
}

populateBios();
