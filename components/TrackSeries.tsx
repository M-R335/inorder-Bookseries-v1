"use client";

import { useEffect } from "react";

export default function TrackSeries({ id }: { id: number }) {
    useEffect(() => {
        if (id) {
            fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "series", id }),
            }).catch((err) => console.error("Tracking failed", err));
        }
    }, [id]);

    return null;
}
