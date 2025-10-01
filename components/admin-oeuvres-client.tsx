"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Artwork, Category } from "@/lib/supabase/types"

interface AdminOeuvresClientProps {
  artworks: Artwork[]
  categories: Category[]
}

export function AdminOeuvresClient({ artworks, categories }: AdminOeuvresClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesCategory = selectedCategory === "all" || artwork.category_id === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.qr_code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette œuvre ?")) return

    try {
      const response = await fetch(`/api/artworks/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Erreur lors de la suppression")
      }
    } catch (error) {
      alert("Erreur lors de la suppression")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Gestion des Œuvres</h1>
          <p className="mt-2 text-muted-foreground">Gérer la collection du musée</p>
        </div>
        <Link href="/admin/oeuvres/nouvelle">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle œuvre
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par titre, artiste ou code QR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "" : "bg-transparent"}
            >
              Toutes
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "" : "bg-transparent"}
              >
                {category.name_fr}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="mb-4 text-sm text-muted-foreground">
        {filteredArtworks.length} {filteredArtworks.length === 1 ? "œuvre trouvée" : "œuvres trouvées"}
      </div>

      {/* Artworks Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id} className="overflow-hidden">
            <div className="relative aspect-square bg-muted">
              <Image src={artwork.image_url || "/placeholder.svg"} alt={artwork.title} fill className="object-cover" />
              <Badge className="absolute right-2 top-2 bg-primary/90 text-primary-foreground">{artwork.qr_code}</Badge>
            </div>

            <div className="p-4">
              <h3 className="font-serif text-lg font-bold text-balance text-foreground line-clamp-1">
                {artwork.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{artwork.artist}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{artwork.category?.name_fr || "N/A"}</Badge>
                <span>{artwork.origin}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <Link href={`/oeuvre/${artwork.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    Voir
                  </Button>
                </Link>
                <Link href={`/admin/oeuvres/${artwork.id}/modifier`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(artwork.id)}
                  className="gap-2 bg-transparent text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
