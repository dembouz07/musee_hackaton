import { use } from "react"
import { notFound } from "next/navigation"
import { OeuvreClient } from "@/components/oeuvre-client"
import { Navigation } from "@/components/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function OeuvrePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const supabase = await createClient()

  let { data: artwork } = await supabase
    .from("artworks")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("id", resolvedParams.id)
    .single()

  // If not found by ID, try by QR code
  if (!artwork) {
    const { data: artworkByQr } = await supabase
      .from("artworks")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("qr_code", resolvedParams.id)
      .single()

    artwork = artworkByQr
  }

  if (!artwork) {
    notFound()
  }

  // Fetch related artworks from same category
  const { data: relatedArtworks } = await supabase
    .from("artworks")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("category_id", artwork.category_id)
    .neq("id", artwork.id)
    .limit(2)

  return (
    <div className="min-h-screen">
      <Navigation />
      <OeuvreClient artwork={artwork} relatedArtworks={relatedArtworks || []} />
    </div>
  )
}
