"use client";

import { cn } from "@/lib/utils";
import { Column, Banque } from "@/types";

export const banqueColumns: Column<Banque>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Nom",
    accessorKey: "nom",
  },
  {
    header: "Statut",
    accessorKey: "is_active",
    cell: (banque) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        banque.is_active 
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      )}>
        {banque.is_active ? "Actif" : "Inactif"}
      </span>
    ),
  },
  {
    header: "Date de création",
    accessorKey: "created_at",
    cell: (banque) => (
      <span className="text-sm">
        {banque.created_at ? new Date(banque.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
];
