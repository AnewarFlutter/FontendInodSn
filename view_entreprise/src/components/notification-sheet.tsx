'use client';

import { useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'acte' | 'dossier' | 'rendez-vous' | 'system' | 'alerte';
  niveau?: 'j1' | 'j3' | 'j7' | 'depasse';
  isRead: boolean;
  createdAt: Date;
}

const mockNotifications: Notification[] = [
  {
    id: 'alerte-1',
    title: 'Signature prévue demain',
    message: 'Dossier IMM-2024-1042 — Moussa NDIAYE / Awa DIOP : signature prévue dans 1 jour',
    type: 'alerte',
    niveau: 'j1',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: 'alerte-2',
    title: 'Retour titre foncier dans 3 jours',
    message: 'Dossier IMM-2024-0887 — SOC. IMMOBILIÈRE : retour titre foncier attendu dans 3 jours',
    type: 'alerte',
    niveau: 'j3',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: 'alerte-3',
    title: 'Dossier en retard',
    message: 'Dossier IMM-2023-0521 — Résidence NGOR Lot 12 : +180 jours de retard sur la signature',
    type: 'alerte',
    niveau: 'depasse',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'alerte-4',
    title: 'Dépôt enregistrement dans 7 jours',
    message: 'Dossier ENT-2024-0234 : dépôt enregistrement en retard de 5 jours',
    type: 'alerte',
    niveau: 'j7',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'alerte-5',
    title: 'Retour foncier en attente depuis 6 mois',
    message: 'Dossier FAM-2023-0156 — Succession DIALLO : retour titre foncier toujours en attente',
    type: 'alerte',
    niveau: 'depasse',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '1',
    title: 'Nouvel acte soumis',
    message: 'L\'acte de vente REF-2024-0891 a été soumis par Me. Dupont pour signature',
    type: 'acte',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: '2',
    title: 'Dossier mis à jour',
    message: 'Le dossier de succession Famille Martin a été complété avec de nouveaux documents',
    type: 'dossier',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '3',
    title: 'Rendez-vous confirmé',
    message: 'M. Bernard Koné a confirmé son rendez-vous du 18 avril à 10h00',
    type: 'rendez-vous',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: '4',
    title: 'Acte signé',
    message: 'L\'acte de donation REF-2024-0887 a été signé par toutes les parties',
    type: 'acte',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: '5',
    title: 'Nouveau dossier ouvert',
    message: 'Un nouveau dossier de mutation immobilière a été ouvert pour Mme. Diallo',
    type: 'dossier',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 35),
  },
  {
    id: '6',
    title: 'Rendez-vous annulé',
    message: 'M. Pierre Sow a annulé son rendez-vous du 19 avril à 14h30',
    type: 'rendez-vous',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '7',
    title: 'Document expirant',
    message: 'La procuration du dossier REF-2024-0750 expire dans 7 jours',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: '8',
    title: 'Acte rejeté',
    message: 'L\'acte REF-2024-0880 a été retourné pour correction par le service d\'enregistrement',
    type: 'acte',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '9',
    title: 'Dossier clôturé',
    message: 'Le dossier de liquidation société REF-2024-0810 a été clôturé avec succès',
    type: 'dossier',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
  },
];

export function NotificationSheet() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'acte':        return 'bg-blue-500/10 text-blue-500';
      case 'dossier':     return 'bg-green-500/10 text-green-500';
      case 'rendez-vous': return 'bg-orange-500/10 text-orange-500';
      case 'system':      return 'bg-purple-500/10 text-purple-500';
      case 'alerte':      return 'bg-red-500/10 text-red-500';
      default:            return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getNiveauBadge = (niveau?: Notification['niveau']) => {
    switch (niveau) {
      case 'j1':      return { label: '⚡ J-1',     cls: 'bg-red-500 text-white' };
      case 'j3':      return { label: '▲ J-3',      cls: 'bg-orange-500 text-white' };
      case 'j7':      return { label: '◆ J-7',      cls: 'bg-amber-400 text-white' };
      case 'depasse': return { label: 'EN RETARD',  cls: 'bg-red-700 text-white' };
      default:        return null;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "À l'instant";
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    return `Il y a ${Math.floor(seconds / 86400)} j`;
  };

  return (
    <Sheet open={notificationOpen} onOpenChange={setNotificationOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">{"Notifications"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 flex flex-col p-0">
        <SheetHeader className="p-4 pt-8 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>{"Notifications"}</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={markAllAsRead}
                >
                  {"Tout marquer comme lu"}
                </Button>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Bell className="h-12 w-12 mb-4" />
                <p className="text-center">
                  {"Aucune notification"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`rounded-xl p-4 border border-dashed transition-colors cursor-pointer ${
                      notification.isRead
                        ? 'bg-background'
                        : 'bg-muted/40 hover:bg-muted/60'
                    }`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getNotificationColor(notification.type)}`}
                            >
                              {notification.type === 'alerte' ? 'Alerte' : notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </Badge>
                            {notification.type === 'alerte' && notification.niveau && (() => {
                              const nb = getNiveauBadge(notification.niveau);
                              return nb ? (
                                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${nb.cls}`}>
                                  {nb.label}
                                </span>
                              ) : null;
                            })()}
                            {!notification.isRead && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <button
                        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-lg border border-dashed text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={clearAllNotifications}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {"Tout supprimer"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
