import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, question, answer, correct, answeredAt } = body;

        if (!sessionId || !question || answer === undefined || correct === undefined || !answeredAt) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const answerRecord = await prisma.answer.create({
            data: {
                sessionId,
                question,
                answer,
                correct,
                answeredAt: new Date(answeredAt),
            },
        });

        return NextResponse.json(answerRecord, { status: 201 });
    } catch (error) {
        console.error("Answer Create error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}