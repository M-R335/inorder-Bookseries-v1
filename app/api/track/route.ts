import { NextResponse } from "next/server";
import { incrementAuthorClick, incrementSeriesClick } from "@/lib/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, id } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        if (type === "author") {
            await incrementAuthorClick(id);
        } else if (type === "series") {
            await incrementSeriesClick(id);
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Tracking error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
