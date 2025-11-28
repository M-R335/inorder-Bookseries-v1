import { slugify } from "../lib/utils";

async function testWikipedia() {
    const authors = ["J.K. Rowling", "Lee Child", "Stephen King", "Agatha Christie"];

    for (const author of authors) {
        try {
            // Wiki expects underscores for spaces, and proper capitalization
            // But usually it handles redirects.
            const wikiSlug = author.replace(/ /g, "_");
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiSlug)}`;

            console.log(`Fetching ${author} from ${url}...`);
            const res = await fetch(url);

            if (res.ok) {
                const data = await res.json();
                console.log(`SUCCESS: Found bio for ${author}`);
                console.log(`Extract: ${data.extract.substring(0, 100)}...`);
            } else {
                console.log(`FAILED: ${res.status} for ${author}`);
            }
        } catch (error) {
            console.error(`ERROR for ${author}:`, error);
        }
    }
}

testWikipedia();
