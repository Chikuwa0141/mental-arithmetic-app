// src/app/session/[id]/time/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

type Question = {
  left: number;
  right: number;
  operator: '+' | '-' | '*' | '/';
  answer: number;
  text: string;
};

// 乱数で１問生成（足し算・引き算のみ）
function generateQuestion(): Question {
  const ops = ['+', '-'] as const;
  const operator = ops[Math.floor(Math.random() * ops.length)];
  const left  = Math.floor(Math.random() * 90) + 1;
  const right = Math.floor(Math.random() * 9) + 1;
  const answer = operator === '+' ? left + right : left - right;
  return { left, right, operator, answer, text: `${left} ${operator} ${right}` };
}

/*
// 乱数で１問生成
function generateQuestion(): Question {
  const ops = ['+', '-', '*', '/'] as const;
  const operator = ops[Math.floor(Math.random() * ops.length)];
  let left: number, right: number, answer: number;

  if (operator === '/') {
    right  = Math.floor(Math.random() * 9) + 1;
    answer = Math.floor(Math.random() * 12) + 1;
    left   = right * answer;
  } else {
    left   = Math.floor(Math.random() * 90) + 1;
    right  = Math.floor(Math.random() * 9) + 1;
    answer = operator === '+' ? left + right
           : operator === '-' ? left - right
           : left * right;
  }

  return { left, right, operator, answer, text: `${left} ${operator} ${right}` };
}
*/
export default function TimeModePage() {
  const { id } = useParams();              // URL の sessionId
  const sessionId = Number(id);
  const router = useRouter();

  // API で保存した timeLimit を取得し、初期値を 5 分に
  const [timeLimit, setTimeLimit] = useState(300);
  const [remaining, setRemaining] = useState(300);

  const [inProgress, setInProgress] = useState(false);
  const [solved, setSolved]         = useState(0);
  const [feedback, setFeedback]     = useState('');
  const [currentQ, setCurrentQ]     = useState<Question|null>(null);
  const [answer, setAnswer]         = useState('');
  const timerRef = useRef<number|null>(null);

  // 「スタート」を押したら問題を作ってタイマー開始
  const start = () => {
    setRemaining(timeLimit);
    setSolved(0);
    setFeedback('');
    setCurrentQ(generateQuestion());
    setInProgress(true);
  };

  // タイマー制御
  useEffect(() => {
    if (!inProgress) return;

    timerRef.current = window.setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setInProgress(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inProgress]);

  // 回答を DB に保存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQ) return;

    const correct = Number(answer) === currentQ.answer;
    setFeedback(correct ? '✅ 正解！' : `❌ 不正解… 正解は ${currentQ.answer}`);
    if (correct) setSolved(s => s + 1);

    await fetch('/api/answer/create', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        sessionId,
        question: currentQ.text,
        answer,
        correct,
        answeredAt: new Date().toISOString(),
      }),
    });

    setAnswer('');
    setTimeout(() => {
      setFeedback('');
      setCurrentQ(generateQuestion());
    }, 800);
  };

  // ── 時間切れ or ゲーム終了画面 ──
  if (!inProgress && currentQ !== null) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">時間切れ！</h2>
        <p className="text-xl mb-4">正答数: {solved} 問</p>

        {/* CSV ダウンロード */}
        <a
          href={`/api/session/${sessionId}/export`}
          download
          className="inline-block mb-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📥 CSVをダウンロード
        </a>
        <br/>

        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          トップへ戻る
        </button>
      </div>
    );
  }

  // ── スタート前画面 ──
  if (!inProgress && currentQ === null) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">制限時間モード</h2>

        {/* 制限時間セレクト */}
        <label className="block mb-4">
          <span className="inline-block mb-2">制限時間を選択</span>
          <select
            className="border px-3 py-2 rounded"
            value={timeLimit}
            onChange={e => {
              const sec = Number(e.target.value);
              setTimeLimit(sec);
              setRemaining(sec);
            }}
          >
            {[30, 60, 90, 120, 300,600,900,1200].map(sec => (
              <option key={sec} value={sec}>
                {sec === 300 ? '5 分' : `${sec} 秒`}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={start}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          スタート
        </button>
      </div>
    );
  }

  // ── ゲーム中画面 ──
  return (
    <div className="p-6 text-center">
      <div className="flex justify-between mb-4">
        <span>残り時間: {remaining}s</span>
        <span>正答数: {solved} 問</span>
      </div>
      <h3 className="text-2xl mb-4">{currentQ?.text} = ?</h3>
      <form onSubmit={handleSubmit} className="flex justify-center">
        <input
          type="number"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          className="border p-2 text-xl mr-2 w-24"
          required
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-xl"
        >
          回答
        </button>
      </form>
      {feedback && <p className="mt-4 text-lg">{feedback}</p>}
    </div>
  );
}
