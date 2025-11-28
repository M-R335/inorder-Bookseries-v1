import pool from "../lib/db";

async function fixManual() {
    try {
        const bio = "A.A. Albright is a cozy mystery author, best known for the Wayfair Witches series, the Riddler's Edge series, and the Infernal Regions series. She lives in the Irish countryside.";
        await pool.query("UPDATE authors SET description = $1 WHERE name = 'A.A. Albright'", [bio]);
        console.log("Updated A.A. Albright bio.");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await pool.end();
    }
}

fixManual();
