"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DifficultyButton from "@/components/DifficultyButton";

const MenuPage: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const router = useRouter();

  const handleStartGame = () => {
    if (difficulty) {
      router.push(`/game?difficulty=${difficulty}`);
    } else {
      alert("難易度を選択してください");
    }
  };

  return (
    <div className="p-4 min-h-screen bg-red-200 flex flex-col items-center">
      <h1 className="h1-title">難易度を選択</h1>
      <div className="flex gap-4 mb-6">
        <DifficultyButton
          label="簡単"
          value="easy"
          selected={difficulty === "easy"}
          onSelect={setDifficulty}
        />
        <DifficultyButton
          label="普通"
          value="medium"
          selected={difficulty === "medium"}
          onSelect={setDifficulty}
        />
        <DifficultyButton
          label="難しい"
          value="hard"
          selected={difficulty === "hard"}
          onSelect={setDifficulty}
        />
      </div>
      <button
        onClick={handleStartGame}
        className="px-6 py-2 bg-green-500 text-white rounded"
      >
        ゲームを開始
      </button>
    </div>
  );
};

export default MenuPage;
