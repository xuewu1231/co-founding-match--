import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Co-founder Matching MVP",
  description: "联合创始人配对平台 - 奇绩引力场",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
