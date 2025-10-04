import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch categories
  const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .order("name_fr")

  // Count artworks per category
  const { data: artworks } = await supabase
      .from("artworks")
      .select("id, category_id")

  const getCategoryCount = (categoryId: string) => {
    return artworks?.filter((art) => art.category_id === categoryId).length || 0
  }

  return (
      <div className="min-h-screen bg-muted/30">
        <AdminNav />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground">Gestion des Catégories</h1>
            <p className="mt-2 text-muted-foreground">Organiser les œuvres par catégories</p>
          </div>

          {/* Add Category Form */}
          <Card className="mb-6 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold text-foreground">Ajouter une catégorie</h2>
            <form action="/api/categories" method="POST" className="flex gap-2">
              <Input
                  name="name_fr"
                  placeholder="Nom en français..."
                  required
              />
              <Input
                  name="name_en"
                  placeholder="Nom en anglais..."
                  required
              />
              <Input
                  name="name_wo"
                  placeholder="Nom en wolof..."
                  required
              />
              <Button type="submit" className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </form>
          </Card>

          {/* Categories List */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category) => (
                <Card key={category.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-foreground">{category.name_fr}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{category.name_en}</p>
                      <p className="text-xs text-muted-foreground">{category.name_wo}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {getCategoryCount(category.id)} {getCategoryCount(category.id) === 1 ? "œuvre" : "œuvres"}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
            ))}
          </div>

          {categories?.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Aucune catégorie pour le moment. Ajoutez-en une ci-dessus.</p>
              </Card>
          )}
        </div>
      </div>
  )
}