"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Column, MerchantEnrollementHistory } from "@/types";
import { getStatusColor, statusMap } from "@/types/const";

export const columns: Column<MerchantEnrollementHistory>[] = [
  {
    header: "Id Card",
    accessorKey: "id_card",
    cell: (merchant) => merchant.id_card
  },
  {
    header: "Commerçant",
    accessorKey: "user",
    cell: (merchant) => `${merchant.user?.last_name} ${merchant.user?.first_name}`,
  },
  {
    header: "Numéro de téléphone",
    accessorKey: "user",
    cell: (merchant) => `${merchant.user?.phone_number}`,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (merchant) => {
      const status = merchant.status;
      const displayStatus = statusMap[status] || status;
      const statusColor = getStatusColor(status);
      
      return (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            statusColor
          )}
        >
          {displayStatus}
        </span>
      );
    },
  },
]; 