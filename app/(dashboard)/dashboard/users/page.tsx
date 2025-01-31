"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState(user_roles);
  const [afterUserDialogClose, setAfterUserDialogClose] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUsers({search: searchTerm})
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err);
      }).finally;
    {
      setLoading(false);
    }
  }, [afterUserDialogClose, searchTerm]);


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
              {/* Similar update for status filter Select component */}
            </div>

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
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Nom
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Prénom
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Email
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Téléphone
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Rôle
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Statut
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className={cn(
                            "w-6 h-6 border-2 rounded-full animate-spin",
                            "dark:border-cyan-500 border-cyan-600",
                            "dark:border-t-transparent border-t-transparent"
                          )} />
                          <span className="dark:text-gray-400 text-gray-600">
                            Chargement des utilisateurs...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <span className="dark:text-gray-400 text-gray-600">
                          Aucun utilisateur trouvé
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  <AnimatePresence>
                    {users?.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "transition-colors duration-200",
                          "dark:bg-gray-900/50 bg-white/50",
                          "dark:hover:bg-gray-800/70 hover:bg-gray-50/70",
                          "dark:border-b dark:border-cyan-900/20 border-b border-cyan-200/20"
                        )}
                      >
                        <TableCell className="dark:text-gray-100 text-gray-900 font-medium">
                          {user.last_name}
                        </TableCell>
                        <TableCell className="dark:text-gray-100 text-gray-900">
                          {user.first_name}
                        </TableCell>
                        <TableCell className="dark:text-gray-100 text-gray-900">
                          {user.email}
                        </TableCell>
                        <TableCell className="dark:text-gray-100 text-gray-900">
                          {user.phone_number}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              "dark:bg-cyan-500/10 bg-cyan-500/20",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          >
                            {user_roles().find(
                              (role) => role.value === user.role
                            )?.name || user.role}
                          </span>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-right">
                          <AddUserDialog
                            afterClose={setAfterUserDialogClose}
                            isEdit={true}
                            user={user}
                          />
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
