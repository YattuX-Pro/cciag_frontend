"use client";

import { cn } from "@/lib/utils";
import { Address, Column } from "@/types";
import AddAddressDialog from "../(dialog)/AddAddressDialog";

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
      <span className="text-sm">
        {adresse.created_at ? new Date(adresse.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    cell: (adresse) => (
      <div className="flex justify-end space-x-2">
        <AddAddressDialog
          address={adresse}
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

export type { Address };
