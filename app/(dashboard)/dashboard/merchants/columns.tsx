"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddMerchantDialog from './(dialog)/AddMerchantDialog';
import { Column, MerchantEnrollment } from "@/types";
import { getStatusColor, statusMap } from "@/types/const";

export const columns: Column<MerchantEnrollment>[] = [
  {
    header: "Id Card",
    accessorKey: "card_number",
    cell: (merchant) => merchant.card_number,
  },
  {
    header: "Nom",
    accessorKey: "user",
    cell: (merchant) => merchant.user?.last_name,
  },
  {
    header: "Prénom", 
    accessorKey: "user",
    cell: (merchant) => merchant.user?.first_name,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (merchant) => {
      
      const status = merchant.status;
      const displayStatus = statusMap[status] || status;
      return (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            getStatusColor(status)
          )}
        >
          {displayStatus}
        </span>
      );
    },
  },
  {
    header: "Date Enrollment",
    cell: (merchant) => {
      const date = new Date(merchant.created_at);
      return (
        <span className="text-sm">
          {date.toLocaleDateString()}
        </span>
      );
    },
    accessorKey: "created_at",
  },
  {
    header: "Enrollé Par",
    cell: (merchant) => {
      return (
        <span className="text-sm">{merchant.created_by?.last_name} {merchant.created_by?.first_name}</span>
      );
    },
    accessorKey: "created_by",
  }
  
]; 