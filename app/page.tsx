import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { QrCode, ImageIcon, Volume2, Globe, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[url('/african-geometric-patterns-subtle.jpg')] opacity-5" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Expérience Digitale Immersive
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-balance text-foreground md:text-6xl lg:text-7xl">
              Musée des Civilisations Noires
            </h1>
            <p className="mt-6 text-lg text-pretty text-muted-foreground md:text-xl">
              Découvrez le patrimoine culturel africain à travers une expérience enrichie et interactive. Scannez les
              œuvres, écoutez leurs histoires avec des voix africaines authentiques.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/galerie">
                <Button size="lg" className="gap-2 text-base">
                  <ImageIcon className="h-5 w-5" />
                  Explorer la Galerie
                </Button>
              </Link>
              <Link href="/scanner">
                <Button size="lg" variant="outline" className="gap-2 text-base bg-transparent">
                  <QrCode className="h-5 w-5" />
                  Scanner une Œuvre
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-balance text-foreground md:text-4xl">
              Une Expérience Culturelle Unique
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Accédez au patrimoine africain où que vous soyez, avec des descriptions multilingues et des guides audio
              authentiques.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group relative overflow-hidden border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-foreground">Scan QR Code</h3>
              <p className="text-pretty text-muted-foreground">
                Scannez les QR codes au musée pour accéder instantanément aux informations détaillées de chaque œuvre.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative overflow-hidden border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-foreground">Guides Audio Africains</h3>
              <p className="text-pretty text-muted-foreground">
                Écoutez les descriptions avec des voix africaines authentiques pour une immersion culturelle totale.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative overflow-hidden border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-foreground">Multilingue</h3>
              <p className="text-pretty text-muted-foreground">
                Descriptions disponibles en Français, Anglais et Wolof pour une accessibilité maximale.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="group relative overflow-hidden border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-foreground">Galerie Complète</h3>
              <p className="text-pretty text-muted-foreground">
                Explorez toutes les œuvres du musée depuis chez vous avec des images haute qualité.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="group relative overflow-hidden border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-foreground">Expérience Enrichie</h3>
              <p className="text-pretty text-muted-foreground">
                Contexte historique, anecdotes culturelles et informations approfondies pour chaque pièce.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="group relative overflow-hidden border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-foreground">Accessible Partout</h3>
              <p className="text-pretty text-muted-foreground">
                Visitez le musée virtuellement depuis n'importe où dans le monde, à tout moment.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-balance text-foreground md:text-4xl">
              Commencez Votre Visite Virtuelle
            </h2>
            <p className="mt-4 text-lg text-pretty text-muted-foreground">
              Explorez dès maintenant les trésors du patrimoine africain
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/galerie">
                <Button size="lg" className="gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Voir la Galerie
                </Button>
              </Link>
              <Link href="/scanner">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  <QrCode className="h-5 w-5" />
                  Scanner QR Code
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-lg font-bold text-foreground">Musée des Civilisations Noires</h3>
              <p className="mt-1 text-sm text-muted-foreground">Dakar, Sénégal</p>
            </div>
            <div className="text-center text-sm text-muted-foreground md:text-right">
              <p>Hackathon Dakar Slush'D 2025</p>
              <p className="mt-1">Propulsé par Senstartup</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
