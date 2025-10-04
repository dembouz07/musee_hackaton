import { Gallery3DRoom } from "@/components/gallery-3d-room"
import { createClient } from "@/lib/supabase/server"
import {Navigation} from "@/components/navigation";

export default async function Gallery3DPage() {
    const supabase = await createClient()

    const { data: artworks } = await supabase
        .from("artworks")
        .select(`
      *,
      category:categories(*)
    `)
        .order("created_at", { ascending: false })

    return(
        <div className="min-h-screen">
            <Navigation />
            <Gallery3DRoom initialArtworks={artworks || []} />
        </div>
    )
}