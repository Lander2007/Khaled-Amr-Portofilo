import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import PageTransitionProvider from "@/components/motion/PageTransitionProvider";
import DeveloperTerminal from "@/components/ui/DeveloperTerminal";

export const metadata: Metadata = {
  metadataBase: new URL("https://khaledamr.dev"),
  title: "Khaled Amr — FORM / SHIFT | Frontend Architecture & Creative Motion",
  description:
    "Personal portfolio of Khaled Amr. An interactive narrative built around typography and layout transformations, featuring CodeSystem SW, El3almia Leather, Chronos Engine, and bespoke frontend engineering.",
  keywords: [
    "Khaled Amr",
    "Frontend Engineer",
    "Creative Developer",
    "Motion Design",
    "GSAP",
    "Next.js",
    "React",
    "CodeSystem",
    "Alexandria Egypt",
  ],
  authors: [{ name: "Khaled Amr" }],
  creator: "Khaled Amr",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://khaledamr.dev",
    title: "Khaled Amr — FORM / SHIFT",
    description: "I make digital things move. Architecture, typography, and engineered motion.",
    siteName: "Khaled Amr Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khaled Amr — FORM / SHIFT",
    description: "I make digital things move. Architecture, typography, and engineered motion.",
    creator: "@KhaledA33912144",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('portfolio-polarity-theme') || 'milk';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--surface-primary)] text-[var(--ink-primary)] antialiased selection:bg-[var(--ink-primary)] selection:text-[var(--surface-primary)]">
        <ThemeProvider>
          <PageTransitionProvider>
            {children}
            <DeveloperTerminal />
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
