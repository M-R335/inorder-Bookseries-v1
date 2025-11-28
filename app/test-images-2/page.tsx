import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Verification 2",
    robots: {
        index: false,
        follow: false,
    },
};

export default function TestImagesPage() {
    return (
        <div className="p-20 bg-gray-100 min-h-screen flex flex-col items-center gap-10">
            <h1 className="text-3xl font-bold text-black">Image Verification 2</h1>

            <div className="flex gap-20">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4 text-black">Favicon (Should be Open Book)</h2>
                    <div className="border-4 border-blue-500 p-4 bg-white">
                        <img src="/book2.svg" alt="Favicon" width={128} height={128} />
                    </div>
                    <p className="mt-2 text-gray-600">src="/book2.svg"</p>
                </div>

                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4 text-black">Header Logo (Should be Closed Book)</h2>
                    <div className="border-4 border-green-500 p-4 bg-white">
                        <img src="/logo.png" alt="Logo" width={128} height={128} />
                    </div>
                    <p className="mt-2 text-gray-600">src="/logo.png"</p>
                </div>
            </div>
        </div>
    );
}
