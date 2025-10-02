"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/audio-player"
import Image from "next/image"
import type { Artwork, Language } from "@/lib/supabase/types"
import { Globe } from "lucide-react"

interface ArtworkDetailModalProps {
  artwork: Artwork | null
  isOpen: boolean
  onClose: () => void
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function ArtworkDetailModal({ artwork, isOpen, onClose, language, onLanguageChange }: ArtworkDetailModalProps) {
  if (!artwork) return null

  const languages = [
    { code: "fr" as Language, label: "Français" },
    { code: "en" as Language, label: "English" },
    { code: "wo" as Language, label: "Wolof" },
  ]

  const description =
    language === "fr" ? artwork.description_fr : language === "en" ? artwork.description_en : artwork.description_wo
  const audioUrl =
    language === "fr" ? artwork.audio_url_fr : language === "en" ? artwork.audio_url_en : artwork.audio_url_wo

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="font-serif text-2xl text-balance">{artwork.title}</DialogTitle>
              <p className="mt-1 text-muted-foreground">{artwork.artist}</p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              QrCode
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image src={artwork.image_url || "/placeholder.svg"} alt={artwork.title} fill className="object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Catégorie</p>
                <p className="mt-1 font-medium text-foreground">{artwork.category?.name_fr || "Non catégorisé"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Origine</p>
                <p className="mt-1 font-medium text-foreground">{artwork.origin}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Période</p>
                <p className="mt-1 font-medium text-foreground">{artwork.year || "Date inconnue"}</p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    size="sm"
                    variant={language === lang.code ? "default" : "outline"}
                    onClick={() => onLanguageChange(lang.code)}
                    className={language === lang.code ? "" : "bg-transparent"}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Audio Player */}
            {audioUrl && <AudioPlayer audioUrl={audioUrl} title={`Description audio - ${artwork.title}`} />}

            {/* Description */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="mb-2 font-serif text-sm font-bold text-foreground">Description</h4>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
