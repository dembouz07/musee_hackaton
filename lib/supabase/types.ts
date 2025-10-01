export interface Category {
  id: string
  name_fr: string
  name_en: string
  name_wo: string
  slug: string
  created_at: string
}

export interface Artwork {
  id: string
  title: string
  artist: string
  category_id: string | null
  year: number | null
  origin: string
  image_url: string
  qr_code: string
  description_fr: string
  description_en: string
  description_wo: string
  audio_url_fr: string | null
  audio_url_en: string | null
  audio_url_wo: string | null
  created_at: string
  category?: Category
}

export type Language = "fr" | "en" | "wo"
