import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";
import "./home.css";

export const metadata: Metadata = {
  title: "陈嘉乐 Jared | AI Agent 与系统工程",
  description: "陈嘉乐的个人网站。AI Agent、Linux 网络诊断与工程实践，项目与技术笔记。",
  metadataBase: new URL("https://jared01home.com"),
  openGraph: {
    title: "陈嘉乐 Jared | AI Agent 与系统工程",
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
    title: "陈嘉乐 Jared | AI Agent 与系统工程",
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
    <html lang="zh-CN">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
