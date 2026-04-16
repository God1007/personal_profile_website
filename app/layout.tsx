import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jared 01 Home",
  description: "Jared 01 Home 是小陈的个人网站与技术博客，聚焦系统、网络、工程实现与技术写作。",
  metadataBase: new URL("https://jared01home.com"),
  openGraph: {
    title: "Jared 01 Home",
    description: "聚焦 C++、Linux、网络系统、工程实现与技术写作的个人网站。",
    url: "https://jared01home.com",
    siteName: "Jared 01 Home",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Jared 01 Home",
    description: "聚焦 C++、Linux、网络系统、工程实现与技术写作的个人网站。"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
