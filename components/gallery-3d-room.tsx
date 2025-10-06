"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Info, Move, RotateCw, ZoomIn, Globe, Maximize2, Minimize2, Volume2, ArrowUp, ArrowDown } from "lucide-react"

// Types
interface Artwork {
    id: string
    title: string
    artist: string
    image_url: string
    description_fr: string
    description_en: string
    description_wo: string
    audio_url_fr?: string
    audio_url_en?: string
    audio_url_wo?: string
    origin: string
    year?: string
    category?: { name_fr: string }
}

type Language = "fr" | "en" | "wo"

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
    const [currentFloor, setCurrentFloor] = useState(1)

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
        scene.fog = new THREE.FogExp2(0x1a1a1a, 0.008)

        // Background gradient
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
        camera.position.set(0, 2, 20)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 0.8
        container.appendChild(renderer.domElement)

        // Lumières principales
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6)
        scene.add(ambientLight)

        const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.2)
        mainLight.position.set(0, 30, 0)
        mainLight.castShadow = true
        mainLight.shadow.mapSize.width = 4096
        mainLight.shadow.mapSize.height = 4096
        scene.add(mainLight)

        // ARCHITECTURE - RDC (Rez-de-chaussée)
        // Sol RDC
        const floorGeometry = new THREE.PlaneGeometry(70, 70)
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4a574,
            roughness: 0.8,
            metalness: 0.1
        })
        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -Math.PI / 2
        floor.receiveShadow = true
        scene.add(floor)

        // Motif radial au sol (inspiré de l'image)
        const radialLines = 16
        for (let i = 0; i < radialLines; i++) {
            const angle = (i / radialLines) * Math.PI * 2
            const lineGeometry = new THREE.PlaneGeometry(35, 0.3)
            const lineMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
            const line = new THREE.Mesh(lineGeometry, lineMaterial)
            line.rotation.x = -Math.PI / 2
            line.rotation.z = angle
            line.position.y = 0.01
            scene.add(line)
        }

        // Cercles concentriques
        for (let radius of [8, 15, 25]) {
            const circleGeometry = new THREE.RingGeometry(radius - 0.15, radius + 0.15, 64)
            const circleMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
            const circle = new THREE.Mesh(circleGeometry, circleMaterial)
            circle.rotation.x = -Math.PI / 2
            circle.position.y = 0.01
            scene.add(circle)
        }

        // Murs RDC
        const wallHeight = 10
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xc19a6b,
            roughness: 0.9,
            metalness: 0.05
        })

        // Mur arrière
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(70, wallHeight),
            wallMaterial
        )
        backWall.position.set(0, wallHeight / 2, -35)
        scene.add(backWall)

        // Mur avant (avec ouverture)
        const frontWallLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(25, wallHeight),
            wallMaterial
        )
        frontWallLeft.position.set(-22.5, wallHeight / 2, 35)
        frontWallLeft.rotation.y = Math.PI
        scene.add(frontWallLeft)

        const frontWallRight = new THREE.Mesh(
            new THREE.PlaneGeometry(25, wallHeight),
            wallMaterial
        )
        frontWallRight.position.set(22.5, wallHeight / 2, 35)
        frontWallRight.rotation.y = Math.PI
        scene.add(frontWallRight)

        // Murs latéraux
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(70, wallHeight),
            wallMaterial
        )
        leftWall.position.set(-35, wallHeight / 2, 0)
        leftWall.rotation.y = Math.PI / 2
        scene.add(leftWall)

        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(70, wallHeight),
            wallMaterial
        )
        rightWall.position.set(35, wallHeight / 2, 0)
        rightWall.rotation.y = -Math.PI / 2
        scene.add(rightWall)

        // PLAFOND RDC avec motifs géométriques
        const ceilingMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.9,
            metalness: 0.1
        })
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(70, 70),
            ceilingMaterial
        )
        ceiling.position.set(0, wallHeight, 0)
        ceiling.rotation.x = Math.PI / 2
        scene.add(ceiling)

        // Motifs géométriques au plafond (inspiré du design du musée)
        const ceilingPatternMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6f47,
            roughness: 0.7
        })
        for (let i = -3; i <= 3; i++) {
            for (let j = -3; j <= 3; j++) {
                const pattern = new THREE.Mesh(
                    new THREE.BoxGeometry(3, 0.2, 3),
                    ceilingPatternMaterial
                )
                pattern.position.set(i * 8, wallHeight - 0.1, j * 8)
                scene.add(pattern)
            }
        }

        // ARBRE CENTRAL (sculpture inspirée des images)
        const textureLoader = new THREE.TextureLoader()
        textureLoader.crossOrigin = 'anonymous'

        const treeGroup = new THREE.Group()

        // Tronc principal
        const trunkGeometry = new THREE.CylinderGeometry(0.8, 1.2, 8, 8)
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.9,
            metalness: 0.1
        })
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
        trunk.position.y = 4
        treeGroup.add(trunk)

        // Branches métalliques (style sculpture)
        const branchMaterial = new THREE.MeshStandardMaterial({
            color: 0xa0826d,
            roughness: 0.4,
            metalness: 0.6
        })

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2
            const branchLength = 3 + Math.random() * 2
            const branchGeometry = new THREE.CylinderGeometry(0.1, 0.05, branchLength, 6)
            const branch = new THREE.Mesh(branchGeometry, branchMaterial)

            branch.position.set(
                Math.cos(angle) * 1,
                6 + Math.random() * 2,
                Math.sin(angle) * 1
            )
            branch.rotation.z = Math.PI / 6 + Math.random() * 0.3
            branch.rotation.y = angle

            treeGroup.add(branch)

            // Sous-branches
            for (let j = 0; j < 3; j++) {
                const subBranchGeometry = new THREE.CylinderGeometry(0.05, 0.02, 1 + Math.random(), 4)
                const subBranch = new THREE.Mesh(subBranchGeometry, branchMaterial)
                subBranch.position.set(
                    Math.cos(angle) * (1.5 + j * 0.5),
                    7 + j * 0.5,
                    Math.sin(angle) * (1.5 + j * 0.5)
                )
                subBranch.rotation.z = Math.PI / 4
                subBranch.rotation.y = angle + Math.random() * 0.5
                treeGroup.add(subBranch)
            }
        }

        // Feuillage (particules dorées)
        const foliageGeometry = new THREE.SphereGeometry(0.1, 4, 4)
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            emissive: 0xFFAA00,
            emissiveIntensity: 0.3
        })

        for (let i = 0; i < 50; i++) {
            const leaf = new THREE.Mesh(foliageGeometry, foliageMaterial)
            const angle = Math.random() * Math.PI * 2
            const radius = 2 + Math.random() * 2
            leaf.position.set(
                Math.cos(angle) * radius,
                7 + Math.random() * 3,
                Math.sin(angle) * radius
            )
            treeGroup.add(leaf)
        }

        treeGroup.position.set(0, 0, 0)
        scene.add(treeGroup)

        // Lumière pour l'arbre
        const treeLight = new THREE.PointLight(0xFFDD99, 2.5, 15)
        treeLight.position.set(0, 10, 0)
        treeLight.castShadow = true
        scene.add(treeLight)

        // ESCALIER vers l'étage
        const stairMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6f47,
            roughness: 0.8
        })
        const stairGroup = new THREE.Group()

        const numSteps = 15
        const stepWidth = 4
        const stepDepth = 0.8
        const stepHeight = wallHeight / numSteps

        for (let i = 0; i < numSteps; i++) {
            const step = new THREE.Mesh(
                new THREE.BoxGeometry(stepWidth, stepHeight * 0.8, stepDepth),
                stairMaterial
            )
            step.position.set(25, i * stepHeight + stepHeight / 2, -30 + i * stepDepth)
            step.castShadow = true
            step.receiveShadow = true
            stairGroup.add(step)

            // Rampe
            const railing = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 1, stepDepth),
                new THREE.MeshStandardMaterial({ color: 0x654321 })
            )
            railing.position.set(25 + stepWidth/2, i * stepHeight + 1, -30 + i * stepDepth)
            stairGroup.add(railing)
        }
        scene.add(stairGroup)

        // SOL ÉTAGE 1
        const floor1 = new THREE.Mesh(
            new THREE.PlaneGeometry(70, 70),
            new THREE.MeshStandardMaterial({
                color: 0xc19a6b,
                roughness: 0.8,
                transparent: true,
                opacity: 0.95
            })
        )
        floor1.rotation.x = -Math.PI / 2
        floor1.position.y = wallHeight
        floor1.receiveShadow = true
        scene.add(floor1)

        // Ouverture centrale à l'étage pour voir l'arbre
        const holeSize = 12
        const floorParts = []

        // 4 sections de plancher autour de l'ouverture
        const sections = [
            { x: -29, z: -29, w: 40, h: 40 }, // Arrière gauche
            { x: 29, z: -29, w: 40, h: 40 },  // Arrière droite
            { x: -29, z: 29, w: 40, h: 40 },  // Avant gauche
            { x: 29, z: 29, w: 40, h: 40 }    // Avant droite
        ]

        sections.forEach(section => {
            const floorPart = new THREE.Mesh(
                new THREE.PlaneGeometry(section.w, section.h),
                new THREE.MeshStandardMaterial({
                    color: 0xc19a6b,
                    roughness: 0.8
                })
            )
            floorPart.rotation.x = -Math.PI / 2
            floorPart.position.set(section.x, wallHeight, section.z)
            floorPart.receiveShadow = true
            scene.add(floorPart)
        })

        // Garde-corps autour de l'ouverture
        const railingMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6f47,
            roughness: 0.6,
            metalness: 0.3
        })

        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2
            const railing = new THREE.Mesh(
                new THREE.BoxGeometry(holeSize * 1.5, 1.2, 0.1),
                railingMaterial
            )
            railing.position.set(
                Math.cos(angle + Math.PI/4) * (holeSize/2),
                wallHeight + 0.6,
                Math.sin(angle + Math.PI/4) * (holeSize/2)
            )
            railing.rotation.y = angle + Math.PI/4
            scene.add(railing)
        }

        // MURS ÉTAGE 1
        const wall1Height = 6

        const backWall1 = new THREE.Mesh(
            new THREE.PlaneGeometry(70, wall1Height),
            wallMaterial
        )
        backWall1.position.set(0, wallHeight + wall1Height / 2, -35)
        scene.add(backWall1)

        const frontWall1 = new THREE.Mesh(
            new THREE.PlaneGeometry(70, wall1Height),
            wallMaterial
        )
        frontWall1.position.set(0, wallHeight + wall1Height / 2, 35)
        frontWall1.rotation.y = Math.PI
        scene.add(frontWall1)

        const leftWall1 = new THREE.Mesh(
            new THREE.PlaneGeometry(70, wall1Height),
            wallMaterial
        )
        leftWall1.position.set(-35, wallHeight + wall1Height / 2, 0)
        leftWall1.rotation.y = Math.PI / 2
        scene.add(leftWall1)

        const rightWall1 = new THREE.Mesh(
            new THREE.PlaneGeometry(70, wall1Height),
            wallMaterial
        )
        rightWall1.position.set(35, wallHeight + wall1Height / 2, 0)
        rightWall1.rotation.y = -Math.PI / 2
        scene.add(rightWall1)

        // PLAFOND ÉTAGE 1
        const ceiling1 = new THREE.Mesh(
            new THREE.PlaneGeometry(70, 70),
            ceilingMaterial
        )
        ceiling1.position.set(0, wallHeight + wall1Height, 0)
        ceiling1.rotation.x = Math.PI / 2
        scene.add(ceiling1)

        // DISPOSITION DES ŒUVRES
        const artworkMeshes: any[] = []

        // RDC - TOUTES les œuvres en cercle autour de l'arbre
        const rdcRadius = 18
        initialArtworks.forEach((artwork, index) => {
            const frameGroup = new THREE.Group()
            const angle = (index / initialArtworks.length) * Math.PI * 2

            frameGroup.position.set(
                Math.sin(angle) * rdcRadius,
                5,
                Math.cos(angle) * rdcRadius
            )
            frameGroup.rotation.y = -angle

            // Cadre extérieur
            const outerFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3.2, 3.2, 0.2),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5 })
            )
            outerFrame.castShadow = true
            frameGroup.add(outerFrame)

            // Cadre intérieur doré
            const innerFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3.0, 3.0, 0.15),
                new THREE.MeshStandardMaterial({ color: 0xFF8C42, roughness: 0.3, metalness: 0.8 })
            )
            innerFrame.position.z = 0.025
            frameGroup.add(innerFrame)

            // Canvas avec image
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

            // Plaque titre
            const label = new THREE.Mesh(
                new THREE.BoxGeometry(2.4, 0.4, 0.08),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })
            )
            label.position.set(0, -1.9, 0.12)
            frameGroup.add(label)

            // Éclairage spot
            const artSpotlight = new THREE.SpotLight(0xFFFFFF, 1.8)
            artSpotlight.position.copy(frameGroup.position)
            artSpotlight.position.y += 4
            artSpotlight.target = canvas
            artSpotlight.angle = Math.PI / 10
            artSpotlight.penumbra = 0.8
            scene.add(artSpotlight)

            scene.add(frameGroup)
            artworkMeshes.push({ mesh: canvas, artwork, floor: 1 })
        })

        // ÉTAGE 1 - TOUTES les œuvres le long des murs
        const wallPositions = [
            { x: 0, z: -32, ry: 0 },      // Mur arrière
            { x: -32, z: 0, ry: Math.PI/2 }, // Mur gauche
            { x: 32, z: 0, ry: -Math.PI/2 },  // Mur droit
        ]

        initialArtworks.forEach((artwork, index) => {
            const wallIndex = index % wallPositions.length
            const posOnWall = Math.floor(index / wallPositions.length)
            const spacing = 8
            const offset = (posOnWall - Math.floor(initialArtworks.length / wallPositions.length / 2)) * spacing

            const frameGroup = new THREE.Group()
            const wallPos = wallPositions[wallIndex]

            if (wallIndex === 0) { // Mur arrière
                frameGroup.position.set(offset, wallHeight + 3, wallPos.z)
            } else { // Murs latéraux
                frameGroup.position.set(wallPos.x, wallHeight + 3, offset)
            }
            frameGroup.rotation.y = wallPos.ry

            // Cadre extérieur
            const outerFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3.2, 3.2, 0.2),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5 })
            )
            outerFrame.castShadow = true
            frameGroup.add(outerFrame)

            // Cadre intérieur doré
            const innerFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3.0, 3.0, 0.15),
                new THREE.MeshStandardMaterial({ color: 0xFF8C42, roughness: 0.3, metalness: 0.8 })
            )
            innerFrame.position.z = 0.025
            frameGroup.add(innerFrame)

            // Canvas
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

            // Plaque
            const label = new THREE.Mesh(
                new THREE.BoxGeometry(2.4, 0.4, 0.08),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })
            )
            label.position.set(0, -1.9, 0.12)
            frameGroup.add(label)

            // Éclairage
            const artSpotlight = new THREE.SpotLight(0xFFFFFF, 1.8)
            artSpotlight.position.copy(frameGroup.position)
            artSpotlight.position.y += 3
            artSpotlight.target = canvas
            artSpotlight.angle = Math.PI / 10
            artSpotlight.penumbra = 0.8
            scene.add(artSpotlight)

            scene.add(frameGroup)
            artworkMeshes.push({ mesh: canvas, artwork, floor: 2 })
        })

        // INTERACTIONS
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
                if (clicked) {
                    setSelectedArtwork(clicked.artwork)
                    setCurrentFloor(clicked.floor)
                }
            }
        }

        renderer.domElement.addEventListener('mousemove', onMouseMove)
        renderer.domElement.addEventListener('click', onClick)

        // CONTRÔLES CAMÉRA
        let isDragging = false
        let previousMousePosition = { x: 0, y: 0 }
        let cameraRotation = { x: 0, y: 0 }
        let targetRotation = { x: 0, y: 0 }
        let cameraHeight = 2

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

        // CONTRÔLES TACTILES
        let touchStartX = 0
        let touchStartY = 0
        let initialPinchDistance = 0

        const getTouchDistance = (touch1: Touch, touch2: Touch) => {
            const dx = touch2.clientX - touch1.clientX
            const dy = touch2.clientY - touch1.clientY
            return Math.sqrt(dx * dx + dy * dy)
        }

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                isDragging = true
                touchStartX = e.touches[0].clientX
                touchStartY = e.touches[0].clientY
                previousMousePosition = { x: touchStartX, y: touchStartY }
            } else if (e.touches.length === 2) {
                isDragging = false
                initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1])
            }
        }

        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault()

            if (e.touches.length === 1 && isDragging) {
                const touch = e.touches[0]
                targetRotation.y += (touch.clientX - previousMousePosition.x) * 0.005
                targetRotation.x += (touch.clientY - previousMousePosition.y) * 0.005
                targetRotation.x = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, targetRotation.x))
                previousMousePosition = { x: touch.clientX, y: touch.clientY }
            } else if (e.touches.length === 2) {
                const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
                const delta = (initialPinchDistance - currentDistance) * 0.02
                zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel + delta))
                initialPinchDistance = currentDistance
            }
        }

        const onTouchEnd = () => {
            isDragging = false
        }

        renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false })
        renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false })
        renderer.domElement.addEventListener('touchend', onTouchEnd)

        // ZOOM
        let zoomLevel = 20
        const minZoom = 8
        const maxZoom = 35

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const delta = e.deltaY * 0.01
            zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel + delta))
        }

        renderer.domElement.addEventListener('wheel', onWheel, { passive: false })

        // CONTRÔLES CLAVIER
        const keys: Record<string, boolean> = {}
        const onKeyDown = (e: KeyboardEvent) => {
            keys[e.key.toLowerCase()] = true

            // Changer d'étage avec PageUp/PageDown
            if (e.key === 'PageUp' && cameraHeight < wallHeight + 2) {
                cameraHeight = wallHeight + 2
                setCurrentFloor(2)
            } else if (e.key === 'PageDown' && cameraHeight > 2) {
                cameraHeight = 2
                setCurrentFloor(1)
            }
        }
        const onKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        // ANIMATION
        const animate = () => {
            requestAnimationFrame(animate)

            cameraRotation.x += (targetRotation.x - cameraRotation.x) * 0.1
            cameraRotation.y += (targetRotation.y - cameraRotation.y) * 0.1

            camera.position.x = zoomLevel * Math.sin(cameraRotation.y)
            camera.position.z = zoomLevel * Math.cos(cameraRotation.y)
            camera.position.y = cameraHeight + zoomLevel * Math.sin(cameraRotation.x) * 0.15
            camera.lookAt(0, cameraHeight - 0.5, 0)

            const forward = new THREE.Vector3(Math.sin(cameraRotation.y), 0, Math.cos(cameraRotation.y))
            const right = new THREE.Vector3(Math.cos(cameraRotation.y), 0, -Math.sin(cameraRotation.y))

            const moveSpeed = 0.3

            if (keys['z'] || keys['w'] || keys['arrowup']) camera.position.add(forward.multiplyScalar(moveSpeed))
            if (keys['s'] || keys['arrowdown']) camera.position.sub(forward.multiplyScalar(moveSpeed))
            if (keys['q'] || keys['a'] || keys['arrowleft']) camera.position.sub(right.multiplyScalar(moveSpeed))
            if (keys['d'] || keys['arrowright']) camera.position.add(right.multiplyScalar(moveSpeed))

            // Limites de mouvement
            camera.position.x = Math.max(-30, Math.min(30, camera.position.x))
            camera.position.z = Math.max(-30, Math.min(30, camera.position.z))

            // Animation de l'arbre (légère rotation)
            treeGroup.rotation.y += 0.001

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
            renderer.domElement.removeEventListener('touchstart', onTouchStart)
            renderer.domElement.removeEventListener('touchmove', onTouchMove)
            renderer.domElement.removeEventListener('touchend', onTouchEnd)
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }
    }, [initialArtworks])

    const changeFloor = (floor: number) => {
        setCurrentFloor(floor)
        // Déclencher un événement clavier pour changer la hauteur de la caméra
        const event = new KeyboardEvent('keydown', {
            key: floor === 2 ? 'PageUp' : 'PageDown'
        })
        window.dispatchEvent(event)
    }

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
                            <p className="text-sm text-muted-foreground">Chargement de la galerie 3D...</p>
                        </div>
                    </div>
                )}

                {!isLoading && showControls && (
                    <Card className="absolute top-6 left-6 p-4 max-w-xs bg-black/90 backdrop-blur-xl border-primary/30 sm:max-w-sm">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-serif font-bold text-primary flex items-center gap-2 text-sm sm:text-base">
                                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                                Navigation
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowControls(false)} className="h-6 w-6 p-0 text-primary hover:text-primary/80 sm:h-7 sm:w-7">
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 sm:gap-3">
                                <Move className="h-4 w-4 text-primary sm:h-5 sm:w-5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-white sm:text-sm">Déplacer</p>
                                    <p className="text-[10px] text-muted-foreground sm:text-xs truncate">ZQSD / WASD / Flèches</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 sm:gap-3">
                                <RotateCw className="h-4 w-4 text-primary sm:h-5 sm:w-5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-white sm:text-sm">Regarder</p>
                                    <p className="text-[10px] text-muted-foreground sm:text-xs truncate">Glisser / 1 doigt</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 sm:gap-3">
                                <ZoomIn className="h-4 w-4 text-primary sm:h-5 sm:w-5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-white sm:text-sm">Zoom</p>
                                    <p className="text-[10px] text-muted-foreground sm:text-xs truncate">Molette / Pincer</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 sm:gap-3">
                                <ArrowUp className="h-4 w-4 text-primary sm:h-5 sm:w-5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-white sm:text-sm">Étages</p>
                                    <p className="text-[10px] text-muted-foreground sm:text-xs truncate">Boutons ou PageUp/PageDown</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {!showControls && (
                    <Button variant="outline" size="sm" onClick={() => setShowControls(true)} className="absolute top-6 left-6 bg-black/90 border-primary/30 text-primary hover:bg-black/80 text-xs sm:text-sm h-8 sm:h-9 px-3">
                        <Info className="h-3 w-3 mr-1.5 sm:h-4 sm:w-4 sm:mr-2" />
                        Aide
                    </Button>
                )}

                <div className="absolute top-6 right-6 flex flex-col gap-2 sm:gap-3">
                    <Card className="px-3 py-2 bg-white backdrop-blur-xl border-primary/30 sm:px-5 sm:py-3">
                        <p className="text-xs font-bold text-primary sm:text-sm">{initialArtworks.length} œuvres</p>
                    </Card>

                    {/* Sélecteur d'étage */}
                    <Card className="p-2 bg-black/90 backdrop-blur-xl border-primary/30">
                        <div className="flex flex-col gap-1">
                            <Button
                                variant={currentFloor === 2 ? "default" : "outline"}
                                size="sm"
                                onClick={() => changeFloor(2)}
                                className={`w-full gap-2 ${currentFloor === 2 ? 'bg-primary text-black' : 'bg-transparent border-primary/30 text-primary hover:bg-primary/10'}`}
                            >
                                <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                Étage 1
                            </Button>
                            <Button
                                variant={currentFloor === 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => changeFloor(1)}
                                className={`w-full gap-2 ${currentFloor === 1 ? 'bg-primary text-black' : 'bg-transparent border-primary/30 text-primary hover:bg-primary/10'}`}
                            >
                                <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
                                RDC
                            </Button>
                        </div>
                    </Card>

                    <Button variant="outline" size="sm" onClick={toggleFullscreen} className="bg-black/90 border-primary/30 text-primary hover:bg-black/80 text-xs sm:text-sm h-8 sm:h-9 px-3">
                        {isFullscreen ? <Minimize2 className="h-3 w-3 mr-1.5 sm:h-4 sm:w-4 sm:mr-2" /> : <Maximize2 className="h-3 w-3 mr-1.5 sm:h-4 sm:w-4 sm:mr-2" />}
                        <span className="hidden sm:inline">{isFullscreen ? 'Quitter' : 'Plein écran'}</span>
                        <span className="sm:hidden">{isFullscreen ? 'Quitter' : 'Écran'}</span>
                    </Button>
                </div>

                {selectedArtwork && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md p-3 z-50 sm:p-4">
                        <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#1a1a1a] to-white border-primary/30 shadow-2xl sm:max-h-[85vh]">
                            <div className="relative">
                                <div className="w-full h-48 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-center p-3 sm:h-64 sm:p-4">
                                    <img
                                        src={selectedArtwork.image_url || "/placeholder.svg"}
                                        alt={selectedArtwork.title}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedArtwork(null)} className="absolute top-2 right-2 bg-black/80 hover:bg-black text-primary border border-primary/30 h-8 w-8 sm:h-9 sm:w-9">
                                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <div className="absolute bottom-2 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4">
                                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                        <Badge className="bg-primary text-black font-semibold text-[10px] sm:text-xs">{selectedArtwork.category?.name_fr}</Badge>
                                        <Badge className="bg-secondary/80 text-secondary-foreground font-semibold text-[10px] sm:text-xs">
                                            {currentFloor === 1 ? 'RDC' : 'Étage 1'}
                                        </Badge>
                                    </div>
                                    <h2 className="font-serif text-lg font-bold text-primary mb-0.5 sm:text-2xl sm:mb-1">{selectedArtwork.title}</h2>
                                    <p className="text-sm text-white/90 sm:text-base">{selectedArtwork.artist}</p>
                                </div>
                            </div>

                            <div className="p-4 space-y-3 sm:p-5 sm:space-y-4">
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-2 sm:p-3">
                                        <p className="text-[10px] font-semibold text-primary mb-0.5 sm:text-xs sm:mb-1">ORIGINE</p>
                                        <p className="text-xs font-bold text-white sm:text-sm">{selectedArtwork.origin}</p>
                                    </div>
                                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-2 sm:p-3">
                                        <p className="text-[10px] font-semibold text-primary mb-0.5 sm:text-xs sm:mb-1">PÉRIODE</p>
                                        <p className="text-xs font-bold text-white sm:text-sm">{selectedArtwork.year || "Date inconnue"}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                                        <Globe className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
                                        <span className="text-[10px] font-semibold text-primary sm:text-xs">LANGUE</span>
                                    </div>
                                    <div className="flex gap-1.5 sm:gap-2">
                                        {languages.map((lang) => (
                                            <Button
                                                key={lang.code}
                                                size="sm"
                                                variant={language === lang.code ? "default" : "outline"}
                                                onClick={() => setLanguage(lang.code)}
                                                className={language === lang.code
                                                    ? "bg-primary text-black hover:bg-primary/90 h-7 text-[10px] px-2 sm:h-8 sm:text-xs sm:px-3"
                                                    : "border-primary/30 text-primary bg-transparent hover:bg-primary/10 h-7 text-[10px] px-2 sm:h-8 sm:text-xs sm:px-3"}
                                            >
                                                {lang.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {audioUrl && (
                                    <div>
                                        <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                                            <Volume2 className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
                                            <span className="text-[10px] font-semibold text-primary sm:text-xs">GUIDE AUDIO</span>
                                        </div>
                                        <div className="rounded-lg border border-primary/30 bg-black/50 p-3">
                                            <audio controls className="w-full" style={{ height: '40px' }}>
                                                <source src={audioUrl} type="audio/mpeg" />
                                                Votre navigateur ne supporte pas l'audio.
                                            </audio>
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 sm:p-4">
                                    <h3 className="font-serif font-bold text-primary mb-1.5 text-xs sm:text-sm sm:mb-2">Description</h3>
                                    <p className="text-[10px] leading-relaxed text-muted-foreground sm:text-xs">{description}</p>
                                </div>

                                <Button onClick={() => setSelectedArtwork(null)} className="w-full bg-primary hover:bg-primary/90 text-black font-semibold h-9 text-xs sm:h-10 sm:text-sm" size="sm">
                                    Continuer la visite
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}