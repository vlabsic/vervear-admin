"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  RotateCw,
  ShoppingCart,
  Sun,
  Moon,
  Package,
  ImageIcon,
  Sliders,
  Palette,
  Brush,
  Play,
  Copy,
  X,
  Loader2,
  Download,
  ChevronDown,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useEffect, useState, useRef } from "react"
import type React from "react"
import confetti from "canvas-confetti"
import Link from "next/link"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        "camera-controls"?: boolean
        "auto-rotate"?: boolean
        "rotation-per-second"?: string
        ar?: boolean
        "ar-modes"?: string
        "shadow-intensity"?: string
        exposure?: string
        "environment-image"?: string
        "skybox-image"?: string
        "camera-orbit"?: string
        "shadow-softness"?: string
        "environment-rotation-y"?: string
        autoplay?: boolean
        "animation-name"?: boolean
        "disable-pan"?: boolean
        "disable-zoom"?: boolean
      }
    }
  }
}

const backgroundColors = [
  { name: "Transparent", value: "transparent" },
  { name: "Dark Gray", value: "#3f3f46" },
  { name: "Medium Gray", value: "#71717a" },
  { name: "Light Gray", value: "#d4d4d8" },
  { name: "Black", value: "#000000" },
  { name: "Gray", value: "#52525b" },
  { name: "Dark Color", value: "#27272a" },
]

const environmentPresets = [
  { name: "Default", image: "/placeholder.svg?height=80&width=80", value: "neutral" },
  { name: "Studio", image: "/placeholder.svg?height=80&width=80", value: "legacy" },
  { name: "City", image: "/placeholder.svg?height=80&width=80", value: "city" },
  { name: "Park", image: "/placeholder.svg?height=80&width=80", value: "park" },
  { name: "Sunrise", image: "/placeholder.svg?height=80&width=80", value: "sunrise" },
  { name: "Sunset", image: "/placeholder.svg?height=80&width=80", value: "sunset" },
  { name: "Cool", image: "/placeholder.svg?height=80&width=80", value: "dawn" },
  { name: "Warm", image: "/placeholder.svg?height=80&width=80", value: "warm" },
]

const furnitureTypes = ["Office", "Living Room", "Bedroom", "Kitchen", "Bathroom", "Outdoor"]

export default function ProductConfigPage() {
  const [modelSrc, setModelSrc] = useState("/models/default-model.glb")
  const [modelLoaded, setModelLoaded] = useState(false)
  const [productImage, setProductImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modelViewerRef = useRef<HTMLElement | null>(null)

  // Product Experience States
  const [viewerType, setViewerType] = useState<"3D" | "360">("3D")
  const [isZooming, setIsZooming] = useState(true)
  const [isAutoRotate, setIsAutoRotate] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(30)
  const [isSizeControl, setIsSizeControl] = useState(false)
  const [isAREnabled, setIsAREnabled] = useState(false)
  const [isBuyNowEnabled, setIsBuyNowEnabled] = useState(false)
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false)
  const [shadowSoftness, setShadowSoftness] = useState(0.7)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff") // Default white
  const [customColor, setCustomColor] = useState<string | null>(null)
  const [selectedEnvironment, setSelectedEnvironment] = useState("neutral")
  const [exposure, setExposure] = useState(1)
  const [shadeIntensity, setShadeIntensity] = useState(1) // Changed variable name
  const [brandColor, setBrandColor] = useState("#FF5E1A")

  // Publishing states
  const [isPublishing, setIsPublishing] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [embedCode, setEmbedCode] = useState("")
  const [previewLink, setPreviewLink] = useState("")

  // Add these new state variables
  const [activeTab, setActiveTab] = useState<"3d-settings" | "imagery">("3d-settings")
  const [subjectDescription, setSubjectDescription] = useState("")
  const [backgroundDescription, setBackgroundDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFurnitureType, setSelectedFurnitureType] = useState("Office")
  const [showFurnitureDropdown, setShowFurnitureDropdown] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [hoveredSuggestion, setHoveredSuggestion] = useState<number | null>(null)
  const [imageCount, setImageCount] = useState(1)
  const creditsByCount: Record<number, number> = { 1: 10, 2: 25, 3: 40, 4: 50 }
  const credits = creditsByCount[imageCount] ?? 10
  const generateLabel = `Generate (${credits} credits)`
  const [showGeneratedImages, setShowGeneratedImages] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string>("")

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

  const backgroundDescriptionRef = useRef<HTMLTextAreaElement>(null)

  // Add handler functions
  const handleGenerateBackground = () => {
    setIsGenerating(true)

    // Check if uploaded file is Mooi Sofa and user wants 4 images
    if (
      uploadedFileName.toLowerCase().includes("mooi") &&
      uploadedFileName.toLowerCase().includes("sofa") &&
      imageCount === 4
    ) {
      // Show the 4 specific Mooi sofa images
      setTimeout(() => {
        setIsGenerating(false)
        const mooiImages = ["/images/mooi-1.webp", "/images/mooi-2.webp", "/images/mooi-3.webp", "/images/mooi-4.webp"]
        setGeneratedImages(mooiImages)
        setShowGeneratedImages(true)
      }, 2000)
      return
    }

    // Check if uploaded file is Lounge Chair and user wants 4 images
    if (
      uploadedFileName.toLowerCase().includes("lounge") &&
      uploadedFileName.toLowerCase().includes("chair") &&
      imageCount === 4
    ) {
      // Show the 4 specific Lounge Chair images
      setTimeout(() => {
        setIsGenerating(false)
        const loungeChairImages = [
          "/images/lounge-chair-1.webp",
          "/images/lounge-chair-2.webp",
          "/images/lounge-chair-3.webp",
          "/images/lounge-chair-4.webp",
        ]
        setGeneratedImages(loungeChairImages)
        setShowGeneratedImages(true)
      }, 2000)
      return
    }

    if (imageCount === 4) {
      // Show the 4 specific sofa images (existing logic)
      setTimeout(() => {
        setIsGenerating(false)
        const sofaImages = [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-5mva6JR1qxOsdaSA3YU04uN06UXTyV.webp", // 1.webp
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-4nVOtmUdeDdYffEc9d3dpcUjITPudO.webp", // 2.webp
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-iH0owMMi5sv4xjc9n2mb135msxWzgi.webp", // 3.webp
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-oRHWTsHZJ4rB9yFA0YXD1RoicCniK6.webp", // 4.webp
        ]
        setGeneratedImages(sofaImages)
        setShowGeneratedImages(true)
      }, 2000)
      return
    }

    // Simulate generation process for 5 seconds (existing logic)
    setTimeout(() => {
      setIsGenerating(false)
      const images = Array.from({ length: imageCount }, () => "/placeholder.svg?height=400&width=400")
      setGeneratedImages(images)
    }, 5000)
  }

  const handleSuggestionClick = (suggestion: any) => {
    setBackgroundDescription(suggestion.description)

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

  useEffect(() => {
    import("@google/model-viewer")
  }, [])

  const handleReplace3D = () => {
    fileInputRef.current?.click()
  }

  const generateThumbnail = async () => {
    if (modelViewerRef.current) {
      const blob = await modelViewerRef.current.toBlob({
        idealAspect: true,
        slot: "poster",
        mimeType: "image/png",
        qualityArgument: 0.85,
        size: { width: 300, height: 300 },
      })
      if (blob) {
        const thumbnailUrl = URL.createObjectURL(blob)
        setProductImage(thumbnailUrl)
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.toLowerCase().endsWith(".glb")) {
      const objectUrl = URL.createObjectURL(file)
      setModelSrc(objectUrl)
      setModelLoaded(false)
      setUploadedFileName(file.name) // Add this line to capture the file name
      setTimeout(generateThumbnail, 1000)
    } else {
      alert("Please upload a .glb file")
    }
  }

  const handleProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const imageUrl = URL.createObjectURL(file)
      setProductImage(imageUrl)
    } else {
      alert("Please upload a .jpg or .png file")
    }
  }

  const allBackgroundColors = [...backgroundColors, ...(customColor ? [{ name: "Custom", value: customColor }] : [])]

  const handlePublish = () => {
    setIsPublishing(true)

    // Simulate generating embed code and preview link
    setTimeout(() => {
      const generatedId = Math.random().toString(36).substring(2, 15)
      const generatedEmbedCode = `<iframe src="https://ar.vervear.com/3d/${generatedId}" frameborder="0" width="100%" height="100%"></iframe>`
      const generatedPreviewLink = `https://ar.vervear.com/3d/${generatedId}`

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
                Copy and paste this code into the HTML code section of your webpage to embed your AR experience.
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
        <Link href="/">
          <Button size="sm" className="bg-[#ffffff] text-[#000000] hover:bg-[#f0f0f0] gap-2">
            <ArrowLeft className="h-4 w-4 text-[#000000]" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <img src="/images/vervear-logo.webp" alt="VerveAR Logo" className="h-8 w-8 rounded-full" />
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Main Content - 3D Viewer (moved to left) */}
        <div className="flex-1 p-4 relative">
          <div className="bg-[#ffffff] rounded-lg h-full relative" style={{ backgroundColor }}>
            <model-viewer
              ref={modelViewerRef as React.RefObject<HTMLElement>}
              src={modelSrc}
              camera-controls={true}
              disable-pan={true}
              disable-zoom={!isZooming}
              auto-rotate={isAutoRotate}
              rotation-per-second={`${rotationSpeed}deg`}
              ar={isAREnabled}
              ar-modes="webxr sceneviewer quick-look"
              shadow-intensity={shadeIntensity}
              shadow-softness={shadowSoftness}
              camera-orbit={viewerType === "360" ? "0deg 90deg auto" : "0deg 75deg 105%"}
              min-camera-orbit={viewerType === "360" ? "auto 90deg auto" : undefined}
              max-camera-orbit={viewerType === "360" ? "auto 90deg auto" : undefined}
              exposure={exposure}
              skybox-image={
                selectedEnvironment === "neutral"
                  ? ""
                  : `https://modelviewer.dev/shared-assets/environments/${selectedEnvironment}_bg.hdr`
              }
              environment-image={
                selectedEnvironment === "neutral"
                  ? ""
                  : `https://modelviewer.dev/shared-assets/environments/${selectedEnvironment}_bg.hdr`
              }
              autoplay={isAnimationEnabled}
              animation-name="idle"
              style={{ width: "100%", height: "100%" }}
              onError={(error: any) => console.error("Error loading 3D model:", error)}
              onLoad={() => {
                setModelLoaded(true)
                generateThumbnail()
              }}
            >
              <div slot="poster" className="flex items-center justify-center w-full h-full bg-[#f4f4f5]">
                <p className="text-[#3f3f46]">Loading 3D model...</p>
              </div>
              <div slot="error" className="flex items-center justify-center w-full h-full bg-[#f4f4f5]">
                <p className="text-[#e85618]">Error loading 3D model</p>
              </div>
              {isBuyNowEnabled && (
                <Button className="absolute bottom-4 left-4 bg-[#FF5E1A] hover:bg-[#FF5E1A]/90 text-white">
                  Buy Now
                </Button>
              )}
            </model-viewer>
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
              <Button
                variant="secondary"
                className="bg-[#18181b] text-[#ffffff] hover:bg-[#3f3f46]"
                onClick={selectedImage ? handleDownloadImage : handleReplace3D}
              >
                {selectedImage ? (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </>
                ) : (
                  "Replace 3D"
                )}
              </Button>
              <p className="text-xs text-[#3f3f46]">
                {selectedImage ? "Download the selected image" : "File supported : .glb"}
              </p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".glb" className="hidden" />
          </div>

          {/* Image Overlay */}
          {selectedImage && (
            <div className="absolute inset-4 bg-black rounded-lg flex items-center justify-center z-10">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Selected background"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={handleCloseImage}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={() => handleDownloadImage()}
                className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <Download className="h-6 w-6 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar (moved to right) */}
        <div className="w-[400px] bg-[#1f1f23] p-4 overflow-y-auto flex flex-col">
          {/* Segmented Control */}
          <div className="flex bg-[#3f3f46] rounded-lg p-1 mb-6">
            <button
              className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === "3d-settings" ? "bg-[#000000] text-[#FFFFFF]" : "text-[#C7C7C7] hover:text-[#FFFFFF]"
              }`}
              onClick={() => setActiveTab("3d-settings")}
            >
              3D Settings
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === "imagery" ? "bg-[#000000] text-[#FFFFFF]" : "text-[#C7C7C7] hover:text-[#FFFFFF]"
              }`}
              onClick={() => setActiveTab("imagery")}
            >
              Imagery
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === "3d-settings" ? (
            <Accordion type="single" collapsible className="space-y-4 flex-1 overflow-y-auto">
              <AccordionItem value="product-details" className="border-none">
                <AccordionTrigger className="hover:no-underline py-3 px-4 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="text-base font-medium">Product Details</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 px-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-[#e4e4e7]">Product Name</label>
                      <Input placeholder="Yeezy Mauve" className="bg-[#18181b] border-[#3f3f46] h-10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-[#e4e4e7]">Link to product on your website</label>
                      <Input
                        placeholder="https://stayhomebody.com/products/luxe-armless-"
                        className="bg-[#18181b] border-[#3f3f46] h-10"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="product-assets" className="border-none">
                <AccordionTrigger className="hover:no-underline py-3 px-4 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-base font-medium">Product Assets</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 px-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm text-[#e4e4e7] mb-2">Product Image</h3>
                      <div className="bg-[#18181b] rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 bg-[#ffffff] rounded-lg flex items-center justify-center overflow-hidden">
                            {productImage ? (
                              <img
                                src={productImage || "/placeholder.svg"}
                                alt="Product preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[#18181b] text-xs font-medium">NO IMAGE</span>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col items-end justify-center gap-2 h-full">
                            <Button
                              variant="outline"
                              className="bg-[#3f3f46] text-[#ffffff] hover:bg-[#3f3f46]/90 rounded-lg h-9 px-3 text-sm"
                              onClick={() => document.getElementById("product-image-upload")?.click()}
                            >
                              Choose file
                            </Button>
                            <p className="text-xs text-[#e4e4e7] text-right">File supported : jpg or .png</p>
                          </div>
                        </div>
                        <input
                          type="file"
                          id="product-image-upload"
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleProductImageUpload}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="product-experience" className="border-none">
                <AccordionTrigger className="hover:no-underline py-3 px-4 hover:bg-white/5 rounded-lg sticky top-0 bg-[#1f1f23] z-10">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    <span className="text-base font-medium">Product Experience</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 px-4">
                  <div className="space-y-6">
                    {/* 360° Viewer Section */}
                    <div className="bg-[#18181b] rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[#1f1f23] rounded-lg flex items-center justify-center">
                          <RotateCw className="w-6 h-6 text-[#FF5E1A]" />
                        </div>
                        <span className="text-base font-normal">360° Viewer</span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[#e4e4e7]">Viewer Type</span>
                          <div className="flex bg-[#3f3f46] rounded-lg p-1">
                            <button
                              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                viewerType === "3D"
                                  ? "bg-[#000000] text-[#FFFFFF]"
                                  : "text-[#C7C7C7] hover:text-[#FFFFFF]"
                              }`}
                              onClick={() => setViewerType("3D")}
                            >
                              3D
                            </button>
                            <button
                              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                viewerType === "360"
                                  ? "bg-[#000000] text-[#FFFFFF]"
                                  : "text-[#C7C7C7] hover:text-[#FFFFFF]"
                              }`}
                              onClick={() => setViewerType("360")}
                            >
                              360°
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#e4e4e7]">Zooming</span>
                          <div className="flex bg-[#3f3f46] rounded-lg p-1">
                            <button
                              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                isZooming ? "bg-[#000000] text-[#FFFFFF]" : "text-[#C7C7C7] hover:text-[#FFFFFF]"
                              }`}
                              onClick={() => setIsZooming(true)}
                            >
                              Yes
                            </button>
                            <button
                              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                !isZooming ? "bg-[#000000] text-[#FFFFFF]" : "text-[#C7C7C7] hover:text-[#FFFFFF]"
                              }`}
                              onClick={() => setIsZooming(false)}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#e4e4e7]">Auto-Rotate</span>
                          <div className="flex bg-[#3f3f46] rounded-lg p-1">
                            <button
                              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                isAutoRotate ? "bg-[#000000] text-[#FFFFFF]" : "text-[#C7C7C7] hover:text-[#FFFFFF]"
                              }`}
                              onClick={() => setIsAutoRotate(true)}
                            >
                              Yes
                            </button>
                            <button
                              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                !isAutoRotate ? "bg-[#000000] text-[#FFFFFF]" : "text-[#C7C7C7] hover:text-[#FFFFFF]"
                              }`}
                              onClick={() => setIsAutoRotate(false)}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        {isAutoRotate && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[#e4e4e7]">Rotation Speed</span>
                              <span className="text-[#e4e4e7] text-sm">{rotationSpeed}°/s</span>
                            </div>
                            <Slider
                              value={[rotationSpeed]}
                              onValueChange={(value) => setRotationSpeed(value[0])}
                              max={100}
                              step={1}
                              className="[&_[role=slider]]:bg-[#FF5E1A]"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Animation Section */}
                    <div className="bg-[#18181b] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#1f1f23] rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-[#FF5E1A]" />
                          </div>
                          <span className="text-base font-normal">Animation</span>
                        </div>
                        <Switch
                          checked={isAnimationEnabled}
                          onCheckedChange={setIsAnimationEnabled}
                          className="data-[state=checked]:bg-[#FF5E1A]"
                        />
                      </div>
                    </div>

                    {/* Augmented Reality Section */}
                    <div className="bg-[#18181b] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#1f1f23] rounded-lg flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"
                                stroke="#FF5E1A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 22V12"
                                stroke="#FF5E1A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M22 8.5L12 12L2 8.5"
                                stroke="#FF5E1A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M17 5.5L7 11"
                                stroke="#FF5E1A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="text-base font-normal">Augmented Reality</span>
                        </div>
                        <Switch
                          checked={isAREnabled}
                          onCheckedChange={setIsAREnabled}
                          className="data-[state=checked]:bg-[#FF5E1A]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#e4e4e7]">Size Control</span>
                        <div className="flex bg-[#3f3f46] rounded-lg p-1">
                          <button
                            className={`px-4 py-2 text-sm rounded-md transition-colors ${
                              isSizeControl ? "bg-[#000000] text-[#FFFFFF]" : "text-[#C7C7C7] hover:text-[#FFFFFF]"
                            }`}
                            onClick={() => setIsSizeControl(true)}
                          >
                            Yes
                          </button>
                          <button
                            className={`px-4 py-2 text-sm rounded-md transition-colors ${
                              !isSizeControl ? "bg-[#000000] text-[#FFFFFF]" : "text-[#C7C7C7] hover:text-[#FFFFFF]"
                            }`}
                            onClick={() => setIsSizeControl(false)}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* "Buy Now" Button Section */}
                    <div className="bg-[#18181b] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#1f1f23] rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-[#FF5E1A]" />
                          </div>
                          <span className="text-base font-normal">"Buy Now" Button</span>
                        </div>
                        <Switch
                          checked={isBuyNowEnabled}
                          onCheckedChange={setIsBuyNowEnabled}
                          className="data-[state=checked]:bg-[#FF5E1A]"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="background-colour" className="border-none">
                <AccordionTrigger className="hover:no-underline py-3 px-4 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span className="text-base font-medium">Background Colour</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 px-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    {allBackgroundColors.map((color) => (
                      <button
                        key={color.value}
                        className={`w-8 h-8 rounded-md border ${
                          backgroundColor === color.value ? "border-[#FF5E1A]" : "border-transparent"
                        }`}
                        style={{
                          background:
                            color.value === "transparent"
                              ? "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 6px 6px"
                              : color.value,
                        }}
                        onClick={() => setBackgroundColor(color.value)}
                        aria-label={`Set background color to ${color.name}`}
                      />
                    ))}
                    <button
                      className="w-8 h-8 rounded-md border border-dashed border-[#3f3f46] flex items-center justify-center text-[#3f3f46] hover:text-[#FF5E1A] hover:border-[#FF5E1A] relative overflow-hidden"
                      aria-label="Open color picker"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      <input
                        type="color"
                        value={customColor || "#ffffff"}
                        onChange={(e) => {
                          setCustomColor(e.target.value)
                          setBackgroundColor(e.target.value)
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="environment" className="border-none">
                <AccordionTrigger className="hover:no-underline py-3 px-4 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    <span className="text-base font-medium">Environment</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 px-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-[#e4e4e7]" />
                          <span className="text-[#e4e4e7]">Exposure</span>
                        </div>
                        <span className="text-[#e4e4e7] text-sm">{exposure.toFixed(1)}</span>
                      </div>
                      <Slider
                        value={[exposure]}
                        onValueChange={(value) => setExposure(value[0])}
                        min={0}
                        max={2}
                        step={0.1}
                        className="[&_[role=slider]]:bg-[#FF5E1A]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 text-[#e4e4e7]" />
                          <span className="text-[#e4e4e7]">Shadow Intensity</span>
                        </div>
                        <span className="text-[#e4e4e7] text-sm">{shadeIntensity.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[shadeIntensity]}
                        onValueChange={(value) => setShadeIntensity(value[0])}
                        min={0}
                        max={2}
                        step={0.01}
                        className="[&_[role=slider]]:bg-[#FF5E1A]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 text-[#e4e4e7]" />
                          <span className="text-[#e4e4e7]">Shadow Softness</span>
                        </div>
                        <span className="text-[#e4e4e7] text-sm">{shadowSoftness.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[shadowSoftness]}
                        onValueChange={(value) => setShadowSoftness(value[0])}
                        min={0}
                        max={1}
                        step={0.01}
                        className="[&_[role=slider]]:bg-[#FF5E1A]"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="customize-branding" className="border-none">
                <AccordionTrigger className="hover:no-underline py-3 px-4 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brush className="w-4 h-4" />
                    <span className="text-base font-medium">Customize Branding</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Watermark Section */}
                    <div className="bg-[#18181b] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#1f1f23] rounded-lg flex items-center justify-center">
                            <img src="/VerveAR Logo.png" alt="VerveAR Logo" className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-base font-normal text-white">Remove VerveAR Watermark</span>
                            <Button size="sm" className="bg-[#ff5e1a] hover:bg-[#ff5e1a]/90 h-6 px-2 text-xs">
                              UPGRADE
                            </Button>
                          </div>
                        </div>
                        <Switch className="data-[state=checked]:bg-[#ff5e1a]" />
                      </div>
                    </div>

                    {/* Brand Color Section */}
                    <div className="bg-[#18181b] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#1f1f23] rounded-lg flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_12003_328)">
                                <g opacity="0.2">
                                  <path
                                    d="M12.7098 7.12705C17.2698 8.34865 20.0358 12.8535 18.8718 17.2011C17.559 22.0971 11.3142 26.0139 8.21335 22.6731C7.22575 21.6099 6.97135 20.4411 7.14535 18.8811C7.17535 18.6111 7.20055 18.4347 7.28095 17.9283C7.47535 16.6899 7.47295 16.2003 7.21615 15.7827C6.96775 15.3795 6.52255 15.2751 5.20255 15.2595L5.07295 15.2571C3.21535 15.2307 2.31295 14.9211 1.85455 13.6215C0.330553 9.31465 7.58935 5.75425 12.7098 7.12705Z"
                                    fill="#FF5E1A"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16.6146 5.31432C16.0002 5.29032 15.4362 4.90872 15.0474 4.17912C14.379 2.92152 14.2326 1.09872 15.1806 0.594719C16.1286 0.0907188 17.5566 1.23072 18.2262 2.48952C18.5862 3.16752 18.6126 3.80472 18.3546 4.31112C18.5884 4.42917 18.7772 4.62051 18.8922 4.85592L23.8038 14.9359C23.8858 15.1171 23.8957 15.3227 23.8315 15.511C23.7674 15.6992 23.6339 15.856 23.4583 15.9493C23.2827 16.0427 23.0782 16.0657 22.8862 16.0137C22.6943 15.9616 22.5293 15.8384 22.425 15.6691L16.7754 5.98512C16.6573 5.78207 16.6014 5.54884 16.6146 5.31432Z"
                                    fill="#FF5E1A"
                                  />
                                </g>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M17.6684 15.9979C18.8324 11.6503 16.0652 7.14553 11.5064 5.92393C6.38595 4.55113 -0.871645 8.11153 0.651155 12.4171C1.11075 13.7179 2.01195 14.0263 3.86955 14.0527L3.99915 14.0551C5.31915 14.0707 5.76435 14.1751 6.01275 14.5783C6.26955 14.9959 6.27195 15.4855 6.07755 16.7239C5.99715 17.2303 5.97195 17.4067 5.94195 17.6767C5.76795 19.2367 6.02235 20.4055 7.00995 21.4687C10.1108 24.8095 16.3556 20.8939 17.6684 15.9979ZM1.78155 12.0175C0.691955 8.93353 6.84195 5.91673 11.1956 7.08313C15.128 8.13673 17.498 11.9947 16.5092 15.6871C15.4004 19.8223 10.1648 23.1055 7.88955 20.6551C7.17675 19.8871 6.99555 19.0555 7.13355 17.8111C7.16235 17.5651 7.18635 17.3983 7.26315 16.9111C7.50315 15.3811 7.49955 14.7079 7.03515 13.9507C6.47715 13.0435 5.76435 12.8779 4.01475 12.8563L3.88635 12.8539C2.49555 12.8347 2.01195 12.6691 1.78155 12.0175Z"
                                  fill="#FF5E1A"
                                />
                                <path
                                  d="M5.69531 11.3998C5.29749 11.3998 4.91596 11.2418 4.63465 10.9605C4.35335 10.6792 4.19531 10.2977 4.19531 9.89984C4.19531 9.50201 4.35335 9.12048 4.63465 8.83918C4.91596 8.55787 5.29749 8.39984 5.69531 8.39984C6.09314 8.39984 6.47467 8.55787 6.75597 8.83918C7.03728 9.12048 7.19531 9.50201 7.19531 9.89984C7.19531 10.2977 7.03728 10.6792 6.75597 10.9605C6.47467 11.2418 6.09314 11.3998 5.69531 11.3998ZM10.4953 11.3998C10.0975 11.3998 9.71596 11.2418 9.43465 10.9605C9.15335 10.6792 8.99531 10.2977 8.99531 9.89984C8.99531 9.50201 9.15335 9.12048 9.43465 8.83918C9.71596 8.55787 10.0975 8.39984 10.4953 8.39984C10.8931 8.39984 11.2747 8.55787 11.556 8.83918C11.8373 9.12048 11.9953 9.50201 11.9953 9.89984C11.9953 10.2977 11.8373 10.6792 11.556 10.9605C11.2747 11.2418 10.8931 11.3998 10.4953 11.3998ZM13.4953 14.9998C13.0975 14.9998 12.716 14.8418 12.4347 14.5605C12.1533 14.2792 11.9953 13.8977 11.9953 13.4998C11.9953 13.102 12.1533 12.7205 12.4347 12.4392C12.716 12.1579 13.0975 11.9998 13.4953 11.9998C13.8931 11.9998 14.2747 12.1579 14.556 12.4392C14.8373 12.7205 14.9953 13.102 14.9953 13.4998C14.9953 13.8977 14.8373 14.2792 14.556 14.5605C14.2747 14.8418 13.8931 14.9998 13.4953 14.9998ZM11.6953 19.1998C11.2975 19.1998 10.916 19.0418 10.6347 18.7605C10.3533 18.4792 10.1953 18.0977 10.1953 17.6998C10.1953 17.302 10.3533 16.9205 10.6347 16.6392C10.916 16.3579 11.2975 16.1998 11.6953 16.1998C12.0931 16.1998 12.4747 16.3579 12.756 16.6392C13.0373 16.9205 13.1953 17.302 13.1953 17.6998C13.1953 18.0977 13.0373 18.4792 12.756 18.7605C12.4747 19.0418 12.0931 19.1998 11.6953 19.1998ZM16.0393 4.32584C16.1816 4.24961 16.3378 4.20287 16.4986 4.18841C16.6593 4.17396 16.8214 4.19209 16.975 4.24172C17.1286 4.29136 17.2706 4.37147 17.3925 4.47726C17.5144 4.58306 17.6137 4.71236 17.6845 4.85744L22.5961 14.9374C22.6781 15.1186 22.688 15.3242 22.6239 15.5125C22.5597 15.7007 22.4263 15.8575 22.2507 15.9509C22.0751 16.0442 21.8705 16.0672 21.6786 16.0152C21.4866 15.9631 21.3217 15.8399 21.2173 15.6706L15.5677 5.98664C15.4868 5.84724 15.4349 5.69299 15.4149 5.53307C15.3949 5.37316 15.4074 5.21086 15.4515 5.05586C15.4956 4.90086 15.5705 4.75634 15.6717 4.63092C15.7729 4.50549 15.8983 4.40174 16.0405 4.32584"
                                  fill="#FF5E1A"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M13.8453 4.17862C14.4285 5.27662 15.4113 5.58382 16.3617 5.07862C17.3109 4.57462 17.6073 3.58702 17.0229 2.48902C16.3557 1.23142 14.9253 0.0914205 13.9773 0.594221C13.0293 1.09702 13.1757 2.92102 13.8453 4.17862ZM14.9037 3.61462C14.6921 3.18759 14.5619 2.72491 14.5197 2.25022C14.5022 2.05169 14.5094 1.85175 14.5413 1.65502L14.5629 1.66582C14.6229 1.69462 14.8089 1.78102 15.0465 1.97062C15.4089 2.25982 15.7689 2.68582 15.9633 3.05182C16.2381 3.56782 16.1601 3.82702 15.7977 4.02022C15.4377 4.21222 15.1785 4.13062 14.9037 3.61582"
                                  fill="#FF5E1A"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_12003_328">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div className="space-y-1">
                            <span className="text-base font-normal text-white">Custom Brand Colour</span>
                            <Button size="sm" className="bg-[#ff5e1a] hover:bg-[#ff5e1a]/90 h-7">
                              UPGRADE
                            </Button>
                          </div>
                        </div>
                        <Switch className="data-[state=checked]:bg-[#ff5e1a]" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-[#e4e4e7]">Pick your brand colour</label>
                        <div className="flex items-center gap-2 bg-[#1f1f23] rounded-lg p-2 border border-[#3f3f46]">
                          <div
                            className="w-8 h-8 rounded relative cursor-pointer"
                            style={{ backgroundColor: brandColor }}
                            onClick={() => document.getElementById("brand-color-picker")?.click()}
                          >
                            <input
                              id="brand-color-picker"
                              type="color"
                              value={brandColor}
                              onChange={(e) => {
                                setBrandColor(e.target.value)
                              }}
                              className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={brandColor.toUpperCase()}
                            className="bg-transparent border-none text-white focus:outline-none flex-1"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            /* Imagery Tab Content */
            <div className="space-y-6 flex-1 overflow-y-auto">
              {/* Replace Background Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#FF5E1A] rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Generate background</h2>
              </div>

              {/* Furniture Type Selector */}
              <div className="space-y-3">
                <label className="text-white font-medium">What kind of furniture is this?</label>
                <div className="relative">
                  <button
                    className="w-full bg-[#18181b] border border-[#3f3f46] rounded-lg p-3 text-white text-left flex items-center justify-between focus:outline-none transition-all duration-200"
                    onClick={() => setShowFurnitureDropdown(!showFurnitureDropdown)}
                  >
                    <span>{selectedFurnitureType}</span>
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
                <label className="text-white font-medium">Describe the background you want</label>
                <textarea
                  ref={backgroundDescriptionRef}
                  placeholder="e.g. in a sunny park, grass, bench under a tree, professional ad photography"
                  className="w-full bg-[#18181b] rounded-lg p-3 text-white placeholder:text-[#71717a] min-h-[80px] resize-none outline-none focus:outline-none border-0 focus:border-0 ring-0 focus:ring-0 focus:ring-offset-0 text-sm"
                  style={{ fontSize: "14px" }}
                  value={backgroundDescription}
                  onChange={(e) => setBackgroundDescription(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-white font-medium">Number of images:</label>
                <div className="flex flex-wrap gap-2">
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
                disabled={isGenerating}
                onClick={handleGenerateBackground}
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

              {/* Generated Images */}
              {generatedImages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Generated Backgrounds</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {generatedImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-[#FF5E1A] transition-all cursor-pointer"
                        onMouseEnter={() => setHoveredImageIndex(index)}
                        onMouseLeave={() => setHoveredImageIndex(null)}
                        onClick={() => handleImageClick(imageUrl)}
                      >
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Generated background ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {hoveredImageIndex === index && (
                          <button
                            className="absolute bottom-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadImage(imageUrl)
                            }}
                          >
                            <Download className="h-4 w-4 text-white" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div className="space-y-4 suggestions-container">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Suggested Styles</h3>
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
                <div className="space-y-3">
                  {suggestions.slice(0, showAllSuggestions ? suggestions.length : 6).map((suggestion, index) => (
                    <div key={index} className="relative" style={{ position: "relative" }}>
                      <button
                        className="suggestion-button flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#18181b] transition-colors text-left"
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setHoveredSuggestion(index)}
                        onMouseLeave={() => setHoveredSuggestion(null)}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={suggestion.image || "/placeholder.svg"}
                            alt={suggestion.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium mb-1">{suggestion.name}</h4>
                          <p className="text-[#71717a] text-sm line-clamp-2">{suggestion.description}</p>
                        </div>
                      </button>

                      {/* Hover Card with Dissolve Animation */}
                      {hoveredSuggestion === index &&
                        (() => {
                          const buttons = document.querySelectorAll(".suggestion-button")
                          const currentButton = buttons[index]
                          let rect = { left: 0, top: 0, height: 0 }

                          if (currentButton) {
                            const buttonRect = currentButton.getBoundingClientRect()
                            rect = {
                              left: buttonRect.left,
                              top: buttonRect.top + buttonRect.height / 2,
                              height: buttonRect.height,
                            }
                          }

                          return (
                            <div
                              className="fixed w-56 bg-[#2a2a2a] rounded-xl p-3 shadow-2xl border border-[#3f3f46] pointer-events-none z-[9999] opacity-0 animate-[dissolve_0.3s_ease-out_forwards]"
                              style={{
                                left: `${rect.left - 224 - 16}px`, // Position to the left of the button
                                top: `${rect.top}px`,
                                transform: "translateY(-50%)",
                              }}
                            >
                              <div className="relative">
                                {/* Arrow icon in top right */}
                                <div className="absolute top-1 right-1 w-5 h-5 bg-black/20 rounded-full flex items-center justify-center">
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M7 17L17 7M17 7H7M17 7V17"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>

                                {/* Preview Image */}
                                <div className="w-full h-32 bg-[#1a1a1a] rounded-lg overflow-hidden mb-3">
                                  <img
                                    src={suggestion.image || "/placeholder.svg"}
                                    alt={`${suggestion.name} preview`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                {/* Description */}
                                <p className="text-white text-xs leading-relaxed">{suggestion.description}</p>
                              </div>
                            </div>
                          )
                        })()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
