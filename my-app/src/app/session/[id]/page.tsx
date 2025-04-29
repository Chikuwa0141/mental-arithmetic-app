'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // ← セッション取得用

type Question = {
    left: number;
    right: number;
    operator: '+' | '-' | '*' | '/';
    answer: number;
    text: string;
};

function generateQuestion(): Question {
    const operators = ['+', '-', '*', '/'] as const;
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let left: number;
    let right: number;
    let answer: number;

    if (operator === '/') {
        // right を 1〜9 からランダムに決める
        right = Math.floor(Math.random() * 9) + 1;

        // answer を 1〜12 あたりからランダムに決める（←答え）
        answer = Math.floor(Math.random() * 12) + 1;

        // left は answer × right（←これで割った結果が整数になる）
        left = answer * right;
    } else {
        // 他の演算子なら普通に生成
        left = Math.floor(Math.random() * 90) + 1;
        right = Math.floor(Math.random() * 9) + 1;

        switch (operator) {
            case '+': answer = left + right; break;
            case '-': answer = left - right; break;
            case '*': answer = left * right; break;
        }
    }

    const text = `${left} ${operator} ${right}`;
    return { left, right, operator, answer, text };
}

export default function SessionPage() {
    const { id: sessionId } = useParams();
    const { data: session } = useSession();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const current = questions[currentIndex];

    useEffect(() => {
        const q = Array.from({ length: 5 }, () => generateQuestion());  // 5問分の問題を生成 あとで変える
        setQuestions(q);
    }, []);

    if (questions.length === 0) return <p>問題を準備中…</p>;
    if (!session?.user?.id) return <p>ログイン情報が必要です</p>;

    const handleSubmit = async () => {
        const correct = Number(userAnswer) === current.answer;
        setFeedback(correct ? '正解！' : `不正解... 正解は ${current.answer}`);
        setUserAnswers((prev) => [...prev, userAnswer]);

        // 回答記録APIを呼ぶ
        await fetch('/api/answer/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: Number(sessionId),
                question: current.text,
                answer: userAnswer,
                correct,
                answeredAt: new Date().toISOString(),
            }),
        });

        // 次の問題へ進む（1秒後）
        setTimeout(() => {
            setFeedback('');
            setUserAnswer('');
            setCurrentIndex((prev) => prev + 1);
        }, 1000);
    };

    // すべての問題が終了した場合
    if (currentIndex >= questions.length) {
        const correctCount = questions.filter((q, i) => {
            // 正誤データは保存してなかったので、再判定（本来は別に記録してもいい）
            const correctAnswer = q.answer;
            const userAns = Number(userAnswers[i]);
            return userAns === correctAnswer;
        }).length;

        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">全問終了！🎉</h2>
                <p className="text-xl mb-2">正解数: {correctCount} / {questions.length}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => window.location.href = "/signin"}
                >
                    トップに戻る
                </button>

                <a
                    href={`/api/session/${sessionId}/export`}
                    download
                    className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    📥 回答をCSVでダウンロード
                </a>
            </div>
        );
    }


    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">問題 {currentIndex + 1} / {questions.length}</h1>
            <p className="text-2xl mb-4">{current.text} = ?</p>

            <form
                onSubmit={(e) => {
                    e.preventDefault(); // ページリロード防止
                    handleSubmit();     // 回答処理を呼ぶ
                }}
            >
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="border p-2 text-xl mr-4"
                />

                <button
                    type="submit" // ← ここ忘れずに！
                    className="bg-blue-600 text-white px-4 py-2 rounded text-xl"
                >
                    回答する
                </button>
            </form>

            {feedback && <p className="mt-4 text-lg">{feedback}</p>}
        </div>
    );
}
