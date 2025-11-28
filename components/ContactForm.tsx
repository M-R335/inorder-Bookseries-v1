"use client";

export default function ContactForm() {
    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-sepia-accent/20 rounded-md focus:outline-none focus:border-sepia-accent text-sepia-text placeholder-sepia-text/40"
                    disabled
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-sepia-accent/20 rounded-md focus:outline-none focus:border-sepia-accent text-sepia-text placeholder-sepia-text/40"
                    disabled
                />
            </div>
            <div>
                <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-sepia-accent/20 rounded-md focus:outline-none focus:border-sepia-accent text-sepia-text placeholder-sepia-text/40 resize-none"
                    disabled
                ></textarea>
            </div>
            <button
                type="button"
                className="bg-sepia-accent text-white font-bold py-3 px-8 rounded-md hover:bg-sepia-text transition-colors shadow-sm"
            >
                Send
            </button>
        </form>
    );
}
