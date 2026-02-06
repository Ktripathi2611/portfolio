import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Kushal Tripathi | Hire Python Developer Mumbai",
    description:
        "Get in touch with Kushal Tripathi, a Python Developer and Backend Developer based in Mumbai. Available for freelance projects and collaboration.",
    alternates: {
        canonical: "https://kushaltripathi.vercel.app/contact",
    },
    openGraph: {
        title: "Contact Kushal Tripathi | Hire Python Developer Mumbai",
        description:
            "Get in touch with Kushal Tripathi for your backend development needs.",
        url: "https://kushaltripathi.vercel.app/contact",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
