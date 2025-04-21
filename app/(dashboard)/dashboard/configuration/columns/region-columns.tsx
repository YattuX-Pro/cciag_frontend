"use client";

import { cn } from "@/lib/utils";
import { Column, Region } from "@/types";
import AddRegionDialog from "../(dialog)/AddRegionDialog";

export const regionColumns: Column<Region>[] = [
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
    cell: (region) => (
      <span className="text-sm">
        {region.created_at ? new Date(region.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    cell: (region) => (
      <div className="flex justify-end space-x-2">
        <AddRegionDialog
          region={region}
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
    accessorKey: "id",
  },
];

export type { Region };
