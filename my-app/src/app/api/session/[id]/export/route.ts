// src/app/api/session/[id]/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const sessionId = Number(params.id);

  const answers = await prisma.answer.findMany({
    where: { sessionId },
    orderBy: { answeredAt: "asc" },
  });

  const csvHeaders = "question,answer,correct,answeredAt\n";

  const csvRows = answers.map((a) => {
    return [
      `"=""${a.question}"""`, // これでExcelに「文字列」と認識させる
      `"${a.answer}"`,
      a.correct ? "TRUE" : "FALSE",
      a.answeredAt.toISOString(),
    ].join(",");
  });
  

  const csvContent = csvHeaders + csvRows.join("\n");

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="session_${sessionId}_answers.csv"`,
    },
  });
}
