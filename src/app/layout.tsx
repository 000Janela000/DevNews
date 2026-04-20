import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { KeyboardProvider } from "@/components/keyboard-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-news.vercel.app"
  ),
  title: {
    default: "DevNews — the AI developer's briefing",
    template: "%s · DevNews",
  },
  description:
    "A daily briefing of AI developments that matter to people who build software. Summaries first, drill-down on demand.",
  keywords: [
    "AI",
    "developer tools",
    "LLM",
    "Claude",
    "GPT",
    "AI coding",
    "MCP",
    "agents",
    "AI news",
  ],
  authors: [{ name: "DevNews" }],
  openGraph: {
    title: "DevNews",
    description: "A daily briefing of AI developments that matter to people who build software.",
    type: "website",
    siteName: "DevNews",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevNews",
    description: "A daily briefing of AI developments that matter to people who build software.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#282c32" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <KeyboardProvider />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "13px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
