"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, AlertCircle, SwitchCamera } from "lucide-react"
import jsQR from "jsqr"

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
  autoStart?: boolean
}

export function QRScanner({ onScan, onError, autoStart = false }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<"initial" | "streaming" | "photo">("initial")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const startStreamingCamera = async () => {
    console.log("[Scanner] 🎬 Démarrage caméra, facingMode:", facingMode)

    // Vérification critique : le videoRef doit être disponible
    if (!videoRef.current) {
      console.error("[Scanner] ❌ videoRef.current est null!")
      return
    }

    try {
      setError(null)
      console.log("[Scanner] Mode streaming actif")

      if (streamRef.current) {
        console.log("[Scanner] Arrêt du stream existant")
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      let stream: MediaStream

      try {
        console.log("[Scanner] Tentative 1: facingMode exact")
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false,
        })
        console.log("[Scanner] ✅ Succès avec facingMode exact")
      } catch (err) {
        console.log("[Scanner] ❌ Échec facingMode exact:", err)
        try {
          console.log("[Scanner] Tentative 2: facingMode sans exact")
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false,
          })
          console.log("[Scanner] ✅ Succès sans exact")
        } catch (err2) {
          console.log("[Scanner] ❌ Échec sans exact:", err2)
          console.log("[Scanner] Tentative 3: caméra par défaut")
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false,
          })
          console.log("[Scanner] ✅ Succès caméra par défaut")
        }
      }

      streamRef.current = stream
      setHasPermission(true)
      console.log("[Scanner] Stream obtenu, configuration vidéo...")

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        console.log("[Scanner] ✅ Vidéo en lecture")
        setIsScanning(true)
        startScanning()
        console.log("[Scanner] ✅ Scan démarré")
      }
    } catch (err) {
      console.error("[Scanner] ❌ ERREUR FINALE:", err)
      setHasPermission(false)
      const errorMsg = err instanceof Error ? err.message : "Erreur inconnue"
      setError(`Impossible d'accéder à la caméra: ${errorMsg}`)
      onError?.("Camera access denied")
      setMode("initial")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsScanning(false)
    setMode("initial")
  }

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    if (isScanning) {
      stopCamera()
      setTimeout(() => {
        setMode("streaming")
      }, 100)
    }
  }

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    scanIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = detectQRCode(imageData)

        if (code) {
          onScan(code)
          stopCamera()
        }
      }
    }, 300)
  }

  const detectQRCode = (imageData: ImageData): string | null => {
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code && code.data) {
        return code.data
      }
      return null
    } catch (err) {
      console.error("[Scanner] Erreur détection QR:", err)
      return null
    }
  }

  const triggerPhotoCapture = () => {
    setMode("photo")
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log("[Scanner] 📸 Fichier sélectionné:", file?.name, file?.size, "bytes")
    if (!file) {
      console.log("[Scanner] Aucun fichier sélectionné")
      setMode("initial")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      console.log("[Scanner] Chargement de l'image...")
      const image = await loadImage(file)
      console.log("[Scanner] Image chargée:", image.width, "x", image.height)

      console.log("[Scanner] Recherche du QR code...")
      const qrCode = scanImageForQR(image)
      console.log("[Scanner] Résultat scan:", qrCode)

      if (qrCode) {
        console.log("[Scanner] ✅ QR code trouvé:", qrCode)
        onScan(qrCode)
      } else {
        console.log("[Scanner] ❌ Aucun QR code trouvé")
        setError("Aucun QR code détecté sur la photo. Réessayez avec une image plus nette.")
        onError?.("No QR code found")
        setMode("initial")
      }
    } catch (err) {
      console.error("[Scanner] ❌ Erreur:", err)
      setError("Erreur lors de la lecture de l'image.")
      onError?.("Error reading image")
      setMode("initial")
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const scanImageForQR = (image: HTMLImageElement): string | null => {
    console.log("[Scanner] Début scanImageForQR")
    if (!canvasRef.current) {
      console.error("[Scanner] Canvas non disponible")
      return null
    }

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) {
      console.error("[Scanner] Contexte 2D non disponible")
      return null
    }

    canvas.width = image.width
    canvas.height = image.height
    console.log("[Scanner] Canvas configuré:", canvas.width, "x", canvas.height)
    context.drawImage(image, 0, 0)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    console.log("[Scanner] ImageData obtenu:", imageData.data.length, "bytes")

    try {
      console.log("[Scanner] Tentative de détection QR avec jsQR...")
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      console.log("[Scanner] Résultat jsQR:", code)

      if (code?.data) {
        console.log("[Scanner] ✅ QR code détecté:", code.data)
        return code.data
      }

      console.log("[Scanner] Aucun QR code trouvé, tentative avec inversion...")
      const codeWithInversion = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      })

      if (codeWithInversion?.data) {
        console.log("[Scanner] ✅ QR code détecté avec inversion:", codeWithInversion.data)
        return codeWithInversion.data
      }

      console.log("[Scanner] ❌ Aucun QR code détecté même avec inversion")
      return null
    } catch (err) {
      console.error("[Scanner] ❌ Erreur jsQR:", err)
      return null
    }
  }

  // FIX: Utiliser un effet qui se déclenche quand le mode ET le videoRef sont prêts
  useEffect(() => {
    if (mode === "streaming" && videoRef.current && !isScanning) {
      console.log("[Scanner] Mode streaming + video ready, démarrage caméra...")
      startStreamingCamera()
    }
  }, [mode, facingMode])

  useEffect(() => {
    if (autoStart && mode === "initial") {
      const timer = setTimeout(() => {
        setMode("streaming")
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [autoStart])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
          {mode === "streaming" ? (
              <>
                <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                {isScanning && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-48 w-48 rounded-lg border-4 border-primary shadow-lg animate-pulse" />
                      </div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-xs text-white backdrop-blur">
                        {facingMode === "environment" ? "📷 Caméra arrière" : "🤳 Caméra avant"}
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur">
                        Positionnez le QR code dans le cadre
                      </div>
                    </>
                )}
              </>
          ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <Camera className="h-16 w-16 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isProcessing
                      ? "Analyse du QR code en cours..."
                      : hasPermission === false
                          ? "Accès à la caméra refusé"
                          : "Choisissez un mode de scan"}
                </p>
              </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
        />

        {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {mode === "initial" && (
            <div className="flex flex-col gap-2">
              <Button
                  onClick={triggerPhotoCapture}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full gap-2"
              >
                <Camera className="h-5 w-5" />
                📷 Prendre une photo (Recommandé)
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={() => {
                      setFacingMode("environment")
                      setMode("streaming")
                    }}
                    variant="outline"
                    className="gap-2 bg-transparent"
                >
                  <Camera className="h-4 w-4" />
                  Caméra arrière
                </Button>
                <Button
                    onClick={() => {
                      setFacingMode("user")
                      setMode("streaming")
                    }}
                    variant="outline"
                    className="gap-2 bg-transparent"
                >
                  <SwitchCamera className="h-4 w-4" />
                  Caméra avant
                </Button>
              </div>
            </div>
        )}

        {mode === "streaming" && isScanning && (
            <div className="flex gap-2">
              <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                ✕ Arrêter
              </Button>
              <Button
                  onClick={switchCamera}
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
              >
                <SwitchCamera className="h-5 w-5" />
                Changer
              </Button>
            </div>
        )}
      </div>
  )
}