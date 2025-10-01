"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, AlertCircle, SwitchCamera } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCamera = async () => {
    try {
      setError(null)

      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false,
      })

      streamRef.current = stream
      setHasPermission(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)
        startScanning()
      }
    } catch (err) {
      console.error("[v0] Camera error:", err)
      setHasPermission(false)
      setError("Impossible d'accéder à la caméra. Veuillez autoriser l'accès à la caméra.")
      onError?.("Camera access denied")
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
  }

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    if (isScanning) {
      stopCamera()
      setTimeout(() => startCamera(), 100)
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
          console.log("[v0] QR Code detected:", code)
          onScan(code)
          stopCamera()
        }
      }
    }, 300)
  }

  // Simple QR code detection (placeholder - in production use a proper library)
  const detectQRCode = (imageData: ImageData): string | null => {
    // This is a simplified version. In production, you'd use a library like jsQR
    // For now, we'll simulate detection for demo purposes
    return null
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
        {isScanning ? (
          <>
            <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-lg border-4 border-primary shadow-lg" />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
              Positionnez le QR code dans le cadre
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <Camera className="h-16 w-16 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {hasPermission === false ? "Accès à la caméra refusé" : "Cliquez sur le bouton pour démarrer le scanner"}
            </p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {!isScanning ? (
          <Button onClick={startCamera} className="flex-1 gap-2">
            <Camera className="h-5 w-5" />
            Démarrer le scanner
          </Button>
        ) : (
          <>
            <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
              Arrêter
            </Button>
            <Button onClick={switchCamera} variant="outline" size="icon" className="bg-transparent">
              <SwitchCamera className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
