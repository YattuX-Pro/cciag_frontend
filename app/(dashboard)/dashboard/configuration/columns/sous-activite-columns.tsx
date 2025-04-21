"use client";

import { cn } from "@/lib/utils";
import { Column, SubActivity } from "@/types";
import AddSubActivityDialog from "../(dialog)/AddSubActivityDialog";

export const sousActiviteColumns: Column<SubActivity>[] = [
  {
    header: "Nom",
    accessorKey: "name",
  },
  {
    header: "Date de création",
    accessorKey: "created_at",
    cell: (sousActivite) => (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          "dark:bg-cyan-500/10 bg-cyan-500/20",
          "dark:text-cyan-400 text-cyan-600"
        )}
      >
        {sousActivite.created_at ? new Date(sousActivite.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    accessorKey: "id",
  },
];

export type { SubActivity }
