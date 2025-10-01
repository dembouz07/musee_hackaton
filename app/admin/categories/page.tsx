"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { checkAuth } from "@/lib/auth"
import { categories, mockArtworks } from "@/lib/mock-data"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [newCategory, setNewCategory] = useState("")

  useEffect(() => {
    if (!checkAuth()) {
      router.push("/admin/login")
    }
  }, [router])

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return mockArtworks.length
    return mockArtworks.filter((art) => art.category === categoryId).length
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Gestion des Catégories</h1>
          <p className="mt-2 text-muted-foreground">Organiser les œuvres par catégories</p>
        </div>

        {/* Add Category */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 font-serif text-lg font-bold text-foreground">Ajouter une catégorie</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Nom de la catégorie..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </Card>

        {/* Categories List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((cat) => cat.id !== "all")
            .map((category) => (
              <Card key={category.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold capitalize text-foreground">{category.label.fr}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {getCategoryCount(category.id)} {getCategoryCount(category.id) === 1 ? "œuvre" : "œuvres"}
                    </p>
                  </div>
                  <Badge variant="secondary">{category.id}</Badge>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
