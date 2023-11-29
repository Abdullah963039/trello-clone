"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";

import { InputType, ReturnType } from "./types";
import { UpdateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, id } = data;

  let board;

  try {
    board = await db.board.update({
      where: { id, orgId },
      data: { title },
    });

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: "BOARD",
      action: "UPDATE",
    });
  } catch (error) {
    return { error: "Failed to update!" };
  }

  revalidatePath(`/board/${board.id}`);

  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
