"use client";

import { cn } from "@/lib/utils";
import { Column, WorkPosition } from "@/types";
import AddWorkPositionDialog from "../(dialog)/AddWorkPositionDialog";

export const workPositionColumns: Column<WorkPosition>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Nom",
    accessorKey: "name",
  },
  {
    header: "Date de création",
    accessorKey: "created_at",
    cell: (workPosition) => (
      <span className="text-sm">
        {workPosition.created_at ? new Date(workPosition.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    accessorKey: "id",
  },
];

export type { WorkPosition };