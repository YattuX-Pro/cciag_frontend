"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Column } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

import type { User } from "@/types";
import AddUserDialog from "./(dialog)/AddUserDialog";
import { getUsers } from "@/fetcher/api-fetcher";
import { toast } from "@/hooks/use-toast";
import { user_roles, user_status_list } from "@/types/const";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/DataTable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState(user_roles);
  const [next, setNext] = useState(null);
  const [count, setCount] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [afterUserDialogClose, setAfterUserDialogClose] = useState(false);
  const [activeFilter, setActiveFilter] = useState<boolean>(true);

  const loadUsers = async (url?: string) => {
    setLoading(true);
    try {
      const params = url
        ? { url }
        : {
            search: searchTerm,
            role: roleFilter !== "all" ? roleFilter : "",
            is_active: activeFilter !== null ? activeFilter : true,
          };

      const data = await getUsers(params);
      setUsers(data.results);
      setNext(data.next);
      setPrevious(data.previous);
      setCount(data.count);
    } catch (err) {
      console.log(err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [afterUserDialogClose, searchTerm, roleFilter, activeFilter]);

  const columns: Column<User>[] = [
    {
      header: "Nom",
      accessorKey: "last_name",
    },
    {
      header: "Prénom",
      accessorKey: "first_name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Téléphone",
      accessorKey: "phone_number",
    },
    {
      header: "Rôle",
      cell: (user) => (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            "dark:bg-cyan-500/10 bg-cyan-500/20",
            "dark:text-cyan-400 text-cyan-600"
          )}
        >
          {user_roles().find((role) => role.value === user.role)?.name ||
            user.role}
        </span>
      ),
      accessorKey: "id",
    },
    {
      header: "Statut",
      cell: (user) => (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            user.is_active
              ? "dark:bg-emerald-500/10 bg-emerald-500/20 dark:text-emerald-400 text-emerald-600"
              : "dark:bg-red-500/10 bg-red-500/20 dark:text-red-400 text-red-600"
          )}
        >
          {user.is_active ? "Actif" : "Non actif"}
        </span>
      ),
      accessorKey: "id",
    },
    {
      header: "Actions",
      cell: (user) => (
        <div className="text-right">
          <AddUserDialog
            afterClose={setAfterUserDialogClose}
            isEdit={true}
            user={user}
          />
        </div>
      ),
      accessorKey: "id",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className={cn(
            "absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob",
            "dark:bg-cyan-800/30 bg-cyan-600/30"
          )}
        />
        <div
          className={cn(
            "absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000",
            "dark:bg-cyan-700/30 bg-cyan-500/30"
          )}
        />
      </div>

      {/* Page Title and Add User Button */}
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            "dark:from-cyan-400 dark:to-cyan-200",
            "from-cyan-600 to-cyan-400"
          )}
        >
          Utilisateurs
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AddUserDialog afterClose={setAfterUserDialogClose} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card
          className={cn(
            "backdrop-blur-sm",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20"
          )}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search
                  className={cn(
                    "absolute left-3 top-3 h-4 w-4",
                    "dark:text-cyan-400 text-cyan-600"
                  )}
                />
                <Input
                  placeholder="Rechercher des utilisateurs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-9 transition-colors duration-200",
                    "dark:bg-gray-800/50 bg-gray-50",
                    "dark:border-cyan-900/20 border-cyan-200/20",
                    "dark:focus:border-cyan-500 focus:border-cyan-600",
                    "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                    "dark:placeholder-gray-400 placeholder:text-gray-500",
                    "dark:text-gray-100 text-gray-900"
                  )}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger
                  className={cn(
                    "w-[180px]",
                    "dark:bg-gray-800/50 bg-gray-50",
                    "dark:border-cyan-900/20 border-cyan-200/20",
                    "dark:text-gray-100 text-gray-900"
                  )}
                >
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent
                  className={cn(
                    "dark:bg-gray-800 bg-white",
                    "dark:border-cyan-900/20 border-cyan-200/20"
                  )}
                >
                  <SelectItem
                    value="all"
                    className="dark:text-gray-100 text-gray-900"
                  >
                    Tous les rôles
                  </SelectItem>
                  {user_roles().map((role, index) => (
                    <SelectItem
                      key={index}
                      value={role.value}
                      className="dark:text-gray-100 text-gray-900"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-start items-center space-x-2 mb-4">
              <Switch
                checked={activeFilter}
                onCheckedChange={(checked) => {
                  setActiveFilter(checked);
                }}
              />
              <Label htmlFor="airplane-mode">
                {activeFilter === null
                  ? "Tous les statuts"
                  : activeFilter
                  ? "Actifs"
                  : "Non Actifs"}
              </Label>
            </div>

            <DataTable
              data={users}
              columns={columns}
              loading={loading}
              pagination={{
                count,
                next,
                previous,
                onPageChange: loadUsers,
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
