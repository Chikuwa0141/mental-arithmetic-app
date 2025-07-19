// src/app/session/new/mode/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ModeSelectionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // 未ログイン時はサインインへ
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.id) {
      router.replace('/api/auth/signin');
    }
  }, [session, status, router]);

  const goQuestion = () => router.push('/session/new/question');
  const goTime     = () => router.push('/session/new/time');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダーがあればここに */}
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-semibold mb-6">モードを選択してください</h1>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={goQuestion}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              問題数モード
            </button>
            <button
              onClick={goTime}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              制限時間モード
            </button>
          </div>
        </div>
      </main>
      {/* フッターがあればここに */}
      <footer className="py-4 text-center text-sm text-gray-500">
        © 2025 暗算アプリ. All rights reserved.
      </footer>
    </div>
  );
}
