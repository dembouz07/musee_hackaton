"use client"

import { useState } from "react"
import { QRScanner } from "@/components/qr-scanner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { QrCode } from "lucide-react"

export function ScannerClient() {
  const [showScanner, setShowScanner] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleScan = (qrCode: string) => {
    console.log("[ScannerClient] 🚀 QR scanné:", qrCode)

    setIsRedirecting(true)

    // Vérifier si c'est une URL valide
    if (qrCode.startsWith('http://') || qrCode.startsWith('https://')) {
      console.log("[ScannerClient] ✅ Redirection vers:", qrCode)
      window.location.href = qrCode
    } else if (qrCode.includes('.')) {
      // Si ça ressemble à un domaine sans protocole
      console.log("[ScannerClient] ✅ Ajout https:// et redirection")
      window.location.href = `https://${qrCode}`
    } else {
      // Traiter comme texte - peut-être une recherche Google ou votre propre logique
      console.log("[ScannerClient] 📝 Texte scanné:", qrCode)
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(qrCode)}`
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
            <h1 className="font-serif text-4xl font-bold text-balance text-foreground md:text-5xl">
              {isRedirecting ? "Redirection..." : "Scanner QR Code"}
            </h1>
            <p className="mt-4 text-lg text-pretty text-muted-foreground">
              {isRedirecting
                  ? "Ouverture du lien..."
                  : "Pointez votre caméra vers n'importe quel QR code"}
            </p>
          </div>

          {/* Scanner */}
          {showScanner && !isRedirecting && (
              <Card className="mb-6 p-6">
                <QRScanner
                    onScan={handleScan}
                    autoStart={true}
                />
              </Card>
          )}

          {/* Loading State */}
          {isRedirecting && (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Redirection en cours...</p>
              </div>
          )}
        </div>
      </div>
  )
}