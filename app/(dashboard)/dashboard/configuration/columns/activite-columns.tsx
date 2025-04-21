"use client";

import { cn } from "@/lib/utils";
import { Activity, Column } from "@/types";

export const activiteColumns: Column<Activity>[] = [
  {
    header: "Nom",
    accessorKey: "name",
  },
  {
    header: "Date de création",
    accessorKey: "created_at",
    cell: (activite) => (
      <span className="text-sm">
        {activite.created_at ? new Date(activite.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    accessorKey: "id",
  },
];


export type { Activity };
