import { getAllSeries } from "@/lib/api";
import SeriesList from "@/components/SeriesList";

export const metadata = {
    title: "All Book Series – Reading Order Books",
    description: "Browse our complete list of book series and find the reading order for each.",
    alternates: {
        canonical: "https://readingorderbooks.com/series",
    },
};

export default async function SeriesPage() {
    const series = await getAllSeries();

    // Sort series alphabetically
    const sortedSeries = series.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-sepia-text dark:text-sepia-dark-text mb-10 tracking-tight">Series</h1>
            <SeriesList series={sortedSeries} />
        </div>
    );
}
