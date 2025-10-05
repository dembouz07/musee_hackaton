"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Info, Move, RotateCw, ZoomIn, Globe, Maximize2, Minimize2, Volume2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { AudioPlayer } from "@/components/audio-player"
import type { Artwork, Language } from "@/lib/supabase/types"

interface Gallery3DRoomProps {
    initialArtworks: Artwork[]
}

export function Gallery3DRoom({ initialArtworks }: Gallery3DRoomProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
    const [language, setLanguage] = useState<Language>("fr")
    const [isLoading, setIsLoading] = useState(true)
    const [showControls, setShowControls] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const languages = [
        { code: "fr" as Language, label: "Français" },
        { code: "en" as Language, label: "English" },
        { code: "wo" as Language, label: "Wolof" },
    ]

    const description = selectedArtwork
        ? language === "fr"
            ? selectedArtwork.description_fr
            : language === "en"
                ? selectedArtwork.description_en
                : selectedArtwork.description_wo
        : ""

    const audioUrl = selectedArtwork
        ? language === "fr"
            ? selectedArtwork.audio_url_fr
            : language === "en"
                ? selectedArtwork.audio_url_en
                : selectedArtwork.audio_url_wo
        : null

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current || initialArtworks.length === 0) return

        // @ts-ignore
        const THREE = window.THREE
        if (!THREE) return

        const container = containerRef.current
        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(0x1a1a1a, 0.015)

        const canvas = document.createElement('canvas')
        canvas.width = 2
        canvas.height = 512
        const context = canvas.getContext('2d')
        if (context) {
            const gradient = context.createLinearGradient(0, 0, 0, 512)
            gradient.addColorStop(0, '#1a1a1a')
            gradient.addColorStop(0.5, '#2a2a2a')
            gradient.addColorStop(1, '#1a1a1a')
            context.fillStyle = gradient
            context.fillRect(0, 0, 2, 512)
            scene.background = new THREE.CanvasTexture(canvas)
        }

        const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 100)
        camera.position.set(0, 1.8, 12)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 0.8
        container.appendChild(renderer.domElement)

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4)
        scene.add(ambientLight)

        const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.2)
        mainLight.position.set(15, 20, 10)
        mainLight.castShadow = true
        mainLight.shadow.mapSize.width = 4096
        mainLight.shadow.mapSize.height = 4096
        scene.add(mainLight)

        const createMuseumLight = (x: number, z: number) => {
            const light = new THREE.SpotLight(0xFF8C42, 1.0)
            light.position.set(x, 8, z)
            light.angle = Math.PI / 5
            light.penumbra = 0.6
            light.castShadow = true
            scene.add(light)
        }

        createMuseumLight(-10, -8)
        createMuseumLight(0, -8)
        createMuseumLight(10, -8)

        const floorGeometry = new THREE.PlaneGeometry(50, 50)
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.9,
            metalness: 0.1
        })
        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -Math.PI / 2
        floor.receiveShadow = true
        scene.add(floor)

        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xF5F5F5,
            roughness: 0.95
        })

        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 12), wallMaterial)
        backWall.position.set(0, 6, -18)
        backWall.receiveShadow = true
        scene.add(backWall)

        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), wallMaterial)
        leftWall.position.set(-25, 6, 0)
        leftWall.rotation.y = Math.PI / 2
        leftWall.receiveShadow = true
        scene.add(leftWall)

        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), wallMaterial)
        rightWall.position.set(25, 6, 0)
        rightWall.rotation.y = -Math.PI / 2
        rightWall.receiveShadow = true
        scene.add(rightWall)

        const signGroup = new THREE.Group()
        const signBoard = new THREE.Mesh(
            new THREE.BoxGeometry(14, 1.8, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.7 })
        )
        signBoard.castShadow = true
        signGroup.add(signBoard)

        const border = new THREE.Mesh(
            new THREE.BoxGeometry(14.3, 2.1, 0.15),
            new THREE.MeshStandardMaterial({ color: 0xFF8C42, roughness: 0.3, metalness: 0.8 })
        )
        border.position.z = -0.05
        signGroup.add(border)

        const signCanvas = document.createElement('canvas')
        signCanvas.width = 1400
        signCanvas.height = 180
        const signCtx = signCanvas.getContext('2d')!
        signCtx.fillStyle = '#1a1a1a'
        signCtx.fillRect(0, 0, 1400, 180)
        signCtx.font = 'bold 70px serif'
        signCtx.textAlign = 'center'
        signCtx.textBaseline = 'middle'
        signCtx.fillStyle = '#FF8C42'
        signCtx.shadowColor = 'rgba(255, 140, 66, 0.8)'
        signCtx.shadowBlur = 15
        signCtx.fillText('MUSÉE DES', 700, 60)
        signCtx.fillText('CIVILISATIONS NOIRES', 700, 130)

        const textMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 1.8),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) })
        )
        textMesh.position.z = 0.11
        signGroup.add(textMesh)
        signGroup.position.set(0, 9.5, -17.8)
        scene.add(signGroup)

        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 40),
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 })
        )
        ceiling.position.set(0, 12, 0)
        ceiling.rotation.x = Math.PI / 2
        scene.add(ceiling)

        const textureLoader = new THREE.TextureLoader()
        const artworkMeshes: any[] = []

        initialArtworks.forEach((artwork, index) => {
            const frameGroup = new THREE.Group()
            const spacing = 7

            let position, rotation
            if (index < 4) {
                position = new THREE.Vector3((index - 1.5) * spacing, 4.5, -17.7)
                rotation = new THREE.Euler(0, 0, 0)
            } else if (index < 7) {
                position = new THREE.Vector3(-24.7, 4.5, (index - 5) * spacing)
                rotation = new THREE.Euler(0, Math.PI / 2, 0)
            } else {
                position = new THREE.Vector3(24.7, 4.5, (index - 8) * spacing)
                rotation = new THREE.Euler(0, -Math.PI / 2, 0)
            }

            frameGroup.position.copy(position)
            frameGroup.rotation.copy(rotation)

            const outerFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3.2, 3.2, 0.2),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5 })
            )
            outerFrame.castShadow = true
            frameGroup.add(outerFrame)

            const innerFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3.0, 3.0, 0.15),
                new THREE.MeshStandardMaterial({ color: 0xFF8C42, roughness: 0.3, metalness: 0.8 })
            )
            innerFrame.position.z = 0.025
            frameGroup.add(innerFrame)

            const canvas = new THREE.Mesh(
                new THREE.PlaneGeometry(2.6, 2.6),
                new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
            )
            canvas.position.z = 0.11

            if (artwork.image_url) {
                textureLoader.load(artwork.image_url, (texture: any) => {
                    canvas.material.map = texture
                    canvas.material.needsUpdate = true
                })
            }

            frameGroup.add(canvas)

            const label = new THREE.Mesh(
                new THREE.BoxGeometry(2.4, 0.4, 0.08),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })
            )
            label.position.set(0, -1.9, 0.12)
            frameGroup.add(label)

            const artSpotlight = new THREE.SpotLight(0xFFFFFF, 1.5)
            artSpotlight.position.set(
                position.x + Math.sin(rotation.y) * 3,
                position.y + 4,
                position.z + Math.cos(rotation.y) * 3
            )
            artSpotlight.target = canvas
            artSpotlight.angle = Math.PI / 10
            artSpotlight.penumbra = 0.8
            scene.add(artSpotlight)

            scene.add(frameGroup)
            artworkMeshes.push({ mesh: canvas, artwork })
        })

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
        let hoveredMesh: any = null

        const onMouseMove = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(artworkMeshes.map((a: any) => a.mesh))

            if (hoveredMesh && hoveredMesh !== intersects[0]?.object) {
                hoveredMesh.scale.set(1, 1, 1)
            }

            if (intersects.length > 0) {
                hoveredMesh = intersects[0].object
                hoveredMesh.scale.set(1.03, 1.03, 1)
                renderer.domElement.style.cursor = 'pointer'
            } else {
                hoveredMesh = null
                renderer.domElement.style.cursor = 'grab'
            }
        }

        const onClick = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(artworkMeshes.map((a: any) => a.mesh))

            if (intersects.length > 0) {
                const clicked = artworkMeshes.find((a: any) => a.mesh === intersects[0].object)
                if (clicked) setSelectedArtwork(clicked.artwork)
            }
        }

        renderer.domElement.addEventListener('mousemove', onMouseMove)
        renderer.domElement.addEventListener('click', onClick)

        let isDragging = false
        let previousMousePosition = { x: 0, y: 0 }
        let cameraRotation = { x: 0, y: 0 }
        let targetRotation = { x: 0, y: 0 }

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true
            previousMousePosition = { x: e.clientX, y: e.clientY }
        }

        const onMouseUp = () => {
            isDragging = false
        }

        const onMouseDrag = (e: MouseEvent) => {
            if (!isDragging) return
            targetRotation.y += (e.clientX - previousMousePosition.x) * 0.005
            targetRotation.x += (e.clientY - previousMousePosition.y) * 0.005
            targetRotation.x = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, targetRotation.x))
            previousMousePosition = { x: e.clientX, y: e.clientY }
        }

        renderer.domElement.addEventListener('mousedown', onMouseDown)
        renderer.domElement.addEventListener('mouseup', onMouseUp)
        renderer.domElement.addEventListener('mousemove', onMouseDrag)

        let zoomLevel = 12
        const minZoom = 5
        const maxZoom = 20

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const delta = e.deltaY * 0.01
            zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel + delta))
        }

        renderer.domElement.addEventListener('wheel', onWheel, { passive: false })

        const keys: Record<string, boolean> = {}
        const onKeyDown = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true }
        const onKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        const animate = () => {
            requestAnimationFrame(animate)

            cameraRotation.x += (targetRotation.x - cameraRotation.x) * 0.1
            cameraRotation.y += (targetRotation.y - cameraRotation.y) * 0.1

            camera.position.x = zoomLevel * Math.sin(cameraRotation.y)
            camera.position.z = zoomLevel * Math.cos(cameraRotation.y)
            camera.position.y = 1.8 + zoomLevel * Math.sin(cameraRotation.x) * 0.15
            camera.lookAt(0, 4, 0)

            const forward = new THREE.Vector3(Math.sin(cameraRotation.y), 0, Math.cos(cameraRotation.y))
            const right = new THREE.Vector3(Math.cos(cameraRotation.y), 0, -Math.sin(cameraRotation.y))

            if (keys['w'] || keys['arrowup']) camera.position.add(forward.multiplyScalar(0.2))
            if (keys['s'] || keys['arrowdown']) camera.position.sub(forward.multiplyScalar(0.2))
            if (keys['a'] || keys['arrowleft']) camera.position.sub(right.multiplyScalar(0.2))
            if (keys['d'] || keys['arrowright']) camera.position.add(right.multiplyScalar(0.2))

            renderer.render(scene, camera)
        }

        animate()
        setIsLoading(false)

        const handleResize = () => {
            if (!containerRef.current) return
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
            renderer.domElement.removeEventListener('mousemove', onMouseMove)
            renderer.domElement.removeEventListener('click', onClick)
            renderer.domElement.removeEventListener('mousedown', onMouseDown)
            renderer.domElement.removeEventListener('mouseup', onMouseUp)
            renderer.domElement.removeEventListener('mousemove', onMouseDrag)
            renderer.domElement.removeEventListener('wheel', onWheel)
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }
    }, [initialArtworks])

    return (
        <div className="min-h-screen bg-background">

            <div className="relative" style={{ height: 'calc(100vh - 4rem)' }}>
                <div ref={containerRef} className="h-full w-full" />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-[#1a1a1a] to-black">
                        <div className="text-center">
                            <div className="relative mx-auto mb-8 h-20 w-20">
                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-primary mb-3">Musée des Civilisations Noires</h3>
                            <p className="text-sm text-muted-foreground">Chargement...</p>
                        </div>
                    </div>
                )}

                {!isLoading && showControls && (
                    <Card className="absolute top-6 left-6 p-5 max-w-sm bg-black/90 backdrop-blur-xl border-primary/30">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-serif font-bold text-primary flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Navigation
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowControls(false)} className="h-7 w-7 p-0 text-primary hover:text-primary/80">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/10">
                                <Move className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium text-white">Déplacer</p>
                                    <p className="text-xs text-muted-foreground">WASD ou Flèches</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/10">
                                <RotateCw className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium text-white">Regarder</p>
                                    <p className="text-xs text-muted-foreground">Glisser la souris</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/10">
                                <ZoomIn className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium text-white">Zoom</p>
                                    <p className="text-xs text-muted-foreground">Molette de la souris</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {!showControls && (
                    <Button variant="outline" size="sm" onClick={() => setShowControls(true)} className="absolute top-6 left-6 bg-black/90 border-primary/30 text-primary hover:bg-black/80">
                        <Info className="h-4 w-4 mr-2" />
                        Aide
                    </Button>
                )}

                <div className="absolute top-6 right-6 flex flex-col gap-3">
                    <Card className="px-5 py-3 bg-white backdrop-blur-xl border-primary/30">
                        <p className="text-sm font-bold text-primary">{initialArtworks.length} œuvres</p>
                    </Card>
                    <Button variant="outline" size="sm" onClick={toggleFullscreen} className="bg-black/90 border-primary/30 text-primary hover:bg-black/80">
                        {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
                        {isFullscreen ? 'Quitter' : 'Plein écran'}
                    </Button>
                </div>

                {selectedArtwork && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md p-4 z-50">
                        <Card className="max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#1a1a1a] to-white border-primary/30 shadow-2xl">
                            <div className="relative">
                                <div className="w-full h-64 bg-gradient-to-b from-white/50 to-transparent flex items-center justify-center p-4">
                                    <img
                                        src={selectedArtwork.image_url || "/placeholder.svg"}
                                        alt={selectedArtwork.title}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedArtwork(null)} className="absolute top-2 right-2 bg-black/80 hover:bg-black text-primary border border-primary/30">
                                    <X className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-3 left-4 right-4">
                                    <Badge className="mb-2 bg-primary text-black font-semibold">{selectedArtwork.category?.name_fr}</Badge>
                                    <h2 className="font-serif text-2xl font-bold text-primary mb-1">{selectedArtwork.title}</h2>
                                    <p className="text-base text-white/90">{selectedArtwork.artist}</p>
                                </div>
                            </div>

                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                                        <p className="text-xs font-semibold text-primary mb-1">ORIGINE</p>
                                        <p className="text-sm font-bold text-white">{selectedArtwork.origin}</p>
                                    </div>
                                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                                        <p className="text-xs font-semibold text-primary mb-1">PÉRIODE</p>
                                        <p className="text-sm font-bold text-white">{selectedArtwork.year || "Date inconnue"}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-semibold text-primary">LANGUE</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {languages.map((lang) => (
                                            <Button
                                                key={lang.code}
                                                size="sm"
                                                variant={language === lang.code ? "default" : "outline"}
                                                onClick={() => setLanguage(lang.code)}
                                                className={language === lang.code ? "bg-primary text-black hover:bg-primary/90 h-8 text-xs" : "border-primary/30 text-primary bg-transparent hover:bg-primary/10 h-8 text-xs"}
                                            >
                                                {lang.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {audioUrl && (
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <Volume2 className="h-4 w-4 text-primary" />
                                            <span className="text-xs font-semibold text-primary">GUIDE AUDIO</span>
                                        </div>
                                        <AudioPlayer audioUrl={audioUrl} title={`${selectedArtwork.title} - Description`} />
                                    </div>
                                )}

                                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                                    <h3 className="font-serif font-bold text-primary mb-2 text-sm">Description</h3>
                                    <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
                                </div>

                                <Button onClick={() => setSelectedArtwork(null)} className="w-full bg-primary hover:bg-primary/90 text-black font-semibold h-10" size="sm">
                                    Continuer la visite
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" />
        </div>
    )
}