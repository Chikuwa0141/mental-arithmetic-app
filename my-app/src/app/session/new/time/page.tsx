// src/app/session/new/time/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewTimeSessionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // 認証情報読み込み中は待機
    if (status === 'loading') return;
    // 未ログインなら戻る
    if (!session?.user?.id) {
      alert('ログインしてください');
      router.push('/api/auth/signin');
      return;
    }

    // セッション作成＋即リダイレクト
    (async () => {
      const res = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(session.user.id),
          timeLimit: 300,                   // デフォルト 5 分
          condition: '制限時間モード',
        }),
      });
      if (!res.ok) {
        alert('セッション作成に失敗しました');
        router.push('/');
        return;
      }
      const data = await res.json();
      router.replace(`/session/${data.id}/time`);
    })();
  }, [session, status, router]);

  // ローディング中の表示
  return (
    <main className="p-8 text-center">
      <p className="text-xl">セッションを準備中…</p>
    </main>
  );
}
