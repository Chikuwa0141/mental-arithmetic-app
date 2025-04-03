//nextauth結局使ってない、後で必要になったら変える
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  // ユーザーが存在するか確認
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: "ユーザーが見つかりません" }, { status: 404 });
  }

  // パスワードが一致するかチェック
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ message: "パスワードが正しくありません" }, { status: 401 });
  }

  // ログイン成功（ここでトークンを返したり、セッション管理したりすることも）
  return NextResponse.json({ message: "ログイン成功", user: { id: user.id, name: user.name } }, { status: 200 });
}
