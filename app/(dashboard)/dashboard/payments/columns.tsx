"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Column, MerchantEnrollementHistory, MerchantPayment } from "@/types";
import { getStatusColor, paymentStatusMap, statusMap } from "@/types/const";

export const columns: Column<MerchantPayment>[] = [
  {
    header: "Id Card",
    accessorKey: "merchant_details",
    cell: (payment) => payment.merchant_details?.id_card
  },
  {
    header: "Commerçant",
    accessorKey: "merchant_details",
    cell: (payment) => `${payment.merchant_details?.    user?.last_name} ${payment.merchant_details?.user?.first_name}`,
  },
  {
    header: "Numéro de téléphone",
    accessorKey: "merchant_details",
    cell: (payment) => `${payment.merchant_details?.user?.phone_number}`,
  },
  {
    header: "Montant",
    accessorKey: "amount",
    cell: (payment) => `${payment.amount}`,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (payment) => {
      const status = payment.status;
      const displayStatus = paymentStatusMap[status] || status;
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