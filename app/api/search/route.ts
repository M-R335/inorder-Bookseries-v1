import { NextResponse } from "next/server";
import { searchEverything } from "@/lib/api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    try {
        const data = await searchEverything(query);

        const results = [
            ...data.authors.map((a: any) => ({ type: "Author", name: a.name, url: a.url })),
            ...data.series.map((s: any) => ({ type: "Series", name: s.name, url: s.url })),
            ...data.books.map((b: any) => ({ type: "Book", name: b.title, url: `/search?q=${encodeURIComponent(b.title)}` })),
        ];

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
