"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

const CreateBoard = z.object({
  title: z.string(),
});

export const create = async (formData: FormData) => {
  const { title } = CreateBoard.parse({
    title: formData.get("title"),
  });

  await db.board.create({ data: { title } });

  revalidatePath("/organization/org_2YDrccPIFyOBTfPdMxwnYuyxjxz");
};
