"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const MAX_QUESTIONS = 5;

interface QuestionData {
  question: string;
  answer: number;
}

interface ResultData {
  questionNumber: number;
  question: string;
  userAnswer: number;
  isCorrect: boolean;
}

const generateQuestion = (difficulty: string): QuestionData => {
  const maxNumber =
    difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 100;
  const num1 = Math.floor(Math.random() * maxNumber);
  const num2 = Math.floor(Math.random() * maxNumber);
  return {
    question: `${num1} + ${num2} = ?`,
    answer: num1 + num2,
  };
};

const GamePage: React.FC = () => {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "easy";

  // ゲーム全体のステート管理
  const [questionCount, setQuestionCount] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(() =>
    generateQuestion(difficulty)
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  // 各問題の結果を格納するステート
  const [results, setResults] = useState<ResultData[]>([]);

  // ゲームが終了しているかどうかを判定
  const isGameOver = questionCount > MAX_QUESTIONS;

  const checkAnswer = () => {
    // 既に終了していたら何もしない
    if (isGameOver) return;

    const numericUserAnswer = parseInt(userAnswer, 10);
    const isCorrect = numericUserAnswer === currentQuestion.answer;

    // 正解/不正解にかかわらず結果を保存
    setResults((prev) => [
      ...prev,
      {
        questionNumber: questionCount,
        question: currentQuestion.question,
        userAnswer: numericUserAnswer,
        isCorrect: isCorrect,
      },
    ]);

    if (isCorrect) {
      setFeedback("正解！");
    } else {
      setFeedback("不正解です。次の問題に進みます。");
    }

    // 入力をクリア
    setUserAnswer("");

    // 5問目なら終了処理へ
    if (questionCount < MAX_QUESTIONS) {
      setQuestionCount(questionCount + 1);
      setCurrentQuestion(generateQuestion(difficulty));
    } else {
      // 5問目を答え終わったら終了
      setQuestionCount(questionCount + 1); // → isGameOver=true
      setFeedback((prev) => prev + " 全問終了です。お疲れさまでした。");
    }
  };

  return (
    <div className="p-4 min-h-screen bg-red-200 flex flex-col items-center">
      {!isGameOver ? (
        // まだゲーム中
        <>
          <h1 className="h1-title">
            問題 {questionCount} / {MAX_QUESTIONS}
          </h1>
          <p className="h1-title">{currentQuestion.question}</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="border p-2 mb-4 bg-red-200"
          />
          <button
            onClick={checkAnswer}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            答える
          </button>
          {feedback && <p className="mt-4 text-lg">{feedback}</p>}
        </>
      ) : (
        // ゲーム終了後：結果一覧を表示
        <div>
          <p className="mt-8 text-xl font-bold mb-4">
            ゲーム終了です。お疲れさまでした！
          </p>
          {/* 結果の表 */}
          <table className="border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-200 bg-red-200">
                <th className="border border-gray-500 px-4 py-2">問題番号</th>
                <th className="border border-gray-500 px-4 py-2">問題</th>
                <th className="border border-gray-500 px-4 py-2">あなたの解答</th>
                <th className="border border-gray-500 px-4 py-2">結果</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.questionNumber}>
                  <td className="border border-gray-500 px-4 py-2">{r.questionNumber}</td>
                  <td className="border border-gray-500 px-4 py-2">{r.question}</td>
                  <td className="border border-gray-500 px-4 py-2">{r.userAnswer}</td>
                  <td className="border border-gray-500 px-4 py-2">
                    {r.isCorrect ? "正解" : "不正解"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GamePage;
