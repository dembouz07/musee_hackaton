import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "QR code is required" }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: artwork, error } = await supabase
    .from("artworks")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("qr_code", code)
    .single()

  if (error || !artwork) {
    return NextResponse.json({ artwork: null }, { status: 404 })
  }

  return NextResponse.json({ artwork })
}
