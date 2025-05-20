"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const res = await signIn("credentials", {
      redirect: false, // 自動で遷移しないように
      email,
      password,
    });

    if (res?.error) {
      setErrorMessage("メールアドレスまたはパスワードが違います");
    } else {
      router.push("/session/new/mode"); // ログイン後の遷移先
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h1>ログイン</h1>
      <form onSubmit={handleSignin}>
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
          ログイン
        </button>
      </form>

      {errorMessage && <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>}
    </div>
  );
}
