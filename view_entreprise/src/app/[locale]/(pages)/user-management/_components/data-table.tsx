"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  IconChevronDown,
  IconCaretUpFilled,
  IconCaretDownFilled,
  IconCaretUpDownFilled,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDownload,
  IconFileTypeCsv,
  IconFileTypeXls,
  IconBraces,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "./schema"
import { ActionCell } from "./action-cell"

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getInitials = (prenom: string, nom: string) => {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
}

const getStatutBadgeClass = (statut: string) => {
  switch (statut) {
    case "Actif":
      return "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-green-600/10 text-green-600"
    case "Inactif":
      return "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-amber-600/10 text-amber-600"
    case "Suspendu":
      return "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-red-600/10 text-red-600"
    default:
      return "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-amber-600/10 text-amber-600"
  }
}

const roleClassMap: Record<string, string> = {
  "Administrateur": "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-teal-500/10 text-teal-500",
  "Gérant": "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-blue-600/10 text-blue-600",
  "Serveur": "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-amber-600/10 text-amber-600",
  "Cuisinier": "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-destructive/10 text-destructive",
  "Caissier": "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-purple-600/10 text-purple-600",
}

// ── Columns defined at MODULE LEVEL (stable reference, never recreated) ──────

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Utilisateur
        {column.getIsSorted() === "asc" ? (
          <IconCaretUpFilled className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconCaretDownFilled className="h-3 w-3" />
        ) : (
          <IconCaretUpDownFilled className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={`${user.prenom} ${user.nom}`} />
            <AvatarFallback className="text-xs">
              {getInitials(user.prenom, user.nom)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "telephone",
    header: "Téléphone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("telephone") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "roleName",
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rôle
        {column.getIsSorted() === "asc" ? (
          <IconCaretUpFilled className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconCaretDownFilled className="h-3 w-3" />
        ) : (
          <IconCaretUpDownFilled className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const user = row.original
      const names = user.roleNames?.length ? user.roleNames : (user.roleName ? [user.roleName] : [])
      if (names.length === 0) return <span className="text-muted-foreground text-xs">—</span>
      return (
        <div className="flex flex-wrap gap-1">
          {names.map(name => (
            <Badge
              key={name}
              className={roleClassMap[name] ?? "rounded-md border-none focus-visible:outline-none text-xs uppercase bg-blue-600/10 text-blue-600"}
            >
              {name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none justify-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Statut
        {column.getIsSorted() === "asc" ? (
          <IconCaretUpFilled className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconCaretDownFilled className="h-3 w-3" />
        ) : (
          <IconCaretUpDownFilled className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string
      return (
        <div className="text-center">
          <Badge className={getStatutBadgeClass(statut)}>{statut}</Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
]

// ── DataTable Component ───────────────────────────────────────────────────────

import { useUserManagementContext } from "@/contexts/users-context"

export function DataTable() {
  const { users } = useUserManagementContext()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredData = React.useMemo(() => {
    let filtered = users
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.roleName === roleFilter)
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.statut === statusFilter)
    }
    return filtered
  }, [users, roleFilter, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("nom")?.setFilterValue(event.target.value)
              }
              className="pl-9 w-[220px] border-0 bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rôle</SelectLabel>
                <SelectItem value="all" className="text-xs cursor-pointer">Tous les rôles</SelectItem>
                {[...new Set(users.map(u => u.roleName).filter(Boolean))].map((name) => (
                  <SelectItem key={name} value={name} className="text-xs cursor-pointer">
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] cursor-pointer">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Statut</SelectLabel>
                <SelectItem value="all" className="text-xs cursor-pointer">Tous</SelectItem>
                <SelectItem value="Actif" className="text-xs cursor-pointer">Actif</SelectItem>
                <SelectItem value="Inactif" className="text-xs cursor-pointer">Inactif</SelectItem>
                <SelectItem value="Suspendu" className="text-xs cursor-pointer">Suspendu</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-semibold">
                <IconDownload className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  const headers = ["Nom", "Prénom", "Email", "Téléphone", "Rôle", "Statut", "Dernière connexion"]
                  const rows = filteredData.map((u) => [
                    u.nom, u.prenom, u.email, u.telephone ?? "", u.roleName, u.statut, u.lastLogin ?? "",
                  ])
                  const csv = [headers, ...rows].map((r) => r.join(";")).join("\n")
                  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "utilisateurs.csv"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <IconFileTypeCsv className="h-4 w-4 mr-2" />
                Exporter en CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const headers = ["Nom", "Prénom", "Email", "Téléphone", "Rôle", "Statut", "Dernière connexion"]
                  const rows = filteredData.map((u) => [
                    u.nom, u.prenom, u.email, u.telephone ?? "", u.roleName, u.statut, u.lastLogin ?? "",
                  ])
                  const xlsContent = [headers, ...rows]
                    .map((r) => r.map((v) => `<td>${v}</td>`).join(""))
                    .map((r) => `<tr>${r}</tr>`)
                    .join("")
                  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table>${xlsContent}</table></body></html>`
                  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "utilisateurs.xls"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <IconFileTypeXls className="h-4 w-4 mr-2" />
                Exporter en Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const jsonData = filteredData.map((u) => ({
                    nom: u.nom,
                    prenom: u.prenom,
                    email: u.email,
                    telephone: u.telephone ?? null,
                    role: u.roleName,
                    statut: u.statut,
                    derniere_connexion: u.lastLogin ?? null,
                  }))
                  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "utilisateurs.json"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <IconBraces className="h-4 w-4 mr-2" />
                Exporter en JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted rounded-t-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} utilisateur(s)
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Lignes par page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la première page</span>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Page précédente</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Page suivante</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Aller à la dernière page</span>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}
