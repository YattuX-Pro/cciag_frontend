"use client";

import { cn } from "@/lib/utils";
import { Column, Nationality } from "@/types";
import AddNationalityDialog from "../(dialog)/AddNationalityDialog";

export const nationalityColumns: Column<Nationality>[] = [
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
    cell: (nationality) => (
      <span className="text-sm">
        {nationality.created_at ? new Date(nationality.created_at).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    header: "Actions",
    accessorKey: "id",
  },
];

export type { Nationality };