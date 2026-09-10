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
  title: "陈嘉乐 | AI Agent 与系统工程",
  description: "陈嘉乐的个人网站与技术博客：AI Agent 开发、Linux 网络诊断、性能优化，以及项目、研究和教育经历。",
  metadataBase: new URL("https://jared01home.com"),
  openGraph: {
    title: "陈嘉乐 | AI Agent 与系统工程",
    description: "多智能体代码审查、Linux 网络诊断与工程实践。",
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
    title: "陈嘉乐 | AI Agent 与系统工程",
    description: "多智能体代码审查、Linux 网络诊断与工程实践。",
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
