"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { QRScanner } from "@/components/qr-scanner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { QrCode, Keyboard } from "lucide-react"

interface QuickAccessArtwork {
  id: string
  title: string
  qr_code: string
}

interface ScannerClientProps {
  quickAccessArtworks: QuickAccessArtwork[]
}

export function ScannerClient({ quickAccessArtworks }: ScannerClientProps) {
  const router = useRouter()
  const [manualCode, setManualCode] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (qrCode: string) => {
    console.log("[v0] Scanned QR code:", qrCode)

    try {
      const response = await fetch(`/api/artworks/by-qr?code=${encodeURIComponent(qrCode)}`)
      const data = await response.json()

      if (data.artwork) {
        router.push(`/oeuvre/${data.artwork.id}`)
      } else {
        setError(`Code QR "${qrCode}" non reconnu. Veuillez réessayer.`)
      }
    } catch (err) {
      setError("Erreur lors de la recherche de l'œuvre.")
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      handleScan(manualCode.trim())
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-balance text-foreground md:text-5xl">Scanner une Œuvre</h1>
          <p className="mt-4 text-lg text-pretty text-muted-foreground">
            Scannez le QR code sur l'œuvre pour découvrir son histoire et écouter sa description audio
          </p>
        </div>

        {/* Scanner */}
        <Card className="mb-6 p-6">
          <QRScanner onScan={handleScan} onError={(err) => setError(err)} />
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Manual Input Toggle */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setShowManualInput(!showManualInput)}
            className="gap-2 text-muted-foreground"
          >
            <Keyboard className="h-4 w-4" />
            {showManualInput ? "Masquer la saisie manuelle" : "Saisir le code manuellement"}
          </Button>
        </div>

        {/* Manual Input */}
        {showManualInput && (
          <Card className="mt-6 p-6">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label htmlFor="manual-code" className="mb-2 block text-sm font-medium text-foreground">
                  Code de l'œuvre
                </label>
                <Input
                  id="manual-code"
                  type="text"
                  placeholder="Ex: MCN-001"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="text-center text-lg font-mono uppercase"
                />
              </div>
              <Button type="submit" className="w-full">
                Rechercher l'œuvre
              </Button>
            </form>
          </Card>
        )}

        {/* Quick Access */}
        {quickAccessArtworks.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-center font-serif text-xl font-bold text-foreground">Accès Rapide</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickAccessArtworks.map((artwork) => (
                <Button
                  key={artwork.id}
                  variant="outline"
                  onClick={() => router.push(`/oeuvre/${artwork.id}`)}
                  className="h-auto flex-col gap-1 bg-transparent p-4 text-left"
                >
                  <span className="font-mono text-xs text-muted-foreground">{artwork.qr_code}</span>
                  <span className="font-serif text-sm font-medium text-foreground">{artwork.title}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
