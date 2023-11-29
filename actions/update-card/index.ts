"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";

import { InputType, ReturnType } from "./types";
import { UpdateCard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, boardId, ...values } = data;

  let card;

  try {
    card = await db.card.update({
      where: { id, list: { board: { orgId } } },
      data: { ...values },
    });

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: "CARD",
      action: "UPDATE",
    });
  } catch (error) {
    return { error: "Failed to update!" };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);
