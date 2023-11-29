import { auth, currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";

interface Props {
  entityId: string;
  entityType: "BOARD" | "LIST" | "CARD";
  entityTitle: string;
  action: "CREATE" | "UPDATE" | "DELETE";
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!user || !orgId) throw new Error("User not found!");

    const { action, entityId, entityTitle, entityType } = props;

    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityTitle,
        entityType,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: `${user?.firstName} ${user?.lastName}`,
      },
    });
  } catch (error) {
    console.log("AUDIT_LOG_ERROR", error);
  }
};
