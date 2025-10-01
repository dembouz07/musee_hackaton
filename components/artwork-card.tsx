"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Artwork } from "@/lib/supabase/types"

interface ArtworkCardProps {
  artwork: Artwork
  onClick: () => void
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={artwork.image_url || "/placeholder.svg"}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <Badge className="absolute right-2 top-2 bg-primary/90 text-primary-foreground">
          {artwork.category?.name_fr || "Non catégorisé"}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-bold text-balance text-foreground line-clamp-1">{artwork.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{artwork.artist}</p>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{artwork.origin}</span>
          <span>{artwork.year || "Date inconnue"}</span>
        </div>
      </div>
    </Card>
  )
}
