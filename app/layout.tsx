import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";
import "./home.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Jared 01 Home",
  description: "Jared 01 Home 是小陈的个人网站与技术博客，聚焦系统、网络、工程实现与技术写作。",
  metadataBase: new URL("https://jared01home.com"),
  openGraph: {
    title: "Jared 01 Home",
    description: "聚焦 C++、Linux、网络系统、工程实现与技术写作的个人网站。",
    url: "https://jared01home.com",
    siteName: "Jared 01 Home",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Jared Chan, I make complex systems feel clear"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Jared 01 Home",
    description: "聚焦 C++、Linux、网络系统、工程实现与技术写作的个人网站。",
    images: ["/og.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${manrope.variable} ${jetBrainsMono.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
