// src/app/api/session/create/route.ts
import { NextResponse } from 'next/server';
import { prisma }       from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, questionCount, timeLimit, condition } = await req.json();

    // userId は必須、かつどちらかのモード情報があること
    if (typeof userId !== 'number' || (questionCount == null && timeLimit == null)) {
      return NextResponse.json(
        { error: 'userId と questionCount か timeLimit のいずれかが必要です' },
        { status: 400 }
      );
    }

    // Prisma の Session モデルに合わせて data を組み立て
    const session = await prisma.session.create({
      data: {
        userId,
        condition,
        // questionCount モードならこちら、制限時間モードなら null
        questionCount: questionCount ?? 0,
        // timeLimit モードならこちら、問題数モードなら null
        timeLimit:     timeLimit     ?? 0,
        // solvedCount は時間制限モードで使いますが、共通して初期0
        
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Session Create error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
