"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, FolderOpen, QrCode, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Artwork } from "@/lib/supabase/types"

interface AdminDashboardProps {
  artworksCount: number
  categoriesCount: number
  recentArtworks: Artwork[]
}

export function AdminDashboard({ artworksCount, categoriesCount, recentArtworks }: AdminDashboardProps) {
  const stats = [
    {
      label: "Œuvres totales",
      value: artworksCount,
      icon: ImageIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Catégories",
      value: categoriesCount,
      icon: FolderOpen,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
    },
    {
      label: "QR Codes générés",
      value: artworksCount,
      icon: QrCode,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Vues ce mois",
      value: "1,234",
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Vue d'ensemble de la gestion du musée</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 font-serif text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Actions rapides</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/oeuvres/nouvelle">
            <Card className="group cursor-pointer p-6 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">Ajouter une œuvre</h3>
              <p className="mt-1 text-sm text-muted-foreground">Créer une nouvelle entrée dans la collection</p>
            </Card>
          </Link>

          <Link href="/admin/oeuvres">
            <Card className="group cursor-pointer p-6 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <FolderOpen className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">Gérer les œuvres</h3>
              <p className="mt-1 text-sm text-muted-foreground">Modifier ou supprimer des œuvres existantes</p>
            </Card>
          </Link>

          <Link href="/admin/categories">
            <Card className="group cursor-pointer p-6 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">Gérer les catégories</h3>
              <p className="mt-1 text-sm text-muted-foreground">Organiser les œuvres par catégories</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Artworks */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Œuvres récentes</h2>
          <Link href="/admin/oeuvres">
            <Button variant="outline" size="sm" className="bg-transparent">
              Voir tout
            </Button>
          </Link>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Artiste</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Code QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentArtworks.map((artwork) => (
                  <tr key={artwork.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{artwork.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{artwork.artist}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{artwork.category?.name_fr || "N/A"}</td>
                    <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{artwork.qr_code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
