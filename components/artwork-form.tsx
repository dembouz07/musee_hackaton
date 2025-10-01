"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/lib/supabase/types"

interface ArtworkFormProps {
  categories: Category[]
  artwork?: any
}

export function ArtworkForm({ categories, artwork }: ArtworkFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: artwork?.title || "",
    artist: artwork?.artist || "",
    category_id: artwork?.category_id || "",
    qr_code: artwork?.qr_code || "",
    origin: artwork?.origin || "",
    year: artwork?.year || "",
    description_fr: artwork?.description_fr || "",
    description_en: artwork?.description_en || "",
    description_wo: artwork?.description_wo || "",
    image_url: artwork?.image_url || "",
    audio_url_fr: artwork?.audio_url_fr || "",
    audio_url_en: artwork?.audio_url_en || "",
    audio_url_wo: artwork?.audio_url_wo || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = artwork ? `/api/artworks/${artwork.id}` : "/api/artworks"
      const method = artwork ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(artwork ? "Œuvre modifiée avec succès !" : "Œuvre ajoutée avec succès !")
        router.push("/admin/oeuvres")
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error || "Une erreur est survenue"}`)
      }
    } catch (error) {
      alert("Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/oeuvres">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {artwork ? "Modifier l'œuvre" : "Nouvelle Œuvre"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {artwork ? "Modifier les informations de l'œuvre" : "Ajouter une nouvelle œuvre à la collection"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      placeholder="Ex: Masque Dogon"
                      className="mt-2"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist">Artiste *</Label>
                    <Input
                      id="artist"
                      name="artist"
                      required
                      placeholder="Ex: Artisan Dogon"
                      className="mt-2"
                      value={formData.artist}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category_id">Catégorie *</Label>
                    <select
                      id="category_id"
                      name="category_id"
                      required
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name_fr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="qr_code">Code QR *</Label>
                    <Input
                      id="qr_code"
                      name="qr_code"
                      required
                      placeholder="Ex: MCN-007"
                      className="mt-2"
                      value={formData.qr_code}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="origin">Origine *</Label>
                    <Input
                      id="origin"
                      name="origin"
                      required
                      placeholder="Ex: Mali"
                      className="mt-2"
                      value={formData.origin}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Période</Label>
                    <Input
                      id="year"
                      name="year"
                      placeholder="Ex: XIXe siècle"
                      className="mt-2"
                      value={formData.year}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description_fr">Description (Français) *</Label>
                  <Textarea
                    id="description_fr"
                    name="description_fr"
                    required
                    placeholder="Description détaillée de l'œuvre en français..."
                    className="mt-2 min-h-32"
                    value={formData.description_fr}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="description_en">Description (English) *</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    required
                    placeholder="Detailed description of the artwork in English..."
                    className="mt-2 min-h-32"
                    value={formData.description_en}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="description_wo">Description (Wolof) *</Label>
                  <Textarea
                    id="description_wo"
                    name="description_wo"
                    required
                    placeholder="Description détaillée de l'œuvre en wolof..."
                    className="mt-2 min-h-32"
                    value={formData.description_wo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image URL */}
            <Card className="p-6">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Image</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image_url">URL de l'image</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    placeholder="https://..."
                    className="mt-2"
                    value={formData.image_url}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Utilisez Vercel Blob ou un service d'hébergement d'images
                  </p>
                </div>
              </div>
            </Card>

            {/* Audio URLs */}
            <Card className="p-6">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Audio</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="audio_url_fr" className="text-xs">
                    URL Audio Français
                  </Label>
                  <Input
                    id="audio_url_fr"
                    name="audio_url_fr"
                    type="url"
                    placeholder="https://..."
                    className="mt-1"
                    value={formData.audio_url_fr}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="audio_url_en" className="text-xs">
                    URL Audio English
                  </Label>
                  <Input
                    id="audio_url_en"
                    name="audio_url_en"
                    type="url"
                    placeholder="https://..."
                    className="mt-1"
                    value={formData.audio_url_en}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="audio_url_wo" className="text-xs">
                    URL Audio Wolof
                  </Label>
                  <Input
                    id="audio_url_wo"
                    name="audio_url_wo"
                    type="url"
                    placeholder="https://..."
                    className="mt-1"
                    value={formData.audio_url_wo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  <Save className="h-4 w-4" />
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Link href="/admin/oeuvres" className="block">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Annuler
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
