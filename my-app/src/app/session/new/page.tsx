"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewSessionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [questionCount, setQuestionCount] = useState(10);
  const [condition, setCondition] = useState("通常");

  const startSession = async () => {
    if (!session?.user?.id) {
      alert("ログインしてください");
      return;
    }

    const res = await fetch("/api/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(session.user.id),  // userIdは数値型　Stringでやってエラー一生出てた
        questionCount,
        condition,
      }),
    });

    const data = await res.json();
    router.push(`/session/${data.id}`);
  };

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">問題数を選択してスタート</h1>

      <select
        className="text-2xl border border-gray-300 rounded p-2 mb-4"
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
      >
        {[10, 20, 30, 40, 50].map((n) => (
          <option key={n} value={n}>
            {n}問
          </option>
        ))}
      </select>

      <button
        className="text-2xl bg-blue-600 text-white px-4 py-2 rounded"
        onClick={startSession}
      >
        スタート
      </button>
    </main>
  );
}
