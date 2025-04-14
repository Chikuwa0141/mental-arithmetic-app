'use client';

import { useState } from 'react';

export default function SessionCreatePage() {
  const [loading, setLoading] = useState(false);    //userがセッションを作成中かどうかの状態を管理するための状態変数

  const createSession = async () => {
    setLoading(true);
    const res = await fetch('/api/session/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 1, // ← ログインユーザーのID（今回は1でテスト）
        questionCount: 10,
        condition: '通常',
      }),
    });

    const data = await res.json();
    console.log('作成されたセッション:', data);
    setLoading(false);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">セッション作成テスト</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={createSession}
        disabled={loading}
      >
        {loading ? '作成中...' : 'セッションを作成'}
      </button>
    </main>
  );
}
