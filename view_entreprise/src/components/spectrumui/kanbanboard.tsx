'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Clock, MessageCircle, User, ChefHat, GripVertical, ClipboardList, Utensils, Bell, CheckCheck, X } from 'lucide-react';

interface Dish {
  id: string;
  dishName: string;
  quantity: number;
  comment?: string;
}

interface OrderGroup {
  id: string;
  orderNumber: string;
  tableNumber: string;
  serverName: string;
  orderTime: string;
  priorityNumber: number;
  dishes: Dish[];
}

interface Column {
  id: string;
  title: string;
  orderGroups: OrderGroup[];
  color?: string;
}

const sampleData: Column[] = [
  {
    id: 'todo',
    title: 'A préparer',
    color: '#8B7355',
    orderGroups: [
      {
        id: 'og-1',
        orderNumber: '#CMD-001',
        tableNumber: 'Table 5',
        serverName: 'Marie Dupont',
        orderTime: '14:30',
        priorityNumber: 1,
        dishes: [
          { id: '1', dishName: 'Poulet rôti', quantity: 2, comment: 'Bien cuit, sans la peau' },
          { id: '2', dishName: 'Salade César', quantity: 1 },
          { id: '3', dishName: 'Frites maison', quantity: 2, comment: 'Sans sel' },
          { id: '4', dishName: 'Soupe à l\'oignon', quantity: 1, comment: 'Extra fromage' },
          { id: '5', dishName: 'Tartare de bœuf', quantity: 1 },
          { id: '6', dishName: 'Pâtes carbonara', quantity: 2, comment: 'Sans lardons' },
          { id: '7', dishName: 'Pizza Margherita', quantity: 1 },
          { id: '8', dishName: 'Burger maison', quantity: 3, comment: 'Sans oignon' },
          { id: '9', dishName: 'Steak frites', quantity: 2, comment: 'Saignant' },
          { id: '10', dishName: 'Saumon grillé', quantity: 1 },
          { id: '11', dishName: 'Risotto aux champignons', quantity: 1, comment: 'Sans persil' },
          { id: '12', dishName: 'Crêpes sucrées', quantity: 2 },
          { id: '13', dishName: 'Mousse au chocolat', quantity: 3 },
          { id: '14', dishName: 'Tarte aux pommes', quantity: 1, comment: 'Tiède avec glace vanille' },
        ],
      },
      {
        id: 'og-2',
        orderNumber: '#CMD-002',
        tableNumber: 'Table 12',
        serverName: 'Jean Martin',
        orderTime: '14:45',
        priorityNumber: 1,
        dishes: [
          { id: '4', dishName: 'Steak frites', quantity: 1, comment: 'Saignant' },
          { id: '5', dishName: 'Soupe du jour', quantity: 2 },
        ],
      },
      {
        id: 'og-3',
        orderNumber: '#CMD-002',
        tableNumber: 'Table 12',
        serverName: 'Jean Martin',
        orderTime: '14:45',
        priorityNumber: 2,
        dishes: [
          { id: '6', dishName: 'Dessert du jour', quantity: 2, comment: 'Sans sucre ajouté' },
        ],
      },
    ],
  },
  {
    id: 'progress',
    title: 'En cours de préparation',
    color: '#6B8E23',
    orderGroups: [
      {
        id: 'og-4',
        orderNumber: '#CMD-003',
        tableNumber: 'Table 8',
        serverName: 'Sophie Leroux',
        orderTime: '14:15',
        priorityNumber: 1,
        dishes: [
          { id: '7', dishName: 'Pizza Margherita', quantity: 2, comment: 'Extra basilic' },
          { id: '8', dishName: 'Pasta Carbonara', quantity: 1, comment: 'Extra parmesan' },
        ],
      },
    ],
  },
  {
    id: 'review',
    title: 'Prêt à servir',
    color: '#CD853F',
    orderGroups: [
      {
        id: 'og-5',
        orderNumber: '#CMD-004',
        tableNumber: 'Table 3',
        serverName: 'Pierre Dubois',
        orderTime: '14:00',
        priorityNumber: 1,
        dishes: [
          { id: '9', dishName: 'Burger végétarien', quantity: 1 },
          { id: '10', dishName: 'Jus d\'orange frais', quantity: 2 },
        ],
      },
    ],
  },
  {
    id: 'done',
    title: 'Servi',
    color: '#556B2F',
    orderGroups: [
      {
        id: 'og-6',
        orderNumber: '#CMD-005',
        tableNumber: 'Table 15',
        serverName: 'Lucie Bernard',
        orderTime: '13:45',
        priorityNumber: 1,
        dishes: [
          { id: '11', dishName: 'Saumon grillé', quantity: 1, comment: 'Sans citron' },
          { id: '12', dishName: 'Riz basmati', quantity: 1 },
        ],
      },
    ],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(sampleData);
  const [selectedOrderGroup, setSelectedOrderGroup] = useState<OrderGroup | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const getStatusIcon = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return ClipboardList;
      case 'progress':
        return Utensils;
      case 'review':
        return Bell;
      case 'done':
        return CheckCheck;
      default:
        return ClipboardList;
    }
  };

  const handleOrderClick = (orderGroup: OrderGroup) => {
    setSelectedOrderGroup(orderGroup);
    setSheetOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, orderGroup: OrderGroup, columnId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ orderGroup, sourceColumnId: columnId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { orderGroup, sourceColumnId } = data;

    if (sourceColumnId === targetColumnId) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceColumnId) {
          return { ...col, orderGroups: col.orderGroups.filter((og) => og.id !== orderGroup.id) };
        }
        if (col.id === targetColumnId) {
          return { ...col, orderGroups: [...col.orderGroups, orderGroup] };
        }
        return col;
      }),
    );
  };

  return (
    <div className="">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-light text-neutral-900 dark:text-neutral-100 mb-2">
          Gestion des Commandes
        </h1>
        <p className="text-neutral-700 dark:text-neutral-300">Tableau de bord cuisine</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {columns.map((column) => {
          const StatusIcon = getStatusIcon(column.id);
          return (
            <Card key={`stat-${column.id}`} className="border-2" style={{ borderColor: column.color }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      {column.title}
                    </p>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {column.orderGroups.length}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: column.color + '20' }}
                  >
                    <StatusIcon
                      className="w-6 h-6"
                      style={{ color: column.color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tableau Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-white/20 dark:bg-neutral-900/20 backdrop-blur-xl rounded-3xl p-5 border border-border dark:border-neutral-700/50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full " style={{ backgroundColor: column.color }} />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {column.title}
              </h3>
              <Badge className="bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border-neutral-200/50 dark:border-neutral-600/50">
                {column.orderGroups.length}
              </Badge>
            </div>

            <div className="space-y-4 max-h-[calc(3*180px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
              {column.orderGroups.map((orderGroup) => (
                <Card
                  key={orderGroup.id}
                  className="cursor-move transition-all duration-300 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-600"
                  draggable
                  onDragStart={(e) => handleDragStart(e, orderGroup, column.id)}
                  onClick={() => handleOrderClick(orderGroup)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* En-tête: Priorité à gauche, Commande à droite */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-neutral-400 dark:text-neutral-500 cursor-grab active:cursor-grabbing flex-shrink-0" />
                          <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            #{orderGroup.priorityNumber}
                          </span>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="font-bold border-neutral-300 dark:border-neutral-600">
                            {orderGroup.orderNumber}
                          </Badge>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            {orderGroup.tableNumber}
                          </p>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="flex items-center justify-between gap-3">
                        {/* Heure */}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {orderGroup.orderTime}
                          </span>
                        </div>

                        {/* Nom du serveur */}
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-500 dark:text-green-400" />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {orderGroup.serverName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sheet pour afficher les détails de la commande */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:w-96 flex flex-col p-0">
          <SheetHeader className="p-4 pt-8 border-b">
            <SheetTitle className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{selectedOrderGroup?.orderNumber}</div>
                <div className="text-sm font-normal text-neutral-600 dark:text-neutral-400">
                  {selectedOrderGroup?.tableNumber} • Priorité #{selectedOrderGroup?.priorityNumber}
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedOrderGroup && (
              <div className="space-y-4">
                {/* Liste des plats style panier */}
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                    Plats commandés ({selectedOrderGroup.dishes.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrderGroup.dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          {/* Image placeholder du plat */}
                          <div className="w-20 h-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                            <ChefHat className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                          </div>

                          {/* Détails du plat */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                              {dish.dishName}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs font-bold">
                                Quantité: ×{dish.quantity}
                              </Badge>
                              <Badge className="text-xs font-bold bg-black dark:bg-white text-white dark:text-black">
                                Priorité #{selectedOrderGroup.priorityNumber}
                              </Badge>
                            </div>

                            {/* Commentaire */}
                            {dish.comment && (
                              <div className="mt-2 p-2 bg-black dark:bg-white rounded-lg border border-black dark:border-white">
                                <div className="flex items-start gap-2">
                                  <MessageCircle className="w-4 h-4 text-white dark:text-black shrink-0 mt-0.5" />
                                  <p className="text-xs text-white dark:text-black">
                                    {dish.comment}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
