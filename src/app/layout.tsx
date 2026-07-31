import type { Metadata, Viewport } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Shivam Sheth | Software Developer & Applied AI",
  description:
    "M.S. Computer Science at Northwestern. Software Developer at Xpnse AI, building applied AI products, automation pipelines, and full-stack software.",
  keywords: [
    "Shivam Sheth",
    "Software Engineer",
    "Applied AI",
    "Northwestern University",
    "Xpnse AI",
    "Machine Learning",
  ],
  authors: [{ name: "Shivam Sheth" }],
  openGraph: {
    title: "Shivam Sheth | Software Developer & Applied AI",
    description:
      "M.S. Computer Science at Northwestern. Building applied AI products, automation pipelines, and full-stack software.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
