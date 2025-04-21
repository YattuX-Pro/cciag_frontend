"use client";

import { cn } from "@/lib/utils";
import { Column, SubPrefecture } from "@/types";
import AddSubPrefectureDialog from "../(dialog)/AddSubPrefectureDialog";

export const sousPrefectureColumns: Column<SubPrefecture>[] = [
  {
    header: "Nom",
    accessorKey: "name",
  },
  {
    header: "Préfecture",
    accessorKey: "prefecture",
    cell: (sous_pref) => sous_pref.prefecture?.name
  },
  {
    header: "Date de création",
    accessorKey: "created_at",
    cell: (sousPrefecture) => (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          "dark:bg-cyan-500/10 bg-cyan-500/20",
          "dark:text-cyan-400 text-cyan-600"
        )}
      >
        {sousPrefecture.created_at ? new Date(sousPrefecture.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    accessorKey: "id",
    
  },
];

export type { SubPrefecture };
