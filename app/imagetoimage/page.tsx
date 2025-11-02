"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Copy,
  X,
  Loader2,
  Download,
  ChevronDown,
  ImageIcon,
  Plus,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
} from "lucide-react"
import confetti from "canvas-confetti"
import Link from "next/link"

const furnitureTypes = [
  "Select your background",
  "Office",
  "Living Room",
  "Dining Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Outdoor",
  "Patio",
]

const stylePrompts: Record<string, string[]> = {
  "Modern Minimalist": [
    "In a modern minimalist {ENTER TYPE OF SPACE HERE}, soft daylight flooding through large windows, balanced shadows, ultra-sharp focus, warm neutral tones, editorial style photography.",
    "In a modern minimalist {ENTER TYPE OF SPACE HERE}, captured with wide-angle lens, diffused natural light, clean lines, elegant depth of field, magazine-ready composition.",
    "In a modern minimalist {ENTER TYPE OF SPACE HERE}, golden hour lighting, soft contrast, cinematic framing, refined textures, high-resolution professional photo.",
    "In a modern minimalist {ENTER TYPE OF SPACE HERE}, perfectly staged, ambient natural light, airy atmosphere, crisp details, architectural photography aesthetic.",
    "In a modern minimalist {ENTER TYPE OF SPACE HERE}, bright neutral palette, even lighting, symmetrical composition, ultra-realistic rendering, luxury interior photography style.",
    "In a modern minimalist {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
  ],
  "Cozy and Traditional": [
    "In a modern cozy and traditional {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In a modern cozy and traditional {ENTER TYPE OF SPACE HERE}, warm ambient lighting, soft shadows, rich textures, inviting atmosphere, professional interior photography.",
    "In a modern cozy and traditional {ENTER TYPE OF SPACE HERE}, golden hour light streaming through windows, rustic details, cinematic framing, editorial style composition.",
    "In a modern cozy and traditional {ENTER TYPE OF SPACE HERE}, layered warm tones, soft focus depth, natural sunlight, elegant details, high-resolution photography.",
    "In a modern cozy and traditional {ENTER TYPE OF SPACE HERE}, intimate lighting, classic wood finishes, warm neutral palette, professional wide-angle photography.",
    "In a modern cozy and traditional {ENTER TYPE OF SPACE HERE}, soft natural light, timeless decor, cinematic angle, crisp details, premium interior photography aesthetic.",
  ],
  "Outdoor Modern Minimalist": [
    "In a modern outdoor minimalist {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In a modern outdoor minimalist {ENTER TYPE OF SPACE HERE}, bright natural sunlight, clean lines, soft shadows, open-air atmosphere, professional architectural photography.",
    "In a modern outdoor minimalist {ENTER TYPE OF SPACE HERE}, golden hour lighting, balanced highlights and shadows, airy composition, ultra-sharp focus, cinematic perspective.",
    "In a modern outdoor minimalist {ENTER TYPE OF SPACE HERE}, crisp natural light, minimal decor, expansive view, symmetrical framing, high-resolution photography.",
    "In a modern outdoor minimalist {ENTER TYPE OF SPACE HERE}, diffused daylight, soft textures, spacious design, elegant composition, editorial-style image.",
    "In a modern outdoor minimalist {ENTER TYPE OF SPACE HERE}, clear blue sky, clean architectural lines, serene ambiance, natural shadows, premium lifestyle photography.",
  ],
  "New York City": [
    "In a New York City {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In a New York City {ENTER TYPE OF SPACE HERE}, warm natural light, urban charm, soft shadows, crisp details, editorial interior photography.",
    "In a New York City {ENTER TYPE OF SPACE HERE}, floor-to-ceiling windows, golden hour glow, cinematic framing, vibrant city ambiance, professional high-quality photo.",
    "In a New York City {ENTER TYPE OF SPACE HERE}, natural daylight streaming in, modern urban textures, elegant composition, ultra-sharp focus, lifestyle photography aesthetic.",
    "In a New York City {ENTER TYPE OF SPACE HERE}, moody soft light, exposed brick and steel details, cinematic angles, high-resolution professional photography.",
    "In a New York City {ENTER TYPE OF SPACE HERE}, bright ambient lighting, sleek urban design, clean framing, architectural photography style, luxury editorial finish.",
  ],
  Japandi: [
    "In a Japandi {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In a Japandi {ENTER TYPE OF SPACE HERE}, soft natural light, neutral tones, warm wood accents, minimal clutter, cinematic professional photography.",
    "In a Japandi {ENTER TYPE OF SPACE HERE}, serene and balanced composition, natural textures, daylight streaming in, clean lines, high-resolution interior photography.",
    "In a Japandi {ENTER TYPE OF SPACE HERE}, muted color palette, simple elegant furnishings, diffused natural lighting, professional cinematic framing.",
    "In a Japandi {ENTER TYPE OF SPACE HERE}, calm minimalist design, natural wood and stone materials, airy ambiance, editorial-style photography.",
    "In a Japandi {ENTER TYPE OF SPACE HERE}, soft shadows, warm sunlight, uncluttered composition, ultra-sharp details, premium lifestyle interior photography.",
  ],
  Scandinavian: [
    "In a Scandinavian {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In a Scandinavian {ENTER TYPE OF SPACE HERE}, soft natural light, clean lines, neutral tones, minimal clutter, cinematic professional photography.",
    "In a Scandinavian {ENTER TYPE OF SPACE HERE}, bright daylight, wooden accents, airy composition, warm shadows, high-resolution interior photography.",
    "In a Scandinavian {ENTER TYPE OF SPACE HERE}, muted color palette, uncluttered space, soft textures, natural lighting, editorial-style photography.",
    "In a Scandinavian {ENTER TYPE OF SPACE HERE}, crisp lines, diffused sunlight, serene atmosphere, premium cinematic photography.",
    "In a Scandinavian {ENTER TYPE OF SPACE HERE}, warm sunlight streaming in, balanced composition, simple decor, ultra-sharp focus, professional interior photography.",
  ],
  "Outdoor Patio": [
    "In an Outdoor Patio {ENTER TYPE OF SPACE HERE}, warm natural light, clean lines, cozy seating, soft shadows, cinematic professional photography.",
    "In an Outdoor Patio {ENTER TYPE OF SPACE HERE}, golden hour lighting, minimal decor, airy atmosphere, high-resolution interior photography.",
    "In an Outdoor Patio {ENTER TYPE OF SPACE HERE}, bright sunlight, natural textures, serene composition, editorial-style photography.",
    "In an Outdoor Patio {ENTER TYPE OF SPACE HERE}, diffused daylight, uncluttered design, balanced framing, premium cinematic photography.",
    "In an Outdoor Patio {ENTER TYPE OF SPACE HERE}, soft shadows, warm ambient light, minimalistic furniture, ultra-sharp focus, professional lifestyle photography.",
    "In an Outdoor Patio {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
  ],
  "Modern Farmhouse": [
    "In a Modern Farmhouse {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In a Modern Farmhouse {ENTER TYPE OF SPACE HERE}, warm natural light, rustic wooden accents, airy composition, soft shadows, cinematic professional photography.",
    "In a Modern Farmhouse {ENTER TYPE OF SPACE HERE}, neutral tones, cozy furnishings, sunlight streaming through windows, high-resolution interior photography.",
    "In a Modern Farmhouse {ENTER TYPE OF SPACE HERE}, clean lines, textured fabrics, balanced composition, soft ambient lighting, editorial-style photography.",
    "In a Modern Farmhouse {ENTER TYPE OF SPACE HERE}, warm sunlight, minimal clutter, exposed beams, serene atmosphere, premium cinematic photography.",
    "In a Modern Farmhouse {ENTER TYPE OF SPACE HERE}, bright natural light, rustic-modern decor, open layout, ultra-sharp focus, professional lifestyle photography.",
  ],
  "Monochromatic Pastel": [
    "In a Monochromatic Pastel {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In a Monochromatic Pastel {ENTER TYPE OF SPACE HERE}, soft natural light, gentle shadows, pastel textures, clean minimal composition, cinematic professional photography.",
    "In a Monochromatic Pastel {ENTER TYPE OF SPACE HERE}, airy ambiance, subtle gradients, uncluttered design, high-resolution interior photography.",
    "In a Monochromatic Pastel {ENTER TYPE OF SPACE HERE}, bright diffuse daylight, soft furnishings, serene composition, editorial-style photography.",
    "In a Monochromatic Pastel {ENTER TYPE OF SPACE HERE}, soft ambient lighting, harmonious pastel palette, minimalistic decor, premium cinematic photography.",
    "In a Monochromatic Pastel {ENTER TYPE OF SPACE HERE}, warm sunlight, smooth textures, clean lines, ultra-sharp focus, professional lifestyle photography.",
  ],
  Boho: [
    "In a Boho {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In a Boho {ENTER TYPE OF SPACE HERE}, warm natural light, eclectic textures, layered fabrics, cozy composition, cinematic professional photography.",
    "In a Boho {ENTER TYPE OF SPACE HERE}, soft daylight, colorful accents, plants and woven decor, airy and inviting atmosphere, high-resolution interior photography.",
    "In a Boho {ENTER TYPE OF SPACE HERE}, natural sunlight, rattan and wood furnishings, relaxed composition, editorial-style photography.",
    "In a Boho {ENTER TYPE OF SPACE HERE}, diffused warm light, layered patterns, minimal clutter, premium cinematic photography.",
    "In a Boho {ENTER TYPE OF SPACE HERE}, soft shadows, harmonious textures, natural materials, ultra-sharp focus, professional lifestyle photography.",
  ],
  "Industrial Loft": [
    "In an Industrial Loft {ENTER TYPE OF SPACE HERE}, professional photography, high quality, natural lighting, cinematic composition.",
    "In an Industrial Loft {ENTER TYPE OF SPACE HERE}, exposed brick and steel details, soft natural light, open layout, cinematic professional photography.",
    "In an Industrial Loft {ENTER TYPE OF SPACE HERE}, large windows, warm sunlight, minimal furnishings, high-resolution interior photography.",
    "In an Industrial Loft {ENTER TYPE OF SPACE HERE}, diffused daylight, raw textures, clean lines, editorial-style cinematic composition.",
    "In an Industrial Loft {ENTER TYPE OF SPACE HERE}, exposed beams, natural lighting, airy atmosphere, premium professional photography.",
    "In an Industrial Loft {ENTER TYPE OF SPACE HERE}, soft shadows, neutral palette, uncluttered industrial decor, ultra-sharp focus, cinematic interior photography.",
  ],
}

const ImageToImagePage = () => {
  // Publishing states
  const [isPublishing, setIsPublishing] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [embedCode, setEmbedCode] = useState("")
  const [previewLink, setPreviewLink] = useState("")

  // Image upload states
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Imagery states
  const [backgroundDescription, setBackgroundDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFurnitureType, setSelectedFurnitureType] = useState("Select your background")
  const [showFurnitureDropdown, setShowFurnitureDropdown] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [hoveredSuggestion, setHoveredSuggestion] = useState<number | null>(null)
  const [hoveredGeneratedIndex, setHoveredGeneratedIndex] = useState<number | null>(null)
  const [showGeneratedImages, setShowGeneratedImages] = useState(false)
  const [imageCount, setImageCount] = useState(1)
  const [flipIndices, setFlipIndices] = useState<number[]>([])
  const [currentOriginalImageIndex, setCurrentOriginalImageIndex] = useState(0)

  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedStylePrompt, setSelectedStylePrompt] = useState<string | null>(null)

  const [userCustomDescription, setUserCustomDescription] = useState("")

  const [includePropFurniture, setIncludePropFurniture] = useState(true)

  const [showGeneratingModal, setShowGeneratingModal] = useState(false)
  const [countdown, setCountdown] = useState(55)
  const [apiCompleted, setApiCompleted] = useState(false)

  const [imagesLeft, setImagesLeft] = useState(10)
  const [showLimitModal, setShowLimitModal] = useState(false)

  const creditsByCount: Record<number, number> = { 1: 10, 2: 25, 3: 40, 4: 50 }
  const credits = creditsByCount[imageCount] ?? 10
  const generateLabel = `Generate`

  // Custom image sources
  const IMAGE_SOURCES = {
    sunpan2: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sunpan%202-4wgU3f0C5tfSwL4QHzzoyC2rpOZNuq.webp",
    sunpan12:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sunpan%201.2.png-mylTqunXX342T3fH4zmpsBRBz9xuEn.jpeg",
    abileneDiningChair:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Abilene%20Dining%20Chair%20-hrjjD7CTNQniJlDwfJe54mAb0mu9tf.webp",
    sunpan3: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sunpan%203-W2MC5H4NrA14w16CMQfarCM4irazF0.webp",
    sunpan13:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sunpan%201.3.png-deQAV31Fc1zxj0ieuKagDlCnwqEv7C.jpeg",
    donnieBench: "/images/donnie-bench-1.webp",
  }

  // Add suggestions data
  const suggestions = [
    {
      name: "Cozy and Traditional",
      description: "warm, comfortable, classic design elements",
      image: "/images/cozy-traditional.avif",
    },
    {
      name: "Modern Minimalist",
      description: "clean lines, simple forms, neutral colors",
      image: "/images/modern-minimalist.jpg",
    },
    {
      name: "Outdoor Modern Minimalist",
      description: "sleek outdoor furniture, natural materials",
      image: "/images/outdoor-modern-minimalist.png",
    },
    {
      name: "New York City",
      description: "urban, industrial, metropolitan style",
      image: "/images/new-york-city.jpg",
    },
    {
      name: "Japandi",
      description: "Japanese minimalism meets Scandinavian",
      image: "/images/japandi.jpg",
    },
    {
      name: "Scandanavian",
      description: "light woods, cozy textures, hygge vibes",
      image: "/images/scandinavian.jpeg",
    },
    {
      name: "Outdoor Patio",
      description: "comfortable outdoor seating, natural setting",
      image: "/images/outdoor-patio.png",
    },
    {
      name: "Modern Farmhouse",
      description: "rustic charm meets contemporary design",
      image: "/images/modern-farmhouse.jpg",
    },
    {
      name: "Monochromatic Pastel",
      description: "soft, muted colors, single color palette",
      image: "/images/monochromatic-pastel.webp",
    },
    {
      name: "Boho",
      description: "eclectic, colorful, artistic patterns",
      image: "/images/boho.webp",
    },
    {
      name: "Industrial Loft",
      description: "exposed brick, metal, urban warehouse feel",
      image: "/images/industrial-loft.jpg",
    },
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (showGeneratingModal && !apiCompleted) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) {
            return prev - 1
          }
          return 0
        })
      }, 1000)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [showGeneratingModal, apiCompleted])

  // Add handler functions
  const handleGenerateBackground = async () => {
    if (!uploadedImages.length || !backgroundDescription.trim()) {
      alert("Please upload at least one image and provide a background description")
      return
    }

    if (imagesLeft <= 0) {
      setShowLimitModal(true)
      return
    }

    setShowGeneratingModal(true)
    setCountdown(55)
    setApiCompleted(false)
    setFlipIndices([])

    try {
      console.log("[v0] Starting image generation with Gemini API")

      const base64Images = await Promise.all(
        uploadedImages.map(async (imageUrl) => {
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
          })
        }),
      )

      console.log(`[v0] Converted ${base64Images.length} images to base64, calling API for multiple variations`)

      const generatedImagePromises = []
      for (let i = 0; i < imageCount; i++) {
        const furnitureCount = uploadedImages.length

        let finalPrompt = ""

        if (selectedStylePrompt && selectedFurnitureType !== "Select your background") {
          // Replace placeholder with background type
          finalPrompt = selectedStylePrompt.replace(/{ENTER TYPE OF SPACE HERE}/g, selectedFurnitureType.toLowerCase())
        } else if (selectedStylePrompt) {
          // Style selected but no background type - use "space" as default
          finalPrompt = selectedStylePrompt.replace(/{ENTER TYPE OF SPACE HERE}/g, "space")
        } else {
          // No style selected - use user's description with background context
          const backgroundContext =
            selectedFurnitureType !== "Select your background"
              ? `in a ${selectedFurnitureType.toLowerCase()} setting`
              : ""
          finalPrompt = `${backgroundDescription}${backgroundContext ? ` ${backgroundContext}` : ""}`
        }

        // Add variation info
        const variationPrompt = `${finalPrompt}. This is variation ${i + 1} of ${imageCount}. ${
          furnitureCount > 1
            ? `There are ${furnitureCount} furniture pieces that should be staged together in the same scene.`
            : ""
        } Create a unique and distinct background setting that differs from other variations in lighting, angle, time of day, or environmental details while maintaining the same overall theme.`

        generatedImagePromises.push(
          fetch("/api/generate-background", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              images: base64Images,
              prompt: variationPrompt,
              imageCount: 1,
              furnitureCount: uploadedImages.length,
              backgroundType: selectedFurnitureType !== "Select your background" ? selectedFurnitureType : undefined,
              selectedStyle: selectedStyle, // Pass selected style to API
              includePropFurniture: includePropFurniture, // Pass prop furniture toggle state to API
            }),
          }).then(async (apiResponse) => {
            if (!apiResponse.ok) {
              const errorData = await apiResponse.json()
              console.error("[v0] API error:", errorData)
              throw new Error(errorData.error || "Failed to generate image")
            }
            const data = await apiResponse.json()
            return data.images?.[0] || null
          }),
        )
      }

      // Wait for all images to be generated
      const images = await Promise.all(generatedImagePromises)
      const validImages = images.filter((img) => img !== null)

      console.log("[v0] Generated images received:", validImages.length)

      if (validImages.length > 0) {
        setImagesLeft((prev) => Math.max(0, prev - validImages.length))

        setApiCompleted(true)
        setGeneratedImages(validImages)
        setShowGeneratedImages(true)
        setShowGeneratingModal(false)
      } else {
        throw new Error("No images generated")
      }
    } catch (error) {
      console.error("[v0] Error generating background:", error)
      alert(`Failed to generate images: ${error instanceof Error ? error.message : "Unknown error"}`)
      setShowGeneratingModal(false)
    }
  }

  const handleSuggestionClick = (suggestion: any) => {
    const styleName = suggestion.name
    const prompts = stylePrompts[styleName]

    if (prompts && prompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * prompts.length)
      const selectedPrompt = prompts[randomIndex]

      // Replace placeholder with selected background type or "space" as default
      const backgroundType =
        selectedFurnitureType !== "Select your background" ? selectedFurnitureType.toLowerCase() : "space"
      const displayPrompt = selectedPrompt.replace(/{ENTER TYPE OF SPACE HERE}/g, backgroundType)

      // If a theme was already selected, replace it with the new theme
      // If no theme was selected but user has content, append the theme
      if (selectedStyle) {
        // Theme already selected - replace the old theme prompt with new one
        if (userCustomDescription) {
          setBackgroundDescription(`${userCustomDescription}\n\n${displayPrompt}`)
        } else {
          setBackgroundDescription(displayPrompt)
        }
      } else {
        // No theme selected yet - check if user has entered content
        const existingContent = backgroundDescription.trim()

        if (existingContent) {
          // User has content, append theme prompt on new line
          setUserCustomDescription(existingContent)
          setBackgroundDescription(`${existingContent}\n\n${displayPrompt}`)
        } else {
          // No user content, just set the theme prompt
          setUserCustomDescription("")
          setBackgroundDescription(displayPrompt)
        }
      }

      setSelectedStyle(styleName)
      setSelectedStylePrompt(selectedPrompt)
    } else {
      // Fallback if style not found
      setSelectedStyle(null)
      setSelectedStylePrompt(null)
      setBackgroundDescription(suggestion.description)
    }

    // Auto-scroll to background description with slide-up animation
    if (backgroundDescriptionRef.current) {
      backgroundDescriptionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      // Focus the textarea after scroll animation
      setTimeout(() => {
        backgroundDescriptionRef.current?.focus()
      }, 500)
    }
  }

  const handleShufflePrompt = () => {
    if (!selectedStyle) return

    const prompts = stylePrompts[selectedStyle]
    if (!prompts || prompts.length === 0) return

    // Get a random prompt different from the current one
    let randomIndex = Math.floor(Math.random() * prompts.length)
    let newPrompt = prompts[randomIndex]

    // Try to get a different prompt if possible
    if (prompts.length > 1) {
      while (newPrompt === selectedStylePrompt && prompts.length > 1) {
        randomIndex = Math.floor(Math.random() * prompts.length)
        newPrompt = prompts[randomIndex]
      }
    }

    setSelectedStylePrompt(newPrompt)

    // Replace placeholder with selected background type or "space" as default
    const backgroundType =
      selectedFurnitureType !== "Select your background" ? selectedFurnitureType.toLowerCase() : "space"
    const displayPrompt = newPrompt.replace(/{ENTER TYPE OF SPACE HERE}/g, backgroundType)

    if (userCustomDescription) {
      setBackgroundDescription(`${userCustomDescription}\n\n${displayPrompt}`)
    } else {
      setBackgroundDescription(displayPrompt)
    }
  }

  const handleUnselectStyle = () => {
    setSelectedStyle(null)
    setSelectedStylePrompt(null)
    // When unselecting style, clear the theme part of the prompt and keep user's custom description
    if (userCustomDescription) {
      setBackgroundDescription(userCustomDescription)
      setUserCustomDescription("")
    } else {
      setBackgroundDescription("")
    }
  }

  const handleViewMoreClick = () => {
    setShowAllSuggestions(!showAllSuggestions)
    if (!showAllSuggestions) {
      // Scroll to the bottom of the suggestions after expanding
      setTimeout(() => {
        const suggestionsContainer = document.querySelector(".suggestions-container")
        if (suggestionsContainer) {
          suggestionsContainer.scrollIntoView({ behavior: "smooth", block: "end" })
        }
      }, 100)
    }
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const handleCloseImage = () => {
    setSelectedImage(null)
  }

  const handleCloseGeneratedImages = () => {
    setShowGeneratedImages(false)
    setGeneratedImages([])
    setFlipIndices([])
    setSelectedStyle(null) // Reset selected style when closing generated images
    setSelectedStylePrompt(null)
    setUserCustomDescription("") // Reset custom description as well
    setBackgroundDescription("") // Also reset the main description field
  }

  const handleDownloadImage = (imageUrl?: string) => {
    const urlToDownload = imageUrl || selectedImage
    if (urlToDownload) {
      // Create a temporary link to download the image
      const link = document.createElement("a")
      link.href = urlToDownload
      link.download = "generated-background.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Image upload handlers
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newImages: string[] = []
    const maxImages = 4
    const remainingSlots = maxImages - uploadedImages.length

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i]
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file)
        newImages.push(imageUrl)
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages])
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files)
    // Reset the input value so the same file can be selected again if needed
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
    handleFileUpload(event.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const getImageGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid grid-cols-2 grid-rows-2 gap-4" // 2x2 grid for 2 images (bottom row empty)
    if (count === 3) return "grid grid-cols-2 grid-rows-2 gap-4" // 2x2 grid for 3 images
    if (count === 4) return "grid grid-cols-2 grid-rows-2 gap-4" // 2x2 grid for 4 images
    return "grid-cols-1"
  }

  const getImageSpanClass = (index: number, count: number) => {
    return ""
  }

  const handlePublish = () => {
    setIsPublishing(true)

    // Simulate generating embed code and preview link
    setTimeout(() => {
      const generatedId = Math.random().toString(36).substring(2, 15)
      const generatedEmbedCode = `<iframe src="https://ar.vervear.com/image/${generatedId}" frameborder="0" width="100%" height="100%"></iframe>`
      const generatedPreviewLink = `https://ar.vervear.com/image/${generatedId}`

      setEmbedCode(generatedEmbedCode)
      setPreviewLink(generatedPreviewLink)
      setIsPublishing(false)
      setShowEmbedModal(true)

      // Trigger confetti after generation is complete
      triggerConfetti()
    }, 3000)
  }

  const triggerConfetti = () => {
    // First burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#ff5e1a", "#ffffff", "#1ac157"],
    })

    // Multiple bursts from different angles
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors: ["#ff5e1a", "#ffffff", "#1ac157"],
      })
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.6 },
        colors: ["#ff5e1a", "#ffffff", "#1ac157"],
      })
    }, 150)

    // Final burst
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ff5e1a", "#ffffff", "#1ac157"],
      })
    }, 300)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Ref for background description textarea
  const backgroundDescriptionRef = useRef<HTMLTextAreaElement>(null)

  const handleResetApp = () => {
    setUploadedImages([])
    setGeneratedImages([])
    setShowGeneratedImages(false)
    setBackgroundDescription("")
    setImageCount(1)
    setSelectedImage(null)
    setCurrentOriginalImageIndex(0)
    setFlipIndices([])
    setSelectedStyle(null) // Reset selected style on app reset
    setSelectedStylePrompt(null)
    setUserCustomDescription("") // Also reset custom description
    setShowGeneratingModal(false)
    setCountdown(55)
    setApiCompleted(false)
  }

  const handlePreviousOriginalImage = () => {
    setCurrentOriginalImageIndex((prev) => (prev > 0 ? prev - 1 : uploadedImages.length - 1))
  }

  const handleNextOriginalImage = () => {
    setCurrentOriginalImageIndex((prev) => (prev < uploadedImages.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-white">
      {/* Loading Overlay */}
      {isPublishing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[#1f1f23] rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF5E1A]" />
            <p className="text-white text-lg">Generating an embed code and preview link</p>
          </div>
        </div>
      )}

      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="bg-[#1f1f23] border-[#3f3f46] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">Image Limit Reached</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <p className="text-[#a1a1aa] text-center">
              Subscribe to a plan to unlock advanced staging capabilities or pay for one time image top-up with this
              version.
            </p>

            <div className="space-y-3">
              <a href="https://vervear.com/pricing" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-[#FF5E1A] hover:bg-[#FF5E1A]/90 text-white h-12 text-base font-medium">
                  Subscribe to a plan
                </Button>
              </a>

              <a href="https://vervear.com/payasyougo" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-[#000000] hover:bg-[#000000]/90 text-white border border-[#3f3f46] h-12 text-base font-medium">
                  One time Top-up
                </Button>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Embed Modal */}
      <Dialog open={showEmbedModal} onOpenChange={setShowEmbedModal}>
        <DialogContent className="bg-[#1f1f23] border-[#3f3f46] text-white max-w-2xl">
          <DialogHeader className="relative">
            <button
              onClick={() => setShowEmbedModal(false)}
              className="absolute -top-2 -right-2 p-1 hover:bg-[#3f3f46] rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-[#a1a1aa]" />
            </button>
            <DialogTitle className="text-xl font-semibold text-center">Embed Code</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Embed Code Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 18L22 12L16 6M8 6L2 12L8 18"
                    stroke="#FF5E1A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-lg font-medium">Embed Code</span>
              </div>

              <p className="text-[#a1a1aa] mb-4 text-left">
                Copy and paste this code into the HTML code section of your webpage to embed your image experience.
              </p>

              <div className="relative bg-[#18181b] rounded-lg border border-[#3f3f46] overflow-hidden">
                <div className="p-4 pr-12">
                  <code className="text-sm text-[#e4e4e7] break-all whitespace-pre-wrap">{embedCode}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(embedCode)}
                  className="absolute top-3 right-3 p-1 hover:bg-[#3f3f46] rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-[#FF5E1A]" />
                </button>
              </div>
            </div>

            {/* Preview Link Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    stroke="#FF5E1A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    stroke="#FF5E1A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-lg font-medium">Preview Link</span>
              </div>

              <p className="text-[#a1a1aa] mb-4 text-left">
                Easily copy this link and attach or "link" it to a button on your website
              </p>

              <div className="relative bg-[#18181b] rounded-lg border border-[#3f3f46] overflow-hidden">
                <div className="p-4 pr-12">
                  <code className="text-sm text-[#e4e4e7] break-all whitespace-pre-wrap">{previewLink}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(previewLink)}
                  className="absolute top-3 right-3 p-1 hover:bg-[#3f3f46] rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-[#FF5E1A]" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#3f3f46]">
        <Link href="/home">
          <Button size="sm" className="bg-[#ffffff] text-[#000000] hover:bg-[#f0f0f0] gap-2">
            <ArrowLeft className="h-4 w-4 text-[#000000]" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#FF5E1A" strokeWidth="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="#FF5E1A" />
            <path d="M21 15L16 10L3 21" stroke="#FF5E1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white font-medium">{imagesLeft} IMAGES LEFT</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Main Content - Image Viewer */}
        <div className="flex-1 p-4 relative">
          <div
            className="bg-[#ffffff] rounded-lg h-full relative flex items-center justify-center"
            onDragOver={uploadedImages.length > 0 && uploadedImages.length < 4 ? handleDragOver : undefined}
            onDragLeave={uploadedImages.length > 0 && uploadedImages.length < 4 ? handleDragLeave : undefined}
            onDrop={uploadedImages.length > 0 && uploadedImages.length < 4 ? handleDrop : undefined}
          >
            {/* Generating Modal */}
            {showGeneratingModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-[#1f1f23] rounded-lg p-6 w-[400px]">
                  {/* Header with countdown */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-base">Generating background(s)</h3>
                    {countdown > 0 ? (
                      <span className="text-[#FF5E1A] font-bold text-base">{countdown}s</span>
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin text-[#FF5E1A]" />
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#3f3f46] rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className="bg-[#FF5E1A] h-full transition-all duration-1000 ease-linear"
                      style={{
                        width: `${((55 - countdown) / 55) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Status message */}
                  <p className="text-[#a1a1aa] text-sm text-center">
                    {countdown > 10
                      ? "Estimated 55s"
                      : countdown > 0
                        ? "Please hang tight your furniture is being staged properly"
                        : "Please hang tight your furniture is being staged properly"}
                  </p>
                </div>
              </div>
            )}

            {showGeneratedImages && generatedImages.length > 0 ? (
              /* Generated Images Display */
              <div className="w-full h-full relative overflow-hidden">
                {generatedImages.length === 1 && !selectedImage && (
                  <button
                    onClick={handleResetApp}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                )}

                <div
                  className={`w-full h-full p-4 ${
                    generatedImages.length === 1
                      ? "flex items-center justify-center"
                      : generatedImages.length === 2
                        ? "grid grid-cols-2 grid-rows-2 gap-4" // 2x2 grid for 2 generated images
                        : generatedImages.length === 3
                          ? "grid grid-cols-2 grid-rows-2 gap-4"
                          : "grid grid-cols-2 grid-rows-2 gap-4"
                  }`}
                >
                  {generatedImages.map((imageUrl, index) => {
                    // For 3 images: first 2 images on first row, third image on second row
                    const isThirdImage = generatedImages.length === 3 && index === 2

                    return (
                      <div
                        key={index}
                        className={`relative rounded-[5px] overflow-hidden group cursor-pointer ${
                          generatedImages.length === 1 ? "w-full h-full max-w-5xl max-h-full" : "w-full h-full"
                        } ${isThirdImage ? "col-span-1" : ""}`}
                        onMouseEnter={() => setHoveredGeneratedIndex(index)}
                        onMouseLeave={() => setHoveredGeneratedIndex(null)}
                        onClick={() => generatedImages.length > 1 && handleImageClick(imageUrl)}
                      >
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Generated background ${index + 1}`}
                          className={`w-full h-full bg-white ${
                            generatedImages.length === 1 ? "object-contain" : "object-cover"
                          }`}
                          style={flipIndices.includes(index) ? { transform: "scaleX(-1)" } : undefined}
                        />
                        {generatedImages.length > 1 && (
                          <button
                            className="absolute top-3 right-3 p-2 bg-gray-800/60 hover:bg-gray-800/80 rounded-full transition-all opacity-100 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleImageClick(imageUrl)
                            }}
                          >
                            <Maximize2 className="h-4 w-4 text-white" />
                          </button>
                        )}
                        {(generatedImages.length === 1 || hoveredGeneratedIndex === index) && (
                          <button
                            className="absolute bottom-3 right-3 p-2 bg-gray-800/60 hover:bg-gray-800/80 rounded-full transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadImage(imageUrl)
                            }}
                          >
                            <Download className="h-4 w-4 text-white" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : uploadedImages.length === 0 ? (
              /* Upload Area */
              <div
                className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
                  isDragging
                    ? "border-[#FF5E1A] bg-[#FF5E1A]/5"
                    : "border-[#d4d4d8] hover:border-[#FF5E1A] hover:bg-[#FF5E1A]/5"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[#FF5E1A]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <ImageIcon className="w-8 h-8 text-[#FF5E1A]" />
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="bg-[#FF5E1A] hover:bg-[#FF5E1A]/90 text-white px-8 py-3"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (fileInputRef.current) {
                          fileInputRef.current.click()
                        }
                      }}
                    >
                      Upload product photos
                    </Button>
                    <p className="text-[#71717a] text-sm">Or drag and drop images here</p>
                    <p className="text-[#a1a1aa] text-xs">Maximum 4 images • JPG, PNG supported</p>
                  </div>
                </div>
              </div>
            ) : uploadedImages.length === 1 ? (
              /* Single Image - Full Size */
              <div className="w-full h-full relative">
                <img
                  src={uploadedImages[0] || "/placeholder.svg"}
                  alt="Uploaded product"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => removeImage(0)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>

                {/* Drag overlay for additional images */}
                {isDragging && uploadedImages.length < 4 && (
                  <div className="absolute inset-0 bg-[#FF5E1A]/10 border-2 border-dashed border-[#FF5E1A] rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-[#FF5E1A]/20 rounded-xl flex items-center justify-center mx-auto">
                        <Plus className="w-6 h-6 text-[#FF5E1A]" />
                      </div>
                      <p className="text-[#FF5E1A] font-medium">Drop to add more images</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Multiple Images - Grid Layout */
              <div
                className={`w-full h-full grid gap-2 p-4 ${
                  uploadedImages.length === 2
                    ? "grid-cols-2 grid-rows-2" // 2x2 grid for 2 uploaded images (bottom row empty)
                    : getImageGridClass(uploadedImages.length)
                }`}
              >
                {uploadedImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden bg-[#f4f4f5] ${
                      uploadedImages.length === 2
                        ? "" // Remove span class for vertical stacking
                        : getImageSpanClass(index, uploadedImages.length)
                    }`}
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Uploaded product ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload More Photos Button - Fixed Position - Only show when no generated images */}
            {!showGeneratedImages && uploadedImages.length > 0 && uploadedImages.length < 4 && (
              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                <Button
                  variant="secondary"
                  className="bg-[#18181b] text-[#ffffff] hover:bg-[#3f3f46]"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (fileInputRef.current) {
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload more photos
                </Button>
                <p className="text-xs text-[#3f3f46]">
                  {4 - uploadedImages.length} more image{4 - uploadedImages.length !== 1 ? "s" : ""} allowed
                </p>
              </div>
            )}

            {/* Image Overlay - Modified to show only individual image close button */}
            {selectedImage && (
              <div className="absolute inset-4 bg-white rounded-lg flex items-center justify-center z-10">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected background"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={handleCloseImage}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  title="Collapse"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDownloadImage()}
                  className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <Download className="h-6 w-6 text-white" />
                </button>
              </div>
            )}

            {/* File input - moved outside conditional rendering */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[400px] bg-[#1f1f23] p-4 overflow-y-auto overflow-x-hidden flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Generate Background Content */}
          <div className="space-y-6 flex-1 overflow-y-auto">
            {/* "Your original product" section when images are generated */}
            {showGeneratedImages && uploadedImages.length > 0 && (
              <div className="space-y-3 mb-6">
                <label className="text-white font-medium">Your original photo</label>
                <div className="bg-[#18181b] border border-[#3f3f46] rounded-lg overflow-hidden">
                  {/* Image container */}
                  <div className="relative w-full h-[150px]">
                    <img
                      src={uploadedImages[currentOriginalImageIndex] || "/placeholder.svg"}
                      alt={`Original product ${currentOriginalImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />

                    {/* Close button */}
                    <button
                      onClick={handleResetApp}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>

                    {/* Navigation buttons - only show if multiple images */}
                    {uploadedImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousOriginalImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5 text-white" />
                        </button>
                        <button
                          onClick={handleNextOriginalImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <ChevronRight className="h-5 w-5 text-white" />
                        </button>

                        {/* Image counter */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
                          {currentOriginalImageIndex + 1} / {uploadedImages.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Furniture Type Selector */}
            <div className="space-y-3">
              <label className="text-white font-medium">What kind of background do you want?</label>
              <div className="relative">
                <button
                  className="w-full bg-[#18181b] border border-[#3f3f46] rounded-lg p-3 text-white text-left flex items-center justify-between focus:outline-none transition-all duration-200"
                  onClick={() => setShowFurnitureDropdown(!showFurnitureDropdown)}
                >
                  <span className={selectedFurnitureType === "Select your background" ? "text-white/65" : ""}>
                    {selectedFurnitureType}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showFurnitureDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showFurnitureDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#18181b] border border-[#3f3f46] rounded-lg shadow-lg z-10">
                    {furnitureTypes.map((type) => (
                      <button
                        key={type}
                        className="w-full px-3 py-2 text-left text-white hover:bg-[#3f3f46] first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => {
                          setSelectedFurnitureType(type)
                          setShowFurnitureDropdown(false)
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Background Description */}
            <div className="space-y-3">
              <label className="text-white font-medium">Describe the details of your background</label>
              <div className="relative">
                <textarea
                  ref={backgroundDescriptionRef}
                  placeholder="e.g. in a sunny park, grass, bench under a tree, professional ad photography"
                  className="w-full bg-[#18181b] border border-[#3f3f46] rounded-lg p-3 text-white placeholder:text-[#71717a] min-h-[80px] resize-none focus:outline-none transition-all duration-200 text-sm pr-10"
                  style={{ fontSize: "14px" }}
                  value={backgroundDescription}
                  onChange={(e) => {
                    const newValue = e.target.value
                    setBackgroundDescription(newValue)

                    if (newValue.trim() === "") {
                      setSelectedStyle(null)
                      setSelectedStylePrompt(null)
                      setUserCustomDescription("")
                    }
                  }}
                />
                {selectedStyle && (
                  <button
                    onClick={handleShufflePrompt}
                    className="absolute bottom-3 right-3 p-1.5 hover:bg-[#3f3f46] rounded transition-colors"
                    title="Shuffle prompt"
                  >
                    <Shuffle className="h-4 w-4 text-[#FF5E1A]" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <label className="text-white/70 text-sm cursor-pointer" htmlFor="prop-furniture-toggle">
                    Include prop furniture
                  </label>
                  <div className="group relative">
                    <button
                      className="w-3.5 h-3.5 rounded-full bg-[#3f3f46] flex items-center justify-center hover:bg-[#52525b] transition-colors"
                      title="We'll add prop furniture to enrich the scene"
                    >
                      <span className="text-[#a1a1aa] text-[10px]">?</span>
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-[#2a2a2a] text-white text-xs rounded-lg p-3 shadow-xl border border-[#3f3f46] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-center">
                      We'll add prop furniture to enrich the scene
                    </div>
                  </div>
                </div>
                <button
                  id="prop-furniture-toggle"
                  role="switch"
                  aria-checked={includePropFurniture}
                  onClick={() => setIncludePropFurniture(!includePropFurniture)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    includePropFurniture ? "bg-[#FF5E1A]" : "bg-[#3f3f46]"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      includePropFurniture ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-white font-medium">Number of images:</label>
              <div className="flex justify-between">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setImageCount(n)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      imageCount === n
                        ? "bg-[#FF5E1A] text-white border-[#FF5E1A]"
                        : "bg-[#18181b] text-[#e4e4e7] border-[#3f3f46] hover:bg-[#3f3f46]"
                    }`}
                  >
                    {n} {n === 1 ? "image" : "images"}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-[#3f3f46] hover:bg-[#FF5E1A] text-white h-12 text-base font-medium disabled:bg-[#FF5E1A]"
              onClick={handleGenerateBackground}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                generateLabel
              )}
            </Button>

            {/* Suggestions */}
            <div className="space-y-4 suggestions-container">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Suggested Themes</h3>
                <button
                  className="flex items-center gap-2 text-[#71717a] hover:text-white transition-colors text-sm"
                  onClick={handleViewMoreClick}
                >
                  <span>{showAllSuggestions ? "View less" : "View more"}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d={showAllSuggestions ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {suggestions.slice(0, showAllSuggestions ? suggestions.length : 6).map((suggestion, index) => (
                  <button
                    key={index}
                    className={`relative rounded-lg overflow-hidden hover:opacity-90 transition-all ${
                      selectedStyle === suggestion.name ? "ring-2 ring-[#FF5E1A]" : ""
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="w-full h-[170px] bg-[#181818]">
                      <img
                        src={suggestion.image || "/placeholder.svg"}
                        alt={suggestion.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Label at bottom with gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-3">
                      <h4 className="text-white text-sm font-medium text-left">{suggestion.name}</h4>
                    </div>
                    {/* Selected state indicators */}
                    {selectedStyle === suggestion.name && (
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShufflePrompt()
                          }}
                          className="p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                          title="Shuffle prompt"
                        >
                          <Shuffle className="h-3.5 w-3.5 text-[#FF5E1A]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnselectStyle()
                          }}
                          className="p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                          title="Unselect style"
                        >
                          <X className="h-3.5 w-3.5 text-[#FF5E1A]" />
                        </button>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dissolve {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default ImageToImagePage
