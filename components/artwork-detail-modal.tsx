"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/audio-player"
import Image from "next/image"
import type { Artwork, Language } from "@/lib/supabase/types"
import { Globe, Volume2, X } from "lucide-react"

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
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto bg-gradient-to-b from-background to-muted/30 border-primary/20">
          <DialogHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="font-serif text-2xl text-balance text-primary">{artwork.title}</DialogTitle>
                <p className="mt-1 text-base text-foreground/80">{artwork.artist}</p>
              </div>
              <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary border-primary/30">
                {artwork.category?.name_fr || "Œuvre"}
              </Badge>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted shadow-lg">
              <Image
                  src={artwork.image_url || "/placeholder.svg"}
                  alt={artwork.title}
                  fill
                  className="object-contain p-2"
              />
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs font-semibold text-primary mb-1">ORIGINE</p>
                <p className="text-sm font-bold text-foreground">{artwork.origin}</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs font-semibold text-primary mb-1">PÉRIODE</p>
                <p className="text-sm font-bold text-foreground">{artwork.year || "Date inconnue"}</p>
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary">LANGUE</span>
              </div>
              <div className="flex gap-2">
                {languages.map((lang) => (
                    <Button
                        key={lang.code}
                        size="sm"
                        variant={language === lang.code ? "default" : "outline"}
                        onClick={() => onLanguageChange(lang.code)}
                        className={language === lang.code
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs"
                            : "border-primary/30 bg-transparent hover:bg-primary/10 h-8 text-xs"}
                    >
                      {lang.label}
                    </Button>
                ))}
              </div>
            </div>

            {/* Audio Player */}
            {audioUrl && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">GUIDE AUDIO</span>
                  </div>
                  <AudioPlayer audioUrl={audioUrl} title={`Description audio - ${artwork.title}`} />
                </div>
            )}

            {/* Description */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h4 className="mb-2 font-serif text-sm font-bold text-primary">Description</h4>
              <p className="text-xs leading-relaxed text-pretty text-muted-foreground">{description}</p>
            </div>

            {/* Close Button */}
            <Button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
                size="sm"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  )
}