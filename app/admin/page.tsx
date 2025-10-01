import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { AdminDashboard } from "@/components/admin-dashboard"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { count: artworksCount } = await supabase.from("artworks").select("*", { count: "exact", head: true })

  const { count: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

  const { data: recentArtworks } = await supabase
    .from("artworks")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav />
      <AdminDashboard
        artworksCount={artworksCount || 0}
        categoriesCount={categoriesCount || 0}
        recentArtworks={recentArtworks || []}
      />
    </div>
  )
}
