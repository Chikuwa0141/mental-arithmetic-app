// src/app/signup/page.tsx
"use client"; //クライアントサイドで動作するコンポーネントってことを示す

import { useState } from "react";
import { useRouter } from "next/navigation";  //ページ背にをするための関数を読み込むコード
export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //デフォルトのフォーム送信を防ぐ

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "登録に失敗しました");
        return;
      }

      setSuccessMessage("登録に成功しました！");
      setEmail("");
      setName("");
      setPassword("");

      // 必要ならログインページへリダイレクト
      router.push("/signin");
    } catch (error) {
      setErrorMessage("サーバーエラーが発生しました");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h1>サインアップ</h1>
      <form onSubmit={handleSignup}> {/* フォームの送信時にhandleSignupを呼び出す */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">名前</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" style={{ width: "100%" }}>
          登録する
        </button>
      </form>

      {errorMessage && <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>}
    </div>
  );
}
