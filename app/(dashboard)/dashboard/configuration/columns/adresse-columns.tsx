"use client";

import { cn } from "@/lib/utils";
import { Address, Column } from "@/types";

export const adresseColumns: Column<Address>[] = [
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
    cell: (adresse) => (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          "dark:bg-cyan-500/10 bg-cyan-500/20",
          "dark:text-cyan-400 text-cyan-600"
        )}
      >
        {adresse.created_at ? new Date(adresse.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    cell: (adresse) => (
      <div className="flex justify-end space-x-2">
        <button
          className={cn(
            "px-2 py-1 rounded text-xs",
            "dark:bg-cyan-500/10 bg-cyan-500/20",
            "dark:text-cyan-400 text-cyan-600",
            "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
          )}
          onClick={() => console.log("Edit adresse", adresse.id)}
        >
          Modifier
        </button>
        <button
          className={cn(
            "px-2 py-1 rounded text-xs",
            "dark:bg-red-500/10 bg-red-500/20",
            "dark:text-red-400 text-red-600",
            "hover:bg-red-500/30 dark:hover:bg-red-500/20"
          )}
          onClick={() => console.log("Delete adresse", adresse.id)}
        >
          Supprimer
        </button>
      </div>
    ),
    accessorKey: "id",
  },
];

export type { Address };
