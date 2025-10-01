import { redirect, notFound } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { ArtworkForm } from "@/components/artwork-form"
import { createClient } from "@/lib/supabase/server"

export default async function ModifierOeuvrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: artwork } = await supabase
    .from("artworks")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("id", id)
    .single()

  if (!artwork) {
    notFound()
  }

  const { data: categories } = await supabase.from("categories").select("*").order("name_fr")

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav />
      <ArtworkForm categories={categories || []} artwork={artwork} />
    </div>
  )
}
