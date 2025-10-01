"use client"

import { useState } from "react"
import { ArtworkCard } from "@/components/artwork-card"
import { ArtworkDetailModal } from "@/components/artwork-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Artwork, Category, Language } from "@/lib/supabase/types"

interface GalerieClientProps {
  initialArtworks: Artwork[]
  categories: Category[]
}

export function GalerieClient({ initialArtworks, categories }: GalerieClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [language, setLanguage] = useState<Language>("fr")

  const filteredArtworks = initialArtworks.filter((artwork) => {
    const matchesCategory = selectedCategory === "all" || artwork.category_id === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.origin.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-balance text-foreground md:text-5xl">Galerie des Œuvres</h1>
        <p className="mt-4 text-lg text-pretty text-muted-foreground">
          Explorez la richesse du patrimoine culturel africain
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative mx-auto max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une œuvre, un artiste, une origine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
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

      {/* Results Count */}
      <div className="mb-6 text-center text-sm text-muted-foreground">
        {filteredArtworks.length} {filteredArtworks.length === 1 ? "œuvre trouvée" : "œuvres trouvées"}
      </div>

      {/* Artworks Grid */}
      {filteredArtworks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} onClick={() => setSelectedArtwork(artwork)} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">Aucune œuvre trouvée pour cette recherche.</p>
        </div>
      )}

      {/* Artwork Detail Modal */}
      <ArtworkDetailModal
        artwork={selectedArtwork}
        isOpen={!!selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        language={language}
        onLanguageChange={setLanguage}
      />
    </div>
  )
}
