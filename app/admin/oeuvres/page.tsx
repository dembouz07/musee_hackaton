import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { AdminOeuvresClient } from "@/components/admin-oeuvres-client"
import { createClient } from "@/lib/supabase/server"

export default async function AdminOeuvresPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: artworks } = await supabase
    .from("artworks")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false })

  const { data: categories } = await supabase.from("categories").select("*").order("name_fr")

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav />
      <AdminOeuvresClient artworks={artworks || []} categories={categories || []} />
    </div>
  )
}
