import { Navigation } from "@/components/navigation"
import { GalerieClient } from "@/components/galerie-client"
import { createClient } from "@/lib/supabase/server"

export default async function GaleriePage() {
  const supabase = await createClient()

  const { data: artworks } = await supabase
    .from("artworks")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false })

  const { data: categories } = await supabase.from("categories").select("*").order("name_fr")

  return (
    <div className="min-h-screen">
      <Navigation />
      <GalerieClient initialArtworks={artworks || []} categories={categories || []} />
    </div>
  )
}
