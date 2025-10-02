"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Artwork, Language } from "@/lib/supabase/types"
import Image from "next/image"
import { ArrowLeft, Globe, Share2, Heart } from "lucide-react"

interface OeuvreClientProps {
  artwork: Artwork
  relatedArtworks: Artwork[]
}

export function OeuvreClient({ artwork, relatedArtworks }: OeuvreClientProps) {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>("fr")
  const [isFavorite, setIsFavorite] = useState(false)

  const languages = [
    { code: "fr" as Language, label: "Français" },
    { code: "en" as Language, label: "English" },
    { code: "wo" as Language, label: "Wolof" },
  ]

  const description =
    language === "fr" ? artwork.description_fr : language === "en" ? artwork.description_en : artwork.description_wo
  const audioUrl =
    language === "fr" ? artwork.audio_url_fr : language === "en" ? artwork.audio_url_en : artwork.audio_url_wo

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork.title,
          text: `Découvrez ${artwork.title} au Musée des Civilisations Noires`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("[v0] Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Lien copié dans le presse-papier !")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={artwork.image_url || "/placeholder.svg"} alt={artwork.title} fill className="object-cover" />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="flex-1 gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`gap-2 ${isFavorite ? "border-primary text-primary" : "bg-transparent"}`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Favori" : "Ajouter"}
            </Button>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-start justify-between gap-4">
              <h1 className="font-serif text-3xl font-bold text-balance text-foreground md:text-4xl">
                {artwork.title}
              </h1>
              <Badge variant="secondary" className="shrink-0">
                QrCode
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{artwork.artist}</p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground">Catégorie</p>
              <p className="mt-1 font-medium text-foreground">{artwork.category?.name_fr || "Non catégorisé"}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground">Origine</p>
              <p className="mt-1 font-medium text-foreground">{artwork.origin}</p>
            </Card>
            <Card className="col-span-2 p-4">
              <p className="text-xs font-medium text-muted-foreground">Période</p>
              <p className="mt-1 font-medium text-foreground">{artwork.year || "Date inconnue"}</p>
            </Card>
          </div>

          {/* Language Selector */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Langue</span>
            </div>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  size="sm"
                  variant={language === lang.code ? "default" : "outline"}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "" : "bg-transparent"}
                >
                  {lang.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Guide Audio</h3>
              <AudioPlayer audioUrl={audioUrl} title={`Description audio - ${artwork.title}`} />
            </div>
          )}

          {/* Description */}
          <Card className="p-6">
            <h3 className="mb-3 font-serif text-lg font-bold text-foreground">Description</h3>
            <p className="leading-relaxed text-pretty text-muted-foreground">{description}</p>
          </Card>

          {/* Related Artworks */}
          {relatedArtworks.length > 0 && (
            <div>
              <h3 className="mb-3 font-serif text-lg font-bold text-foreground">Œuvres similaires</h3>
              <div className="grid grid-cols-2 gap-3">
                {relatedArtworks.map((relatedArt) => (
                  <Button
                    key={relatedArt.id}
                    variant="outline"
                    onClick={() => router.push(`/oeuvre/${relatedArt.id}`)}
                    className="h-auto flex-col gap-1 bg-transparent p-3 text-left"
                  >
                    <span className="w-full truncate font-serif text-sm font-medium text-foreground">
                      {relatedArt.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{relatedArt.artist}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
