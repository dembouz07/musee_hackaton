import { Navigation } from "@/components/navigation"
import { ScannerClient } from "@/components/scanner-client"
import { createClient } from "@/lib/supabase/server"


// export default async function ScannerPage() {
//   const supabase = await createClient()

//   const { data: quickAccessArtworks } = await supabase.from("artworks").select("id, title, qr_code").limit(4)

//   return (
//     <div className="min-h-screen">
//       <Navigation />
//       <ScannerClient quickAccessArtworks={quickAccessArtworks || []} />
//     </div>
//   )
// }


export default function ScannerPage() {
    return (
        <div className="min-h-screen">
            <Navigation />
            <ScannerClient />
        </div>
    )
}