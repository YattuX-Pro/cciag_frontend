"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Column, MerchantEnrollementHistory, MerchantPayment } from "@/types";
import { getStatusColor, paymentStatusMap, statusMap, getPaymentStatusColor, getPaymentTypeColor, paymentTypeMap } from "@/types/const";

export const columns: Column<MerchantPayment>[] = [
  {
    header: "Id Card",
    accessorKey: "merchant",
    cell: (payment) => payment.merchant?.id_card
  },
  {
    header: 'Transcation Id',
    accessorKey: 'transaction_id',
    cell: (payment) => payment.transaction_id
  },
  {
    header: "Commerçant",
    accessorKey: "merchant",
    cell: (payment) => `${payment.merchant?.user?.last_name} ${payment.merchant?.user?.first_name}`,
  },
  {
    header: "Montant",
    accessorKey: "amount",
    cell: (payment) => `${payment.amount}`,
  },
  {
    header: "Type de payment",
    accessorKey: "payment_type",
    cell: (payment) => {
      const type = payment.payment_type;
      const displayType = paymentTypeMap[type as keyof typeof paymentTypeMap] || type;
      const typeColor = getPaymentTypeColor(type);
      
      return (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            `${typeColor}`
          )}
        >
          {displayType}
        </span>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (payment) => {
      const status = payment.status || 'PENDING';
      const displayStatus = paymentStatusMap[status as keyof typeof paymentStatusMap] || status;
      const statusColor = getPaymentStatusColor(status);
      
      return (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            `${statusColor}`
          )}
        >
          {displayStatus}
        </span>
      );
    },
  },
]; 