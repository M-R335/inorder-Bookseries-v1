async function testSources() {
    const author = "A.A. Albright";
    console.log(`Testing sources for: ${author}`);

    // 1. Google Books API
    try {
        console.log("\n--- Google Books API ---");
        const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${encodeURIComponent(author)}"&maxResults=1`;
        const googleRes = await fetch(googleUrl);
        const googleData = await googleRes.json();

        if (googleData.items && googleData.items.length > 0) {
            const book = googleData.items[0].volumeInfo;
            console.log(`Found Book: ${book.title}`);
            console.log(`Description (snippet): ${book.description ? book.description.substring(0, 100) : "None"}`);
            // Google Books doesn't always have a dedicated "author bio" field, but sometimes it's in the text.
        } else {
            console.log("No results found.");
        }
    } catch (e) {
        console.error("Google Books Error:", e);
    }

    // 2. Open Library API
    try {
        console.log("\n--- Open Library API ---");
        const olSearchUrl = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(author)}`;
        const olSearchRes = await fetch(olSearchUrl);
        const olSearchData = await olSearchRes.json();

        if (olSearchData.docs && olSearchData.docs.length > 0) {
            const authorKey = olSearchData.docs[0].key; // e.g. OL12345A
            console.log(`Found Author Key: ${authorKey}`);
            console.log(`Top Work: ${olSearchData.docs[0].top_work}`);

            // Fetch details
            const olDetailUrl = `https://openlibrary.org/authors/${authorKey}.json`;
            const olDetailRes = await fetch(olDetailUrl);
            const olDetailData = await olDetailRes.json();

            if (olDetailData.bio) {
                const bio = typeof olDetailData.bio === 'string' ? olDetailData.bio : olDetailData.bio.value;
                console.log(`Bio (snippet): ${bio.substring(0, 100)}`);
            } else {
                console.log("No bio field found in details.");
            }
        } else {
            console.log("No results found.");
        }
    } catch (e) {
        console.error("Open Library Error:", e);
    }
}

testSources();
