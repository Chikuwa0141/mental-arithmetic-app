// src/app/layout.tsx
import React from "react";
import "./globals.css"; // グローバルスタイル（必要に応じて）

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        {/* ヘッダー */}
        <header className="bg-blue-500 text-white p-4 text-center">
          <h1 className="text-xl font-bold">暗算アプリ</h1>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-grow p-6">{children}</main>

        {/* フッター */}
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p className="text-sm">&copy; 2025 暗算アプリ. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
