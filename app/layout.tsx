import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "陈嘉乐 | 个人网站",
  description:
    "陈嘉乐的个人网站，展示教育经历、项目实践、技术方向以及后续的博客记录。",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "陈嘉乐 | 个人网站",
    description:
      "聚焦 C++、Linux、网络系统与工程实现的个人网站与博客。",
    url: "https://example.com",
    siteName: "陈嘉乐个人网站",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "陈嘉乐 | 个人网站",
    description:
      "聚焦 C++、Linux、网络系统与工程实现的个人网站与博客。"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
