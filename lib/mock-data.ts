export type Language = "fr" | "en" | "wo"

export interface Artwork {
  id: string
  title: string
  artist: string
  category: string
  year: string
  origin: string
  imageUrl: string
  qrCode: string
  descriptions: {
    fr: string
    en: string
    wo: string
  }
  audioUrls: {
    fr: string
    en: string
    wo: string
  }
}

export const categories = [
  { id: "all", label: { fr: "Toutes", en: "All", wo: "Yépp" } },
  { id: "sculpture", label: { fr: "Sculptures", en: "Sculptures", wo: "Jamonoy" } },
  { id: "peinture", label: { fr: "Peintures", en: "Paintings", wo: "Nataal" } },
  { id: "textile", label: { fr: "Textiles", en: "Textiles", wo: "Dëkk" } },
  { id: "masque", label: { fr: "Masques", en: "Masks", wo: "Ndëmm" } },
  { id: "bijoux", label: { fr: "Bijoux", en: "Jewelry", wo: "Xalis" } },
]

export const mockArtworks: Artwork[] = [
  {
    id: "1",
    title: "Masque Dogon",
    artist: "Artisan Dogon",
    category: "masque",
    year: "XIXe siècle",
    origin: "Mali",
    imageUrl: "/masque-africain-dogon-bois-sculpt-.jpg",
    qrCode: "MCN-001",
    descriptions: {
      fr: "Ce masque Dogon représente un esprit ancestral. Utilisé lors de cérémonies funéraires, il incarne la connexion entre le monde des vivants et celui des ancêtres. Les Dogons du Mali sont réputés pour leur art sculptural raffiné.",
      en: "This Dogon mask represents an ancestral spirit. Used during funeral ceremonies, it embodies the connection between the world of the living and that of the ancestors. The Dogon people of Mali are renowned for their refined sculptural art.",
      wo: "Ndëmm bii Dogon dafa mel ni bakkan bu mag. Dañu ko jëfandikoo ci sarax yu dee, dafa wax ni jëfandikoo ci jëfandikoo ci jëfandikoo.",
    },
    audioUrls: {
      fr: "/audio/artwork-1-fr.mp3",
      en: "/audio/artwork-1-en.mp3",
      wo: "/audio/artwork-1-wo.mp3",
    },
  },
  {
    id: "2",
    title: "Statue Nok",
    artist: "Culture Nok",
    category: "sculpture",
    year: "500 av. J.-C.",
    origin: "Nigeria",
    imageUrl: "/statue-nok-terracotta-nigeria-ancienne.jpg",
    qrCode: "MCN-002",
    descriptions: {
      fr: "Cette sculpture en terre cuite de la culture Nok est l'une des plus anciennes représentations humaines d'Afrique subsaharienne. Elle témoigne d'une civilisation avancée qui maîtrisait la métallurgie du fer.",
      en: "This terracotta sculpture from the Nok culture is one of the oldest human representations in sub-Saharan Africa. It testifies to an advanced civilization that mastered iron metallurgy.",
      wo: "Jamonoy bii ci culture Nok dafa am ci yoon yu gën a mag ci Afrik. Dafa wax ni civilization bu am xam-xam bu mag.",
    },
    audioUrls: {
      fr: "/audio/artwork-2-fr.mp3",
      en: "/audio/artwork-2-en.mp3",
      wo: "/audio/artwork-2-wo.mp3",
    },
  },
  {
    id: "3",
    title: "Tissu Kente",
    artist: "Tisserands Ashanti",
    category: "textile",
    year: "XXe siècle",
    origin: "Ghana",
    imageUrl: "/tissu-kente-ghana-color--motifs-g-om-triques.jpg",
    qrCode: "MCN-003",
    descriptions: {
      fr: "Le Kente est un tissu royal ashanti du Ghana, tissé à la main avec des motifs géométriques colorés. Chaque couleur et motif a une signification symbolique profonde dans la culture akan.",
      en: "Kente is a royal Ashanti fabric from Ghana, hand-woven with colorful geometric patterns. Each color and pattern has deep symbolic meaning in Akan culture.",
      wo: "Kente dafa mel ni dëkk bu royal ci Ghana, dañu ko def ak loxo yu rafet. Benn kenn ci yoon yi ak motif yi am xam-xam bu mag.",
    },
    audioUrls: {
      fr: "/audio/artwork-3-fr.mp3",
      en: "/audio/artwork-3-en.mp3",
      wo: "/audio/artwork-3-wo.mp3",
    },
  },
  {
    id: "4",
    title: "Tête d'Ifé",
    artist: "Royaume d'Ifé",
    category: "sculpture",
    year: "XIIe-XVe siècle",
    origin: "Nigeria",
    imageUrl: "/t-te-if--bronze-nigeria-r-aliste.jpg",
    qrCode: "MCN-004",
    descriptions: {
      fr: "Cette tête en bronze d'Ifé représente le summum de l'art yoruba. Son réalisme exceptionnel et sa technique de fonte à la cire perdue témoignent d'une maîtrise artistique remarquable.",
      en: "This bronze head from Ifé represents the pinnacle of Yoruba art. Its exceptional realism and lost-wax casting technique demonstrate remarkable artistic mastery.",
      wo: "Bopp bii ci bronze ci Ifé dafa mel ni art bu mag bu Yoruba. Réalisme bi ak technique bi dafa wax ni xam-xam bu mag.",
    },
    audioUrls: {
      fr: "/audio/artwork-4-fr.mp3",
      en: "/audio/artwork-4-en.mp3",
      wo: "/audio/artwork-4-wo.mp3",
    },
  },
  {
    id: "5",
    title: "Peinture Tingatinga",
    artist: "Edward Saidi Tingatinga",
    category: "peinture",
    year: "1960s",
    origin: "Tanzanie",
    imageUrl: "/peinture-tingatinga-tanzanie-animaux-color-e.jpg",
    qrCode: "MCN-005",
    descriptions: {
      fr: "Le style Tingatinga est né en Tanzanie dans les années 1960. Caractérisé par des couleurs vives et des représentations d'animaux, ce mouvement artistique est devenu emblématique de l'art contemporain africain.",
      en: "The Tingatinga style was born in Tanzania in the 1960s. Characterized by bright colors and animal representations, this artistic movement has become emblematic of contemporary African art.",
      wo: "Style Tingatinga dañu ko def ci Tanzanie ci 1960s. Ak loxo yu rafet ak animal yi, movement bii dafa am xam-xam bu mag.",
    },
    audioUrls: {
      fr: "/audio/artwork-5-fr.mp3",
      en: "/audio/artwork-5-en.mp3",
      wo: "/audio/artwork-5-wo.mp3",
    },
  },
  {
    id: "6",
    title: "Collier Peul",
    artist: "Artisan Peul",
    category: "bijoux",
    year: "XXe siècle",
    origin: "Sénégal",
    imageUrl: "/collier-peul-or-perles-traditionnel.jpg",
    qrCode: "MCN-006",
    descriptions: {
      fr: "Ce collier peul en or et perles est un symbole de richesse et de statut social. Les Peuls, peuple nomade d'Afrique de l'Ouest, sont réputés pour leur orfèvrerie délicate.",
      en: "This Fulani necklace in gold and beads is a symbol of wealth and social status. The Fulani, a nomadic people of West Africa, are renowned for their delicate goldsmithing.",
      wo: "Collier bii Peul ci or ak perles dafa mel ni xalis ak statut social. Peul yi, nit yu nomade ci Afrik de l'Ouest, dañu ko xam ci orfèvrerie.",
    },
    audioUrls: {
      fr: "/audio/artwork-6-fr.mp3",
      en: "/audio/artwork-6-en.mp3",
      wo: "/audio/artwork-6-wo.mp3",
    },
  },
]
