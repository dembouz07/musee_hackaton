"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, AlertCircle, SwitchCamera } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([])
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0)
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const scannerDivId = "qr-reader"

  useEffect(() => {
    // Get available cameras
    Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            setCameras(devices.map((d) => ({ id: d.id, label: d.label })))
          }
        })
        .catch((err) => {
          console.error("Error getting cameras:", err)
        })

    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerDivId)
      }

      const cameraId = cameras.length > 0 ? cameras[currentCameraIndex].id : undefined

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      }

      await html5QrCodeRef.current.start(
          cameraId || { facingMode: facingMode },
          config,
          (decodedText) => {
            console.log("QR Code detected:", decodedText)
            onScan(decodedText)
            stopCamera()
          },
          (errorMessage) => {
            // Ignore continuous scan errors
          }
      )

      setIsScanning(true)
      setHasPermission(true)
    } catch (err: any) {
      console.error("Camera error:", err)
      setHasPermission(false)
      setError("Impossible d'accéder à la caméra. Veuillez autoriser l'accès à la caméra.")
      onError?.("Camera access denied")
    }
  }

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop()
        setIsScanning(false)
      } catch (err) {
        console.error("Error stopping camera:", err)
      }
    }
  }

  const switchCamera = async () => {
    if (cameras.length <= 1) return

    await stopCamera()
    setCurrentCameraIndex((prev) => (prev + 1) % cameras.length)
    setTimeout(() => startCamera(), 100)
  }

  return (
      <div className="flex flex-col gap-4">
        <div className="relative w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
          <div id={scannerDivId} className="w-full" />

          {!isScanning && (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
                <Camera className="h-16 w-16 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {hasPermission === false
                      ? "Accès à la caméra refusé"
                      : "Cliquez sur le bouton pour démarrer le scanner"}
                </p>
              </div>
          )}

          {isScanning && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
                Positionnez le QR code dans le cadre
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
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  Arrêter
                </Button>
                {cameras.length > 1 && (
                    <Button onClick={switchCamera} variant="outline" size="icon">
                      <SwitchCamera className="h-5 w-5" />
                    </Button>
                )}
              </>
          )}
        </div>
      </div>
  )
}