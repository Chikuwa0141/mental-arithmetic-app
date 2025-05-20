// src/app/session/new/time/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter }    from 'next/navigation';
import { useSession }   from 'next-auth/react';

type Question = {
  left: number;
  right: number;
  operator: '+' | '-' | '*' | '/';
  answer: number;
  text: string;
};

function generateQuestion(): Question {
  const ops = ['+', '-', '*', '/'] as const;
  const operator = ops[Math.floor(Math.random() * ops.length)];
  let left: number, right: number, answer: number;

  if (operator === '/') {
    right  = Math.floor(Math.random() * 9) + 1;
    answer = Math.floor(Math.random() * 12) + 1;
    left   = right * answer;
  } else {
    left   = Math.floor(Math.random() * 100) + 1;
    right  = Math.floor(Math.random() * 100) + 1;
    answer = operator === '+' ? left + right
           : operator === '-' ? left - right
           : left * right;
  }

  return {
    left, right, operator, answer,
    text: `${left} ${operator} ${right} = ?`
  };
}

export default function TimeModePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [timeLimit, setTimeLimit]   = useState(60);
  const [remaining, setRemaining]   = useState(60);
  const [inProgress, setInProgress] = useState(false);
  const [solvedCount, setSolved]    = useState(0);
  const [currentQ, setCurrentQ]     = useState(generateQuestion());
  const [input, setInput]           = useState('');

  // セッション開始 API 呼び出し
  const start = async () => {
    if (status === 'loading') return;
    if (!session?.user?.id) {
      router.push('/api/auth/signin');
      return;
    }
    await fetch('/api/session/create', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        userId: Number(session.user.id),
        timeLimit,
        condition: '制限時間'
      })
    });
    setRemaining(timeLimit);
    setSolved(0);
    setInProgress(true);
  };

  // タイマー
  useEffect(() => {
    if (!inProgress) return;
    if (remaining <= 0) {
      router.push(`/session/result?solved=${solvedCount}`);
      return;
    }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [inProgress, remaining]);

  // 回答処理
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(input) === currentQ.answer) {
      setSolved(s => s + 1);
    }
    setCurrentQ(generateQuestion());
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 既存の Header があればここに */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {inProgress ? '制限時間モード' : '制限時間モードを開始'}
        </h2>

        {!inProgress ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <label className="block mb-4">
              <span className="inline-block mb-1">制限時間を選択</span>
              <select
                className="w-full border rounded px-3 py-2"
                value={timeLimit}
                onChange={e => {
                  const sec = Number(e.target.value);
                  setTimeLimit(sec);
                  setRemaining(sec);
                }}
              >
                {[30,60,90,120].map(sec => (
                  <option key={sec} value={sec}>{sec} 秒</option>
                ))}
              </select>
            </label>
            <button
              onClick={start}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              スタート
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex justify-between text-lg">
              <span>残り時間: <strong>{remaining}s</strong></span>
              <span>正答数: <strong>{solvedCount}問</strong></span>
            </div>
            <div className="text-center text-xl font-mono">
              {currentQ.text}
            </div>
            <form onSubmit={onSubmit} className="flex">
              <input
                type="number"
                className="flex-1 border rounded px-3 py-1 mr-2"
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="px-4 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                回答
              </button>
            </form>
          </div>
        )}
      </main>
      {/* 既存の Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        © 2025 暗算アプリ. All rights reserved.
      </footer>
    </div>
  );
}
