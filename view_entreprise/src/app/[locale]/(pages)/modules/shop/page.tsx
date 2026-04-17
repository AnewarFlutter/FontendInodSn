"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  CheckCircle2, CreditCard, Lock, Search, ChevronRight,
  LayoutGrid, List, UserMinus, AlertTriangle,
  ChevronsLeft, ChevronsRight, ChevronLeft,
  ScrollText, FolderOpen, CalendarDays, Receipt,
  PenLine, Archive, Check, Tag, Clock, Layers,
  Building2, Hash, Star, ShoppingCart, SlidersHorizontal, Download, FileText, Hourglass,
} from "lucide-react"
import {
  IconListDetails,
  IconToggleLeft,
  IconToggleRight,
  IconRefresh,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import { APP_IMAGES } from "@/shared/constants/images"
import { LoadingButton } from "@/components/loading-button"
import { APP_ROUTES } from "@/shared/constants/routes"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ModuleStatus = "actif" | "inactif" | "expire"
type FilterTab    = "tous" | "actif" | "inactif" | "expire"

interface DocSection {
  title: string
  description: string
  steps?: string[]
}

interface ModuleDoc {
  intro: string
  videoTitle?: string
  videoDuration?: string
  videoId?: string
  sections: DocSection[]
}

interface Module {
  id: string
  nom: string
  description: string
  features: string[]
  featureDetails: { title: string; description: string }[]
  prix: number
  prixHT: number
  prixTTC: number
  tva: number
  delais: string
  delaisMax: string
  categorie: string
  duree: number
  status: ModuleStatus
  version: string
  auteur: string
  rating: number
  reviews: number
  downloads: number
  doc: ModuleDoc
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MODULES: Module[] = [
  {
    id: "actes",
    nom: "Gestion des Actes Notariaux",
    description: "Rédigez, numérotez et archivez vos actes notariaux. Suivi des signatures et conformité légale intégrés.",
    features: ["Rédaction d'actes", "Suivi des signatures", "Archivage légal", "Numérotation automatique"],
    prix: 15000, prixHT: 15000, prixTTC: 17700, tva: 18,
    delais: "0 à 30 jours", delaisMax: "720 h", categorie: "Actes & Juridique",
    duree: 30, status: "actif", version: "v2.4.1", auteur: "NotaDesk",
    rating: 4.5, reviews: 104, downloads: 1240,
    featureDetails: [
      { title: "Rédaction d'actes", description: "Créez vos actes notariaux directement dans la plateforme grâce à des modèles conformes aux exigences légales en vigueur. Gagnez un temps précieux à chaque nouveau dossier." },
      { title: "Suivi des signatures", description: "Suivez en temps réel l'avancement des signatures de chaque partie. Recevez des notifications automatiques à chaque étape, sans relancer manuellement." },
      { title: "Archivage légal", description: "Chaque acte est archivé de manière sécurisée et horodatée, garantissant sa valeur probante sur le long terme. Conformité RGPD et réglementations notariales assurée." },
      { title: "Numérotation automatique", description: "Plus d'erreurs de numérotation : le système génère automatiquement les références de vos actes selon votre registre, assurant une traçabilité sans faille." },
    ],
    doc: {
      intro: "Ce guide vous explique comment utiliser le module Gestion des Actes Notariaux, étape par étape.",
      videoTitle: "Tutoriel complet — Gestion des Actes Notariaux",
      videoDuration: "4:32", videoId: "dQw4w9WgXcQ",
      sections: [
        { title: "Créer un nouvel acte", description: "Accédez à la section 'Actes' depuis le menu principal.", steps: ["Cliquez sur le bouton '+ Nouvel acte' en haut à droite.", "Sélectionnez le type d'acte dans la liste déroulante (vente, donation, bail, etc.).", "Remplissez les informations des parties concernées.", "Cliquez sur 'Enregistrer' pour sauvegarder le brouillon."] },
        { title: "Envoyer pour signature", description: "Une fois l'acte rédigé, vous pouvez l'envoyer aux signataires.", steps: ["Ouvrez l'acte depuis la liste.", "Cliquez sur le bouton 'Envoyer pour signature'.", "Ajoutez les adresses email des signataires.", "Suivez l'avancement depuis l'onglet 'Suivi des signatures'."] },
        { title: "Archiver un acte", description: "Tout acte finalisé peut être archivé légalement en un clic.", steps: ["Sélectionnez l'acte dans la liste.", "Cliquez sur 'Archiver'.", "Confirmez l'archivage — l'acte est horodaté et signé numériquement.", "Il sera accessible depuis la section 'Archives' à tout moment."] },
        { title: "Boutons principaux", description: "Référence rapide des actions disponibles.", steps: ["'+ Nouvel acte' — Créer un acte depuis un modèle.", "'Envoyer' — Transmettre l'acte aux parties pour signature.", "'Archiver' — Clôturer et sécuriser l'acte définitivement.", "'Télécharger PDF' — Exporter l'acte en format imprimable."] },
      ],
    },
  },
  {
    id: "dossiers",
    nom: "Gestion des Dossiers",
    description: "Centralisez tous vos dossiers clients. Alertes d'échéance, historique complet et partage sécurisé.",
    features: ["Suivi des dossiers", "Alertes d'échéance", "Partage sécurisé", "Historique complet"],
    prix: 12000, prixHT: 12000, prixTTC: 14160, tva: 18,
    delais: "0 à 30 jours", delaisMax: "720 h", categorie: "Gestion Cabinet",
    duree: 30, status: "actif", version: "v1.8.0", auteur: "NotaDesk",
    rating: 4.7, reviews: 57, downloads: 892,
    featureDetails: [
      { title: "Suivi des dossiers", description: "Visualisez l'état d'avancement de chaque dossier en un coup d'œil. Tableau de bord centralisé, filtres intelligents et vue par client pour une gestion sans prise de tête." },
      { title: "Alertes d'échéance", description: "Ne manquez plus jamais une date critique. Le système vous avertit automatiquement par email et notification avant chaque échéance légale ou délai contractuel." },
      { title: "Partage sécurisé", description: "Partagez des documents sensibles avec vos clients ou confrères via un espace sécurisé chiffré. Contrôle des accès granulaire et traçabilité complète des consultations." },
      { title: "Historique complet", description: "Chaque action sur un dossier est enregistrée et horodatée. Retrouvez instantanément qui a modifié quoi et quand, pour une transparence totale et une sécurité juridique maximale." },
    ],
    doc: {
      intro: "Gérez l'intégralité de vos dossiers clients depuis un espace centralisé et sécurisé.",
      videoTitle: "Prise en main — Gestion des Dossiers",
      videoDuration: "3:48", videoId: "dQw4w9WgXcQ",
      sections: [
        { title: "Créer un dossier", description: "Ouvrez un nouveau dossier pour chaque client ou affaire.", steps: ["Cliquez sur '+ Nouveau dossier' dans la barre d'actions.", "Renseignez le nom du client, le type d'affaire et la date d'ouverture.", "Ajoutez les pièces justificatives dans l'onglet 'Documents'.", "Assignez un collaborateur responsable si nécessaire."] },
        { title: "Gérer les échéances", description: "Configurez des alertes pour ne jamais manquer une date limite.", steps: ["Ouvrez le dossier concerné.", "Allez dans l'onglet 'Échéances'.", "Cliquez sur '+ Ajouter une échéance' et saisissez la date.", "Choisissez le délai de rappel (J-7, J-3, J-1) — une notification sera envoyée automatiquement."] },
        { title: "Partager un dossier", description: "Donnez accès à votre client ou un confrère de manière sécurisée.", steps: ["Ouvrez le dossier et cliquez sur 'Partager'.", "Saisissez l'email du destinataire.", "Définissez les droits d'accès : lecture seule ou modification.", "Le destinataire reçoit un lien sécurisé valable 7 jours."] },
        { title: "Boutons principaux", description: "Référence rapide des actions du module.", steps: ["'+ Nouveau dossier' — Créer un dossier client.", "'Partager' — Envoyer un accès sécurisé.", "'Archiver' — Clôturer le dossier après traitement.", "'Historique' — Voir toutes les actions effectuées."] },
      ],
    },
  },
  {
    id: "agenda",
    nom: "Agenda & Rendez-vous",
    description: "Calendrier partagé pour votre cabinet. Rappels automatiques par SMS et email, confirmation en ligne.",
    features: ["Calendrier partagé", "Rappels SMS/Email", "Confirmation en ligne", "Gestion des salles"],
    prix: 8000, prixHT: 8000, prixTTC: 9440, tva: 18,
    delais: "0 à 30 jours", delaisMax: "720 h", categorie: "Planification",
    duree: 30, status: "inactif", version: "v3.1.0", auteur: "NotaDesk",
    rating: 4.2, reviews: 38, downloads: 430,
    featureDetails: [
      { title: "Calendrier partagé", description: "Un seul calendrier pour toute l'équipe. Vos collaborateurs visualisent les disponibilités en temps réel et planifient les rendez-vous sans conflit ni double réservation." },
      { title: "Rappels SMS/Email", description: "Réduisez drastiquement les rendez-vous manqués. Vos clients reçoivent des rappels automatiques par SMS et email aux moments clés avant leur rendez-vous." },
      { title: "Confirmation en ligne", description: "Vos clients confirment ou reportent leur rendez-vous en un clic depuis leur téléphone. Zéro appel téléphonique inutile, une expérience client modernisée." },
      { title: "Gestion des salles", description: "Gérez la disponibilité de vos salles de réunion directement depuis l'agenda. Évitez les conflits de réservation et optimisez l'utilisation de vos espaces." },
    ],
    doc: {
      intro: "Organisez votre agenda cabinet et gérez les rendez-vous clients en quelques clics.",
      videoTitle: "Démo — Agenda & Rendez-vous",
      videoDuration: "2:55", videoId: "dQw4w9WgXcQ",
      sections: [
        { title: "Planifier un rendez-vous", description: "Ajoutez un rendez-vous depuis le calendrier.", steps: ["Cliquez sur un créneau vide dans le calendrier.", "Saisissez le nom du client et l'objet du rendez-vous.", "Sélectionnez la salle si nécessaire.", "Activez les rappels SMS/email pour le client."] },
        { title: "Envoyer une invitation", description: "Votre client reçoit une invitation à confirmer en ligne.", steps: ["Lors de la création, cochez 'Envoyer une invitation client'.", "Le client reçoit un email avec un lien de confirmation.", "L'événement se met à jour automatiquement selon la réponse.", "Vous êtes notifié en temps réel de chaque confirmation."] },
        { title: "Boutons principaux", description: "Référence rapide.", steps: ["'+ RDV' — Ajouter un nouveau rendez-vous.", "'Vue semaine / mois' — Changer l'affichage du calendrier.", "'Rappels' — Gérer les notifications automatiques.", "'Salles' — Consulter la disponibilité des salles."] },
      ],
    },
  },
  {
    id: "comptabilite",
    nom: "Comptabilité Cabinet",
    description: "Facturation, honoraires et rapports financiers pour votre cabinet. Export vers votre logiciel comptable.",
    features: ["Facturation clients", "Suivi des honoraires", "Rapports financiers", "Export comptable"],
    prix: 20000, prixHT: 20000, prixTTC: 23600, tva: 18,
    delais: "0 à 30 jours", delaisMax: "720 h", categorie: "Finance",
    duree: 30, status: "inactif", version: "v1.2.3", auteur: "NotaDesk",
    rating: 4.5, reviews: 24, downloads: 215,
    featureDetails: [
      { title: "Facturation clients", description: "Générez des factures professionnelles conformes en quelques secondes. Personnalisez vos modèles, ajoutez vos honoraires et envoyez directement par email à vos clients." },
      { title: "Suivi des honoraires", description: "Gardez une vision claire de vos revenus : honoraires perçus, en attente et à facturer. Identifiez les dossiers les plus rentables et pilotez votre cabinet sereinement." },
      { title: "Rapports financiers", description: "Tableaux de bord financiers détaillés pour suivre votre activité mois par mois. Analysez vos tendances et prenez des décisions éclairées basées sur des données fiables." },
      { title: "Export comptable", description: "Exportez vos données financières en un clic vers votre logiciel comptable (Sage, EBP, etc.). Éliminez les doubles saisies et les erreurs de retranscription manuelle." },
    ],
    doc: {
      intro: "Pilotez la comptabilité de votre cabinet avec précision, sans formation comptable avancée.",
      videoTitle: "Tutoriel — Comptabilité Cabinet",
      videoDuration: "5:10", videoId: "dQw4w9WgXcQ",
      sections: [
        { title: "Créer une facture", description: "Générez une facture professionnelle en quelques secondes.", steps: ["Allez dans 'Facturation' > '+ Nouvelle facture'.", "Sélectionnez le client dans la liste ou créez-en un nouveau.", "Ajoutez les lignes de prestations avec les montants.", "Cliquez sur 'Envoyer par email' ou 'Télécharger PDF'."] },
        { title: "Suivre les honoraires", description: "Visualisez en temps réel l'état de vos revenus.", steps: ["Accédez au tableau de bord 'Honoraires'.", "Filtrez par période, client ou statut (payé / en attente).", "Cliquez sur une ligne pour voir le détail.", "Relancez un impayé via le bouton 'Envoyer un rappel'."] },
        { title: "Boutons principaux", description: "Référence rapide.", steps: ["'+ Facture' — Créer une nouvelle facture.", "'Exporter' — Envoyer les données vers votre logiciel comptable.", "'Rapport' — Générer un rapport financier mensuel.", "'Rappel' — Relancer un client pour un impayé."] },
      ],
    },
  },
  {
    id: "signature",
    nom: "Signature Électronique",
    description: "Signature à distance avec valeur légale reconnue. Traçabilité complète et multi-signataires.",
    features: ["Signature à distance", "Valeur légale", "Traçabilité complète", "Multi-signataires"],
    prix: 18000, prixHT: 18000, prixTTC: 21240, tva: 18,
    delais: "0 à 30 jours", delaisMax: "720 h", categorie: "Signature & Sécurité",
    duree: 30, status: "expire", version: "v0.9.5", auteur: "NotaDesk",
    rating: 4.8, reviews: 71, downloads: 3100,
    featureDetails: [
      { title: "Signature à distance", description: "Vos clients signent leurs documents depuis n'importe où, sans se déplacer. Accélérez la clôture de vos dossiers et offrez une expérience moderne et fluide." },
      { title: "Valeur légale reconnue", description: "Notre solution est conforme au règlement eIDAS et reconnue par les tribunaux. Chaque signature a la même valeur juridique qu'une signature manuscrite." },
      { title: "Traçabilité complète", description: "Un journal d'audit horodaté enregistre chaque action : ouverture du document, lecture, signature. En cas de litige, vous disposez de preuves incontestables." },
      { title: "Multi-signataires", description: "Gérez des signatures de plusieurs parties sur un même document, dans l'ordre que vous définissez. Idéal pour les actes impliquant vendeurs, acheteurs et garants." },
    ],
    doc: {
      intro: "Faites signer vos documents à distance en toute sécurité, avec valeur légale reconnue.",
      videoTitle: "Démo complète — Signature Électronique",
      videoDuration: "3:22", videoId: "dQw4w9WgXcQ",
      sections: [
        { title: "Envoyer un document à signer", description: "Préparez et envoyez un document pour signature électronique.", steps: ["Allez dans 'Signature' > '+ Nouveau document'.", "Importez votre fichier PDF ou sélectionnez un acte existant.", "Positionnez les zones de signature pour chaque signataire.", "Cliquez sur 'Envoyer' — chaque partie reçoit un lien par email."] },
        { title: "Suivre l'avancement", description: "Consultez en temps réel qui a signé et qui reste en attente.", steps: ["Accédez au tableau de bord 'Suivi des signatures'.", "Chaque signataire est affiché avec son statut (en attente / signé).", "Envoyez une relance depuis le bouton 'Rappeler'.", "Une fois toutes les signatures obtenues, téléchargez le document final."] },
        { title: "Boutons principaux", description: "Référence rapide.", steps: ["'+ Document' — Importer un document à faire signer.", "'Rappeler' — Relancer un signataire en attente.", "'Télécharger' — Récupérer le document signé avec certificat.", "'Journal d'audit' — Consulter la traçabilité complète."] },
      ],
    },
  },
  {
    id: "archivage",
    nom: "Archivage Numérique",
    description: "Stockage illimité avec OCR intégré. Retrouvez n'importe quel document en quelques secondes.",
    features: ["Stockage illimité", "Recherche avancée", "OCR intégré", "Sauvegarde automatique"],
    prix: 10000, prixHT: 10000, prixTTC: 11800, tva: 18,
    delais: "0 à 30 jours", delaisMax: "720 h", categorie: "Archivage",
    duree: 30, status: "inactif", version: "v2.0.0", auteur: "NotaDesk",
    rating: 4.1, reviews: 19, downloads: 178,
    featureDetails: [
      { title: "Stockage illimité", description: "Archivez tous vos documents sans contrainte de volume. Dites adieu aux armoires débordantes et aux disques durs saturés : tout est accessible en ligne, sécurisé et organisé." },
      { title: "Recherche avancée", description: "Retrouvez n'importe quel document en quelques secondes grâce à la recherche par mots-clés, date, client ou type d'acte. Plus besoin de fouiller des classeurs pendant des heures." },
      { title: "OCR intégré", description: "Notre technologie de reconnaissance optique de caractères (OCR) rend vos documents scannés entièrement recherchables. Même un vieux document papier numérisé devient indexé et trouvable." },
      { title: "Sauvegarde automatique", description: "Vos documents sont sauvegardés automatiquement en temps réel sur plusieurs serveurs redondants. Zéro risque de perte de données, même en cas de panne matérielle." },
    ],
    doc: {
      intro: "Centralisez et retrouvez instantanément tous vos documents grâce à l'archivage numérique intelligent.",
      videoTitle: "Tutoriel — Archivage Numérique",
      videoDuration: "4:05", videoId: "dQw4w9WgXcQ",
      sections: [
        { title: "Archiver un document", description: "Importez et indexez vos documents en quelques secondes.", steps: ["Cliquez sur '+ Importer' dans la barre principale.", "Glissez-déposez votre fichier ou sélectionnez-le depuis votre ordinateur.", "Ajoutez des tags et la catégorie pour faciliter la recherche.", "Le document est automatiquement scanné par l'OCR et indexé."] },
        { title: "Rechercher un document", description: "Retrouvez n'importe quel document en quelques secondes.", steps: ["Utilisez la barre de recherche en haut de la page.", "Tapez un mot-clé, un nom de client ou une date.", "Filtrez par type de document, période ou catégorie.", "Cliquez sur le résultat pour ouvrir ou télécharger le document."] },
        { title: "Boutons principaux", description: "Référence rapide.", steps: ["'+ Importer' — Ajouter un nouveau document à l'archive.", "'Rechercher' — Trouver un document par mot-clé ou filtre.", "'Télécharger' — Récupérer une copie locale du document.", "'Partager' — Envoyer un accès sécurisé à un tiers."] },
      ],
    },
  },
]

// ─── Icônes & couleurs par module / catégorie ─────────────────────────────────

const MODULE_LOGOS: Record<string, string> = {
  actes:        APP_IMAGES.modules.actes,
  dossiers:     APP_IMAGES.modules.dossiers,
  agenda:       APP_IMAGES.modules.agenda,
  comptabilite: APP_IMAGES.modules.comptabilite,
  signature:    APP_IMAGES.modules.signature,
  archivage:    APP_IMAGES.modules.archivage,
}

const MODULE_ICONS: Record<string, React.ElementType> = {
  actes:        ScrollText,
  dossiers:     FolderOpen,
  agenda:       CalendarDays,
  comptabilite: Receipt,
  signature:    PenLine,
  archivage:    Archive,
}

const MODULE_CODES: Record<string, string> = {
  actes:        "ACT",
  dossiers:     "DOS",
  agenda:       "AGE",
  comptabilite: "CPT",
  signature:    "SIG",
  archivage:    "ARC",
}

const CATEGORY_STYLE: Record<string, { bg: string; icon: string }> = {
  "Actes & Juridique":    { bg: "bg-blue-50 dark:bg-blue-950/40",    icon: "text-blue-600 dark:text-blue-400"   },
  "Gestion Cabinet":      { bg: "bg-purple-50 dark:bg-purple-950/40", icon: "text-purple-600 dark:text-purple-400" },
  "Planification":        { bg: "bg-orange-50 dark:bg-orange-950/40", icon: "text-orange-600 dark:text-orange-400" },
  "Finance":              { bg: "bg-emerald-50 dark:bg-emerald-950/40",icon: "text-emerald-600 dark:text-emerald-400"},
  "Signature & Sécurité": { bg: "bg-rose-50 dark:bg-rose-950/40",     icon: "text-rose-600 dark:text-rose-400"  },
  "Archivage":            { bg: "bg-amber-50 dark:bg-amber-950/40",   icon: "text-amber-600 dark:text-amber-400" },
}

// ─── Invoice types & mock data ───────────────────────────────────────────────

interface Invoice {
  id: string
  numero: string
  date: string
  montantHT: number
  tva: number
  montantTTC: number
  statut: "payée" | "en attente"
  periode: string
  duree: number
}

const MODULE_INVOICES: Record<string, Invoice[]> = {
  actes: [
    { id: "a1", numero: "FACT-2024-ACT-001", date: "15/01/2024", montantHT: 15000, tva: 2700, montantTTC: 17700, statut: "payée",      periode: "Janvier 2024",  duree: 30 },
    { id: "a2", numero: "FACT-2024-ACT-002", date: "15/02/2024", montantHT: 15000, tva: 2700, montantTTC: 17700, statut: "payée",      periode: "Février 2024",  duree: 30 },
    { id: "a3", numero: "FACT-2024-ACT-003", date: "15/03/2024", montantHT: 15000, tva: 2700, montantTTC: 17700, statut: "en attente", periode: "Mars 2024",     duree: 30 },
  ],
  dossiers: [
    { id: "d1", numero: "FACT-2024-DOS-001", date: "10/01/2024", montantHT: 12000, tva: 2160, montantTTC: 14160, statut: "payée",      periode: "Janvier 2024",  duree: 30 },
    { id: "d2", numero: "FACT-2024-DOS-002", date: "10/02/2024", montantHT: 12000, tva: 2160, montantTTC: 14160, statut: "payée",      periode: "Février 2024",  duree: 30 },
    { id: "d3", numero: "FACT-2024-DOS-003", date: "10/03/2024", montantHT: 12000, tva: 2160, montantTTC: 14160, statut: "en attente", periode: "Mars 2024",     duree: 30 },
  ],
  agenda:       [],
  comptabilite: [],
  signature: [
    { id: "s1", numero: "FACT-2023-SIG-001", date: "01/11/2023", montantHT: 18000, tva: 3240, montantTTC: 21240, statut: "payée",      periode: "Novembre 2023", duree: 30 },
    { id: "s2", numero: "FACT-2023-SIG-002", date: "01/12/2023", montantHT: 18000, tva: 3240, montantTTC: 21240, statut: "payée",      periode: "Décembre 2023", duree: 30 },
  ],
  archivage: [],
}

// ─── Barcode visuel ───────────────────────────────────────────────────────────

function BarcodeVisual({ value }: { value: string }) {
  const pattern = React.useMemo(() => {
    const bars: { width: number; isBar: boolean }[] = []
    // Garde-pattern gauche
    bars.push({ width: 2, isBar: true }, { width: 2, isBar: false }, { width: 2, isBar: true })
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i)
      const widths = [
        ((code >> 6) & 0x3) + 1,
        ((code >> 4) & 0x3) + 1,
        ((code >> 2) & 0x3) + 1,
        (code & 0x3) + 1,
      ]
      widths.forEach((w, j) => bars.push({ width: w * 2, isBar: j % 2 === 0 }))
    }
    // Garde-pattern droit
    bars.push({ width: 2, isBar: false }, { width: 2, isBar: true }, { width: 2, isBar: false }, { width: 2, isBar: true })
    return bars
  }, [value])

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-stretch h-14">
        {pattern.map((b, i) => (
          <div
            key={i}
            style={{ width: b.width }}
            className={b.isBar ? "bg-foreground" : "bg-transparent"}
          />
        ))}
      </div>
      <span className="text-[9px] font-mono tracking-widest text-muted-foreground">{value}</span>
    </div>
  )
}

// ─── Invoice Detail Dialog ────────────────────────────────────────────────────

function InvoiceDetailDialog({ invoice, mod, open, onOpenChange }: {
  invoice: Invoice | null
  mod: Module
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  if (!invoice) return null
  const code = MODULE_CODES[mod.id] ?? mod.id.slice(0, 3).toUpperCase()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0 overflow-hidden">
        <div className="h-1 w-full bg-primary shrink-0" />

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* En-tête facture */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-black tracking-tight">FACTURE</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">{invoice.numero}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold">NotaDesk SAS</p>
              <p className="text-xs text-muted-foreground">notadesk.com</p>
              <p className="text-xs text-muted-foreground">contact@notadesk.com</p>
            </div>
          </div>

          <div className="h-px border-t border-dashed" />

          {/* Infos facture */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Facturé à</p>
              <p className="text-sm font-semibold">Cabinet Notarial</p>
              <p className="text-xs text-muted-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@example.com</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Détails</p>
              <div className="flex justify-end gap-2 text-xs">
                <span className="text-muted-foreground">Date :</span>
                <span className="font-medium">{invoice.date}</span>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <span className="text-muted-foreground">Période :</span>
                <span className="font-medium">{invoice.periode}</span>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <span className="text-muted-foreground">Statut :</span>
                <span className={cn("inline-flex items-center gap-1 font-semibold", invoice.statut === "payée" ? "text-emerald-600" : "text-orange-500")}>
                  {invoice.statut === "payée" ? <Check className="h-3 w-3" /> : <Hourglass className="h-3 w-3" />}
                  {invoice.statut === "payée" ? "Payée" : "En attente"}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px border-t border-dashed" />

          {/* Tableau des prestations */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b border-dashed">
              <span className="col-span-6">Désignation</span>
              <span className="col-span-2 text-center">Réf.</span>
              <span className="col-span-2 text-right">HT</span>
              <span className="col-span-2 text-right">TTC</span>
            </div>
            <div className="grid grid-cols-12 text-xs py-2 border-b border-dashed">
              <span className="col-span-6 font-medium">{mod.nom} — {invoice.periode}</span>
              <span className="col-span-2 text-center font-mono text-muted-foreground">{code}</span>
              <span className="col-span-2 text-right tabular-nums">{invoice.montantHT.toLocaleString("fr-FR")} F</span>
              <span className="col-span-2 text-right tabular-nums font-semibold">{invoice.montantTTC.toLocaleString("fr-FR")} F</span>
            </div>
          </div>

          {/* Totaux */}
          <div className="flex justify-end">
            <div className="w-56 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Sous-total HT</span>
                <span className="tabular-nums">{invoice.montantHT.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">TVA (18%)</span>
                <span className="tabular-nums">{invoice.tva.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="h-px border-t border-dashed" />
              <div className="flex justify-between text-sm font-bold">
                <span>Total TTC</span>
                <span className="tabular-nums">{invoice.montantTTC.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>
          </div>

          <div className="h-px border-t border-dashed" />

          {/* Barcode */}
          <div className="flex justify-center pt-1">
            <BarcodeVisual value={invoice.numero} />
          </div>

        </div>

        <div className="px-8 py-4 border-t border-dashed flex justify-end shrink-0">
          <Button
            size="sm"
            className="gap-2 cursor-pointer"
            onClick={() => {
              const w = window.open("", "_blank")
              if (!w) return
              w.document.write(`<!DOCTYPE html><html><head><title>${invoice.numero}</title><style>
                body{font-family:monospace;padding:32px;max-width:600px;margin:auto}
                h1{font-size:22px;font-weight:700;letter-spacing:2px}
                .row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #ccc;font-size:13px}
                .total{font-weight:700;font-size:15px}
                .badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:600;background:${invoice.statut === "payée" ? "#d1fae5" : "#ffedd5"};color:${invoice.statut === "payée" ? "#065f46" : "#c2410c"}}
              </style></head><body>
                <h1>FACTURE</h1>
                <p style="font-size:13px;color:#666">N° ${invoice.numero} &nbsp;|&nbsp; ${invoice.date} &nbsp;|&nbsp; <span class="badge">${invoice.statut === "payée" ? "Payée" : "En attente"}</span></p>
                <hr style="border:none;border-top:2px dashed #ccc;margin:16px 0"/>
                <div class="row"><span>Période</span><span>${invoice.periode}</span></div>
                <div class="row"><span>Durée</span><span>${invoice.duree} jours</span></div>
                <div class="row"><span>Montant HT</span><span>${(invoice.montantHT / 100).toLocaleString("fr-FR", {style:"currency",currency:"XOF"})}</span></div>
                <div class="row"><span>TVA (18%)</span><span>${(invoice.tva / 100).toLocaleString("fr-FR", {style:"currency",currency:"XOF"})}</span></div>
                <div class="row total"><span>Total TTC</span><span>${(invoice.montantTTC / 100).toLocaleString("fr-FR", {style:"currency",currency:"XOF"})}</span></div>
              </body></html>`)
              w.document.close()
              w.print()
            }}
          >
            <Download className="h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="flex items-center gap-1 text-xs">
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviews})</span>
    </span>
  )
}

// ─── Unsubscribe Confirm Dialog ───────────────────────────────────────────────

function UnsubscribeSheet({ module, open, onOpenChange, onConfirm }: {
  module: Module | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (id: string) => void
}) {
  const [loading, setLoading] = React.useState(false)

  const handleConfirm = async () => {
    if (!module) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    onConfirm(module.id)
    onOpenChange(false)
  }

  if (!module) return null
  const Icon = MODULE_ICONS[module.id] ?? FolderOpen
  const code = MODULE_CODES[module.id] ?? module.id.slice(0, 3).toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">
        <div className="h-1 w-full bg-red-500 shrink-0" />
        <DialogHeader className="px-6 pt-5 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-base text-left">Confirmer le désabonnement</DialogTitle>
              <DialogDescription className="text-left mt-0.5">
                Cette action supprimera immédiatement votre accès au module.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-4 rounded-lg border border-dashed bg-muted/30 px-4 py-4">
            <div className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl shrink-0",
              "bg-red-50 dark:bg-red-950/40 text-red-500"
            )}>
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold truncate">{module.nom}</p>
                <span className="text-[10px] font-mono border rounded px-1.5 py-0.5 text-muted-foreground shrink-0">{code}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {module.categorie} · {module.prixTTC.toLocaleString("fr-FR")} FCFA TTC / {module.duree} jours
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 px-4 py-4 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">Action irréversible</p>
            </div>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 leading-relaxed">
              Une fois désabonné, vous perdrez <strong>immédiatement et définitivement</strong> l'accès à ce module
              et à toutes ses fonctionnalités. Aucun remboursement ne sera effectué pour la période restante.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Fonctionnalités qui seront perdues
            </p>
            <div className="rounded-lg border border-dashed divide-y divide-dashed">
              {module.features.map(f => (
                <div key={f} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 shrink-0">
                    <span className="text-[10px] font-bold text-red-500">✕</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t bg-muted/20">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading} className="flex-1 cursor-pointer">
            Annuler, garder l'abonnement
          </Button>
          <LoadingButton variant="destructive" isLoading={loading} onClick={handleConfirm} className="flex-1 gap-2 cursor-pointer">
            <UserMinus className="h-4 w-4" />
            Confirmer le désabonnement
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Payment Dialog ────────────────────────────────────────────────────────────

function PaymentDialog({ module, open, onOpenChange, onSuccess }: {
  module: Module | null; open: boolean
  onOpenChange: (v: boolean) => void; onSuccess: (id: string) => void
}) {
  const [step, setStep]   = React.useState<"form" | "success">("form")
  const [loading, setLoading] = React.useState(false)
  const [card, setCard]   = React.useState({ numero: "", nom: "", expiry: "", cvv: "" })

  React.useEffect(() => {
    if (!open) { setStep("form"); setCard({ numero: "", nom: "", expiry: "", cvv: "" }) }
  }, [open])

  const fmtCard   = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
  const fmtExpiry = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/^(.{2})(.+)/, "$1/$2")

  const handlePay = async () => {
    if (!card.numero || !card.nom || !card.expiry || !card.cvv) { toast.error("Veuillez remplir tous les champs"); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false); setStep("success")
    if (module) onSuccess(module.id)
  }

  if (!module) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden">
        {step === "form" ? (
          <>
            <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
              <SheetTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />Paiement sécurisé
              </SheetTitle>
              <SheetDescription>
                Activation · <span className="font-semibold text-foreground">{module.nom}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-white border border-dashed">
                    <Image src={APP_IMAGES.logo.main} alt="NotaDesk" width={28} height={28} className="object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{module.nom}</p>
                    <p className="text-xs text-muted-foreground">{module.duree} jours d'accès</p>
                  </div>
                </div>
                <p className="text-base font-bold tabular-nums">{module.prix.toLocaleString("fr-FR")} FCFA</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Numéro de carte</Label>
                  <div className="relative">
                    <Input placeholder="0000 0000 0000 0000" value={card.numero}
                      onChange={e => setCard(p => ({ ...p, numero: fmtCard(e.target.value) }))} className="pr-10" />
                    <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nom sur la carte</Label>
                  <Input placeholder="JEAN DUPONT" value={card.nom}
                    onChange={e => setCard(p => ({ ...p, nom: e.target.value.toUpperCase() }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Expiration</Label>
                    <Input placeholder="MM/AA" value={card.expiry}
                      onChange={e => setCard(p => ({ ...p, expiry: fmtExpiry(e.target.value) }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">CVV</Label>
                    <Input placeholder="•••" type="password" maxLength={3} value={card.cvv}
                      onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 shrink-0" />Chiffrement SSL 256 bits
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t shrink-0 flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Annuler</Button>
              <Button onClick={handlePay} disabled={loading} className="flex-1">
                {loading
                  ? <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />Traitement...</span>
                  : <>Payer {module.prix.toLocaleString("fr-FR")} FCFA</>}
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 flex-1 text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-base font-bold">Module activé</h3>
              <p className="text-sm text-muted-foreground mt-1">{module.nom} est maintenant disponible.</p>
            </div>
            <Button className="w-full" onClick={() => onOpenChange(false)}>Fermer</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

// ─── Video Player ─────────────────────────────────────────────────────────────

function VideoPlayer({ videoId, title, duration }: { videoId?: string; title: string; duration?: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <div className="rounded-xl border border-dashed overflow-hidden">
        {/* Thumbnail / preview */}
        <div
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center h-44 group cursor-pointer"
          onClick={() => videoId && setOpen(true)}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 24px,#fff 24px,#fff 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,#fff 24px,#fff 25px)" }}
          />
          <div className="relative flex flex-col items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-14 h-14 rounded-full border border-white/20 backdrop-blur-sm transition-all",
              videoId ? "bg-white/15 group-hover:bg-white/30 group-hover:scale-110" : "bg-white/10 cursor-not-allowed"
            )}>
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-white/80 text-xs font-medium">
              {videoId ? "Regarder la démo" : "Vidéo bientôt disponible"}
            </span>
          </div>
          {duration && (
            <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
              {duration}
            </span>
          )}
        </div>
        <div className="px-4 py-3 bg-muted/20 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <p className="text-xs font-medium text-foreground truncate">{title}</p>
        </div>
      </div>

      {/* Modal YouTube */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v) }}>
        <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden bg-black border-0">
          <DialogHeader className="px-4 py-3 bg-black/80 border-b border-white/10">
            <DialogTitle className="text-sm text-white truncate">{title}</DialogTitle>
          </DialogHeader>
          {videoId && (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Actions Tab (facturation) ───────────────────────────────────────────────

function ActionsTab({ mod, isActif, isExpire, onActivate, onUnsubscribe, onOpenChange }: {
  mod: Module
  isActif: boolean
  isExpire: boolean
  onActivate: (m: Module) => void
  onUnsubscribe: (m: Module) => void
  onOpenChange: (v: boolean) => void
}) {
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [invoiceOpen, setInvoiceOpen] = React.useState(false)
  const invoices = MODULE_INVOICES[mod.id] ?? []

  return (
    <>
      {/* Facturation — uniquement si abonné ou expiré */}
      {(isActif || isExpire) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Historique de facturation</p>
            <span className="text-[10px] text-muted-foreground">{invoices.length} facture{invoices.length > 1 ? "s" : ""}</span>
          </div>

          {invoices.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/10 px-4 py-6 flex flex-col items-center gap-2 text-center">
              <Receipt className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">Aucune facture disponible pour ce module.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed overflow-hidden divide-y divide-dashed">
              {invoices.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => { setSelectedInvoice(inv); setInvoiceOpen(true) }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted shrink-0">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold font-mono truncate">{inv.numero}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{inv.periode}</p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <p className="text-xs font-bold tabular-nums">{inv.montantTTC.toLocaleString("fr-FR")} F</p>
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      inv.statut === "payée"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                    )}>
                      {inv.statut === "payée" ? "Payée" : "En attente"}
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <InvoiceDetailDialog
        invoice={selectedInvoice}
        mod={mod}
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
      />
    </>
  )
}

// ─── Module Detail Sheet ──────────────────────────────────────────────────────

function ModuleDetailSheet({ mod, open, onOpenChange, onActivate, onUnsubscribe }: {
  mod: Module | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onActivate: (m: Module) => void
  onUnsubscribe: (m: Module) => void
}) {
  if (!mod) return null
  const isActif  = mod.status === "actif"
  const isExpire = mod.status === "expire"
  const Icon = MODULE_ICONS[mod.id] ?? FolderOpen
  const code = MODULE_CODES[mod.id] ?? mod.id.slice(0, 3).toUpperCase()
  const catStyle = CATEGORY_STYLE[mod.categorie] ?? { bg: "bg-muted", icon: "text-muted-foreground" }

  const iconBg    = isActif ? "bg-emerald-500/10" : isExpire ? "bg-red-500/10" : "bg-gray-500/10"
  const iconColor = isActif ? "text-emerald-500"  : isExpire ? "text-red-500"  : "text-gray-400"
  const statusBadgeCls = isActif
    ? "rounded-md border-none text-xs bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
    : isExpire
    ? "rounded-md border-none text-xs bg-red-500/10 text-red-600 hover:bg-red-500/10"
    : "rounded-md border-none text-xs bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/10"
  const statusLabel = isActif ? "Actif" : isExpire ? "Expiré" : "Inactif"

  const leftRows: { icon: React.ElementType; label: string; value: React.ReactNode }[] = [
    { icon: Hash,       label: "Référence",  value: <span className="font-mono">{code}</span> },
    { icon: Tag,        label: "Catégorie",  value: mod.categorie },
    { icon: Layers,     label: "Version",    value: mod.version },
    { icon: Building2,  label: "Éditeur",    value: mod.auteur },
    { icon: CreditCard, label: "Prix HT",    value: `${mod.prixHT.toLocaleString("fr-FR")} FCFA` },
    { icon: Receipt,    label: `TVA ${mod.tva}%`, value: `+${(mod.prixTTC - mod.prixHT).toLocaleString("fr-FR")} FCFA` },
    { icon: CreditCard, label: "Prix TTC",   value: <span className="font-bold">{mod.prixTTC.toLocaleString("fr-FR")} FCFA</span> },
    { icon: Clock,      label: "Durée",      value: `${mod.duree} jours` },
    { icon: Clock,      label: "Délai max",  value: mod.delaisMax },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-4xl flex flex-col gap-0 p-0 overflow-hidden">
        <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn("flex items-center justify-center rounded-lg p-2 shrink-0", iconBg)}>
              <Icon className={cn("w-5 h-5", iconColor)} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base truncate">{mod.nom}</SheetTitle>
              <SheetDescription className="text-xs mt-0.5">{mod.categorie} · {mod.version}</SheetDescription>
            </div>
            <div className="ml-auto flex items-center gap-1.5 mr-8">
              <Badge className={statusBadgeCls}>{statusLabel}</Badge>
              <Badge className="rounded-md border-none text-xs bg-muted text-muted-foreground hover:bg-muted font-mono">{code}</Badge>
            </div>
          </div>
        </SheetHeader>

        <div className="flex items-center justify-between px-6 py-2.5 border-b bg-muted/30 shrink-0">
          <span className="text-xs font-medium text-muted-foreground">Détails du module</span>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[320px] shrink-0 flex flex-col border-r overflow-y-auto">
            <div className="flex-1 px-5 py-4 space-y-1">
              <div className="flex items-start py-2 border-b border-dashed">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm leading-relaxed">{mod.description}</p>
                </div>
              </div>

              {leftRows.map((row, i) => (
                <div key={i} className="flex items-start py-2 border-b border-dashed">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="text-sm font-medium">{row.value}</p>
                  </div>
                </div>
              ))}

              {isActif && (
                <div className="rounded-lg border border-dashed bg-muted/30 px-3 py-2.5 flex items-center gap-2 mt-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground">Module actif et accessible.</p>
                </div>
              )}
              {isExpire && (
                <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 px-3 py-2.5 flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <p className="text-xs text-red-600 dark:text-red-400">Abonnement expiré.</p>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t shrink-0">
              {isActif ? (
                <Button variant="destructive" size="sm" className="w-full gap-2 cursor-pointer"
                  onClick={() => { onOpenChange(false); onUnsubscribe(mod) }}>
                  <UserMinus className="w-4 h-4" />Se désabonner
                </Button>
              ) : (
                <Button size="sm" className="w-full gap-2 cursor-pointer font-semibold"
                  variant={isExpire ? "outline" : "default"}
                  onClick={() => { onOpenChange(false); onActivate(mod) }}>
                  <CreditCard className="w-4 h-4" />
                  {isExpire ? "Renouveler l'abonnement" : "S'abonner au module"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="fonctionnalites" className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 pt-4 pb-3 border-b shrink-0">
                <TabsList className="h-9 bg-muted/60 p-1 rounded-lg">
                  <TabsTrigger value="fonctionnalites" className="text-xs gap-1.5 cursor-pointer">
                    Fonctionnalités
                    <span className="rounded-full bg-blue-500/15 text-blue-600 text-[10px] px-1.5 py-0.5 font-semibold leading-none">
                      {mod.features.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="text-xs gap-1.5 cursor-pointer">Mes factures</TabsTrigger>
                  <TabsTrigger value="doc" className="text-xs gap-1.5 cursor-pointer">Doc</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="fonctionnalites" className="flex-1 overflow-y-auto px-6 py-5 space-y-4 mt-0">
                {(mod.featureDetails ?? []).map((f, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-1">{f.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="actions" className="flex-1 overflow-y-auto px-6 py-4 space-y-4 mt-0">
                <ActionsTab mod={mod} isActif={isActif} isExpire={isExpire} onActivate={onActivate} onUnsubscribe={onUnsubscribe} onOpenChange={onOpenChange} />
              </TabsContent>

              <TabsContent value="doc" className="flex-1 overflow-y-auto px-6 py-5 mt-0">
                <div className="space-y-6">

                  {/* Video player */}
                  <VideoPlayer
                    videoId={mod.doc?.videoId}
                    title={mod.doc?.videoTitle ?? "Tutoriel — " + mod.nom}
                    duration={mod.doc?.videoDuration}
                  />

                  {/* Intro */}
                  <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {mod.doc?.intro ?? "Guide d'utilisation du module " + mod.nom}
                    </p>
                  </div>

                  {/* Sections */}
                  {(mod.doc?.sections ?? []).map((section, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm font-semibold">{section.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground pl-7">{section.description}</p>
                      {section.steps && (
                        <div className="pl-7 space-y-1.5">
                          {section.steps.map((step, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <span className="text-[10px] font-mono text-muted-foreground/60 mt-0.5 w-4 shrink-0">{j + 1}.</span>
                              <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {i < (mod.doc?.sections.length ?? 0) - 1 && (
                        <div className="h-px border-t border-dashed ml-7" />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Marketplace Card ─────────────────────────────────────────────────────────

function fmtDownloads(n: number | undefined) {
  if (!n) return "0"
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return String(n)
}

function MarketplaceCard({ mod, onActivate, onUnsubscribe, onDetail }: {
  mod: Module
  onActivate: (m: Module) => void
  onUnsubscribe: (m: Module) => void
  onDetail: (m: Module) => void
}) {
  const isActif  = mod.status === "actif"
  const isExpire = mod.status === "expire"
  const Icon = MODULE_ICONS[mod.id] ?? FolderOpen
  const catStyle = CATEGORY_STYLE[mod.categorie] ?? { bg: "bg-muted", icon: "text-muted-foreground" }
  const logoSrc  = MODULE_LOGOS[mod.id]
  const [imgError, setImgError] = React.useState(false)

  return (
    <div
      className="group relative rounded-xl border border-dashed bg-card transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
      onClick={() => onDetail(mod)}
    >

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1 min-h-[160px]">
        <h3 className="text-xs font-semibold leading-snug line-clamp-2 min-h-[2rem]">{mod.nom}</h3>

        <div className="flex items-center gap-1">
          <span className="text-[11px] text-muted-foreground">Par {mod.auteur}</span>
          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-1.5 border-t border-dashed mt-auto">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StarRating rating={mod.rating} reviews={mod.reviews} />
            <span className="text-muted-foreground text-xs">·</span>
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Download className="h-3 w-3 shrink-0" />
              {fmtDownloads(mod.downloads)}
            </span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {mod.prix.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <Button
            size="sm"
            variant={isActif || isExpire ? "outline" : "default"}
            className={cn(
              "h-7 text-[11px] px-2.5 font-semibold shrink-0 cursor-pointer border-dashed",
              isActif && "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
              isExpire && "text-muted-foreground border-gray-200 hover:bg-muted"
            )}
            onClick={(e) => {
              e.stopPropagation()
              if (isActif) onUnsubscribe(mod)
              else onActivate(mod)
            }}
          >
            {isActif ? "Désabonner" : isExpire ? "Renouveler" : "S'abonner"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function ListRow({ mod, onActivate, onUnsubscribe, onDetail }: {
  mod: Module
  onActivate: (m: Module) => void
  onUnsubscribe: (m: Module) => void
  onDetail: (m: Module) => void
}) {
  const isActif  = mod.status === "actif"
  const isExpire = mod.status === "expire"
  const Icon = MODULE_ICONS[mod.id] ?? FolderOpen
  const catStyle = CATEGORY_STYLE[mod.categorie] ?? { bg: "bg-muted", icon: "text-muted-foreground" }
  const statusLabel = isActif ? "Actif" : isExpire ? "Expiré" : "Inactif"
  const statusClass = isActif ? "text-emerald-500" : isExpire ? "text-red-500" : "text-slate-500"
  const dotClass    = isActif ? "bg-emerald-500" : isExpire ? "bg-red-500" : "bg-slate-400"

  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-dashed bg-card px-4 py-3 transition-all cursor-pointer"
      onClick={() => onDetail(mod)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate">{mod.nom}</span>
          <span className="text-[10px] text-muted-foreground border rounded px-1 py-px font-mono shrink-0">{mod.version}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{mod.description}</p>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <StarRating rating={mod.rating} reviews={mod.reviews} />
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold tabular-nums">{mod.prix.toLocaleString("fr-FR")} <span className="text-xs font-normal text-muted-foreground">FCFA</span></p>
        <p className="text-[10px] text-muted-foreground">/ {mod.duree} jours</p>
      </div>

      <span className={cn("shrink-0 flex items-center gap-1.5 text-[11px] font-medium w-16 justify-end", statusClass)}>
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotClass)} />{statusLabel}
      </span>

      <div className="shrink-0" onClick={e => e.stopPropagation()}>
        {isActif ? (
          <Button size="sm" variant="outline"
            className="h-7 text-xs px-3 cursor-pointer text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/30"
            onClick={() => onUnsubscribe(mod)}>
            <UserMinus className="h-3.5 w-3.5 mr-1" />Désabonner
          </Button>
        ) : (
          <Button size="sm" variant={isExpire ? "outline" : "default"}
            className="h-7 text-xs px-3 cursor-pointer" onClick={() => onActivate(mod)}>
            {isExpire ? "Renouveler" : "Activer"}<ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopModulesPage() {
  const [modules, setModules]             = React.useState<Module[]>(MODULES)
  const [selected, setSelected]           = React.useState<Module | null>(null)
  const [payOpen, setPayOpen]             = React.useState(false)
  const [unsubSelected, setUnsubSelected] = React.useState<Module | null>(null)
  const [unsubOpen, setUnsubOpen]         = React.useState(false)
  const [detailMod, setDetailMod]         = React.useState<Module | null>(null)
  const [detailOpen, setDetailOpen]       = React.useState(false)
  const [isRefreshing, setIsRefreshing]   = React.useState(false)
  const [search, setSearch]               = React.useState("")
  const [filter, setFilter]               = React.useState<FilterTab>("tous")
  const [view, setView]                   = React.useState<"grid" | "list">("grid")
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [page, setPage]                   = React.useState(1)
  const PAGE_SIZE = 9

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 600))
    setModules(MODULES)
    setIsRefreshing(false)
  }

  const handleDetail     = (mod: Module) => { setDetailMod(mod); setDetailOpen(true) }
  const handleActivate   = (mod: Module) => { setSelected(mod); setPayOpen(true) }
  const handleSuccess    = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, status: "actif" } : m))
    toast.success("Module activé avec succès", { position: "bottom-right" })
  }
  const handleUnsubscribeClick = (mod: Module) => { setUnsubSelected(mod); setUnsubOpen(true) }
  const handleUnsubscribe      = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, status: "inactif" } : m))
    toast.success("Désabonnement effectué", { position: "bottom-right" })
  }

  const counts = {
    tous:    modules.length,
    actif:   modules.filter(m => m.status === "actif").length,
    inactif: modules.filter(m => m.status === "inactif").length,
    expire:  modules.filter(m => m.status === "expire").length,
  }

  const categories = React.useMemo(() => {
    const map = new Map<string, number>()
    modules.forEach(m => map.set(m.categorie, (map.get(m.categorie) ?? 0) + 1))
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  }, [modules])

  const filtered = React.useMemo(() => {
    let list = filter === "tous" ? modules : modules.filter(m => m.status === filter)
    if (selectedCategories.length > 0) list = list.filter(m => selectedCategories.includes(m.categorie))
    if (search.trim()) list = list.filter(m =>
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    )
    return list
  }, [modules, filter, selectedCategories, search])

  React.useEffect(() => { setPage(1) }, [filter, search, selectedCategories])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const STATUS_FILTERS: { key: FilterTab; label: string; dot: string }[] = [
    { key: "tous",    label: "Tous les modules",   dot: "bg-black dark:bg-white" },
    { key: "actif",   label: "Actifs",             dot: "bg-black dark:bg-white" },
    { key: "inactif", label: "Disponibles",        dot: "bg-black dark:bg-white" },
    { key: "expire",  label: "Expirés",            dot: "bg-black dark:bg-white" },
  ]

  return (
    <div className="flex flex-1 overflow-hidden">

      {/* ── Sidebar gauche ── */}
      <aside className="w-64 shrink-0 border-r border-dashed flex flex-col gap-0 overflow-y-auto bg-muted/10">

        {/* Header sidebar */}
        <div className="px-4 py-4 border-b border-dashed">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Filtres</span>
          </div>
        </div>

        {/* Recherche */}
        <div className="px-4 py-4 border-b border-dashed space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recherche</p>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Nom du module…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm bg-background"
            />
          </div>
        </div>

        {/* Statut */}
        <div className="px-4 py-4 border-b border-dashed space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Statut</p>
          <div className="space-y-0.5">
            {STATUS_FILTERS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                  filter === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full shrink-0", filter === tab.key ? "bg-white" : tab.dot)} />
                  <span>{tab.label}</span>
                </div>
                <span className="text-xs tabular-nums font-medium">{counts[tab.key]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div className="px-4 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Catégories</p>
            {selectedCategories.length > 0 && (
              <button
                className="text-[10px] text-primary hover:underline cursor-pointer"
                onClick={() => setSelectedCategories([])}
              >
                Réinitialiser
              </button>
            )}
          </div>
          <div className="space-y-2">
            {categories.map(cat => (
              <label
                key={cat.name}
                className="flex items-center justify-between gap-2 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={selectedCategories.includes(cat.name)}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedCategories(p => [...p, cat.name])
                      else setSelectedCategories(p => p.filter(c => c !== cat.name))
                    }}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-none">
                    {cat.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">{cat.count}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dashed bg-background shrink-0">
          <div>
            <h1 className="text-lg font-bold">Marketplace des Modules</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} module{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LoadingButton
              size="sm" variant="secondary" isLoading={isRefreshing}
              className="border-0 shadow-none font-semibold text-xs cursor-pointer"
              onClick={handleRefresh}
            >
              <IconRefresh className="h-4 w-4" />Rafraîchir
            </LoadingButton>
            <Link href={APP_ROUTES.modules.historique}>
              <Button size="sm" variant="outline" className="shadow-none font-semibold gap-1.5 text-xs border-dashed">
                <CreditCard className="h-3.5 w-3.5" />Historique
              </Button>
            </Link>
            <div className="flex items-center rounded-md border border-dashed bg-muted/40 p-0.5">
              <button
                onClick={() => setView("grid")}
                className={cn("rounded p-1.5 transition-colors cursor-pointer", view === "grid" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("rounded p-1.5 transition-colors cursor-pointer", view === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Search className="h-10 w-10 opacity-15" />
              <p className="text-sm font-medium">Aucun module correspondant</p>
              <p className="text-xs">Modifiez vos filtres pour voir plus de résultats.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-3 gap-3">
              {paginated.map(mod => (
                <MarketplaceCard
                  key={mod.id}
                  mod={mod}
                  onActivate={handleActivate}
                  onUnsubscribe={handleUnsubscribeClick}
                  onDetail={handleDetail}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {paginated.map(mod => (
                <ListRow
                  key={mod.id}
                  mod={mod}
                  onActivate={handleActivate}
                  onUnsubscribe={handleUnsubscribeClick}
                  onDetail={handleDetail}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-dashed bg-background shrink-0">
            <span className="text-sm font-medium text-muted-foreground">
              Page {page} sur {totalPages}
            </span>
            <div className="flex items-center gap-1">
              {[
                { icon: ChevronsLeft,  action: () => setPage(1),           disabled: page === 1 },
                { icon: ChevronLeft,   action: () => setPage(p => p - 1),  disabled: page === 1 },
                { icon: ChevronRight,  action: () => setPage(p => p + 1),  disabled: page === totalPages },
                { icon: ChevronsRight, action: () => setPage(totalPages),  disabled: page === totalPages },
              ].map(({ icon: PagIcon, action, disabled }, i) => (
                <button key={i} onClick={action} disabled={disabled}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border border-dashed transition-colors cursor-pointer",
                    disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-muted"
                  )}>
                  <PagIcon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <ModuleDetailSheet mod={detailMod} open={detailOpen} onOpenChange={setDetailOpen} onActivate={handleActivate} onUnsubscribe={handleUnsubscribeClick} />
      <UnsubscribeSheet module={unsubSelected} open={unsubOpen} onOpenChange={setUnsubOpen} onConfirm={handleUnsubscribe} />
      <PaymentDialog module={selected} open={payOpen} onOpenChange={setPayOpen} onSuccess={handleSuccess} />
    </div>
  )
}
