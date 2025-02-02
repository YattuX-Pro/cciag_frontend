import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => React.ReactNode);
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    count: number;
    next: string | null;
    previous: string | null;
    onPageChange: (url: string) => void;
  };
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading,
  pagination,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div>
      <div
        className={cn(
          "rounded-md border overflow-hidden",
          "dark:border-cyan-900/20 border-cyan-200/20"
        )}
      >
        <Table>
          <TableHeader>
            <TableRow
              className={cn(
                "transition-colors duration-200",
                "dark:bg-gray-800/50 bg-gray-50/80",
                "dark:hover:bg-gray-800/70 hover:bg-gray-100/80",
                "dark:border-b dark:border-cyan-900/20 border-b border-cyan-200/20"
              )}
            >
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className="dark:text-gray-300 text-gray-600 font-medium"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className={cn(
                        "w-6 h-6 border-2 rounded-full animate-spin",
                        "dark:border-cyan-500 border-cyan-600",
                        "dark:border-t-transparent border-t-transparent"
                      )}
                    />
                    <span className="dark:text-gray-400 text-gray-600">
                      Chargement...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <span className="dark:text-gray-400 text-gray-600">
                    Aucune donnée trouvée
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {data?.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      "transition-colors duration-200",
                      "dark:bg-gray-900/50 bg-white/50",
                      "dark:hover:bg-gray-800/70 hover:bg-gray-50/70",
                      "dark:border-b dark:border-cyan-900/20 border-b border-cyan-200/20",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {columns.map((column, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className="dark:text-gray-100 text-gray-900"
                      >
                        {column.cell
                          ? column.cell(item)
                          : typeof column.accessorKey === "function"
                          ? column.accessorKey(item)
                          : String(item[column.accessorKey as keyof T])}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (pagination.previous || pagination.next) && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.count} résultats au total
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.previous && pagination.onPageChange(pagination.previous)
              }
              disabled={!pagination.previous || loading}
              className={cn(
                "dark:border-cyan-900/20 border-cyan-200/20",
                "dark:hover:bg-cyan-900/20 hover:bg-cyan-100/50"
              )}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.next && pagination.onPageChange(pagination.next)
              }
              disabled={!pagination.next || loading}
              className={cn(
                "dark:border-cyan-900/20 border-cyan-200/20",
                "dark:hover:bg-cyan-900/20 hover:bg-cyan-100/50"
              )}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}