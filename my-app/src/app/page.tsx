import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="h1-title">暗算アプリ</h1>
      <Link href="/menu" className="text-blue-500 text-lg underline">
        難易度を選択する
      </Link>
    </div>
  );
}
