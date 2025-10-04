import {OeuvreClient} from "@/components/oeuvre-client";
import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {AdminNav} from "@/components/admin-nav";

export default async function OeuvrePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  let { data: artwork } = await supabase
      .from("artworks")
      .select(`
      *,
      category:categories(*)
    `)
      .eq("id", params.id)
      .single()

  // If not found by ID, try by QR code
  if (!artwork) {
    const { data: artworkByQr } = await supabase
        .from("artworks")
        .select(`
        *,
        category:categories(*)
      `)
        .eq("qr_code", params.id)
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
        <AdminNav/>
        <OeuvreClient artwork={artwork} relatedArtworks={relatedArtworks || []} />
      </div>
  )
}
