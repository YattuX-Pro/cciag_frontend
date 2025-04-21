"use client";

import { cn } from "@/lib/utils";
import { Column, Prefecture } from "@/types";
import AddPrefectureDialog from "../(dialog)/AddPrefectureDialog";

export const prefectureColumns: Column<Prefecture>[] = [
  {
    header: "Nom",
    accessorKey: "name" as keyof Prefecture,
  },
  {
    header: "Région",
    accessorKey: "region",
    cell: (prefecture) => prefecture.region?.name || "N/A",
  },
  {
    header: "Date de création",
    accessorKey: "created_at",
    cell: (prefecture) => (
      <span className="text-sm">
        {prefecture.created_at ? new Date(prefecture.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    accessorKey: "id",
    cell: (prefecture) => (
      <div className="flex justify-end space-x-2">
        <AddPrefectureDialog
          prefecture={prefecture}
          isEdit={true}
          trigger={
            <button
              className={cn(
                "px-2 py-1 rounded text-xs",
                "dark:bg-cyan-500/10 bg-cyan-500/20",
                "dark:text-cyan-400 text-cyan-600",
                "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
              )}
            >
              Modifier
            </button>
          }
        />
      </div>
    ),
  },
];

export type { Prefecture };