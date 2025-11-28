import { MetadataRoute } from "next";
import { getAllAuthors, getAllSeries } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://inorderbookseries.com";

    // Static routes
    const routes = [
        "",
        "/search",
        "/authors",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
    }));

    // Dynamic routes: Authors
    const authors = await getAllAuthors();
    const authorRoutes = authors.map((author) => ({
        url: `${baseUrl}/authors/${author.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Dynamic routes: Series
    // Note: getAllSeries might be too large for a single sitemap if thousands of series.
    // For now, we'll include them, but in production, sitemap splitting might be needed.
    const series = await getAllSeries();
    const seriesRoutes = series.map((s) => ({
        url: `${baseUrl}/series/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...routes, ...authorRoutes, ...seriesRoutes];
}
