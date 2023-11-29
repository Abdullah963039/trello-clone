import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId)
      return new NextResponse("Unauthorized", { status: 401 });

    const auditLogs = await db.auditLog.findMany({
      where: { orgId, entityId: params.cardId, entityType: "CARD" },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return NextResponse.json(auditLogs, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
