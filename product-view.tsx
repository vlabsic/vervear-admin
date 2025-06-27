"use client"

import { useState, useEffect, useRef } from "react"
import { Glasses } from "lucide-react"
import Image from "next/image"
import Script from "next/script"

// Update the products array to include all eight products
const products = [
  {
    id: 1,
    name: "Gucci Fuischa",
    description: "Fuischa Flower glasses",
    price: 450.0,
    image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166879/image_168_deayxg.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.%20Gucci%20Fuschia%20and%20Black%20Frames-W5mqIjw9VMCl0Th9UznHcB0XYa1d1S.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f8f536a00d6990d91f06a",
  },
  {
    id: 2,
    name: "Gucci Tortoise",
    description: "Tortoise Blue and Red frames",
    price: 475.0,
    image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166879/image_169_or2dyq.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.%20Gucci%20Tortoise_Blue%20and%20Red%20Frames-vlTPXEwiOwcQPmWluY7I05zM9JKSov.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f8f8a6a00d6990d91f070",
  },
  {
    id: 3,
    name: "Gucci Tortoise Green",
    description: "Tortoise Green and Red frames",
    price: 485.0,
    image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166880/image_170_dntgz1.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.%20Gucci%20Tortoise_Green%20and%20Red%20Frames-nHHtVysh5jrLLtQU0AAs6ZKrhj324d.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f8fb76a00d6990d91f076",
  },
  {
    id: 4,
    name: "Gucci Black Tortoise",
    description: "Black and Tortoise frames",
    price: 495.0,
    image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166286/image_176_z19uly.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9.1_gucci_black_and_tortoise_frames-RXW3R9jd9sZj2G2rTl7RuwFxvVygzQ.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f930a6a00d6990d91f0a1",
  },
  {
    id: 5,
    name: "Gucci Pink Orange",
    description: "Pink and Orange frames",
    price: 505.0,
    image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166882/image_172_clcgwg.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5._gucci_pink_and_orange_frames-1UuK9zlAzNW49PLF9FtlBa334oYAJi.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f912d6a00d6990d91f088",
  },
  {
    id: 6,
    name: "Gucci Red",
    description: "Red designer frames",
    price: 515.0,
    image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166292/model-snapshot_10_1_moxtcb.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red%20Gucci%20Test-JGnRYJl2mSg65dqBtxG2QIqoOK3rkr.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f8d8a6a00d6990d91f04a",
  },
  {
    id: 7,
    name: "Gucci Square",
    description: "Square designer frames",
    price: 525.0,
    image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166291/model-snapshot_7_1_rfvydz.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/173._gucci_square_frames-Pc3uFZhVozTWqQTYICDVp8DLTivMOw.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f8cc86a00d6990d91f03c",
  },
  {
    id: 8,
    name: "Gucci Blue Black",
    description: "Blue and Black designer frames",
    price: 535.0,
    image: "https://res.cloudinary.com/drnavq85s/image/upload/v1737333905/10._Gucci_Blue_and_Black_Frames_hzdjkj.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10.%20Gucci%20Blue%20and%20Black%20Frames-D8dm3GV3uLIvHCiB39ftTk168Jc5Ou.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/678d988cffaded27beffa877",
  },
]

// Improved 360 icon component
const Icon360 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20" opacity="0.5" />
    <path d="M2 12h20" opacity="0.5" />
    <path d="M12 2c-2.5 2.5-5 7-5 10s2.5 7.5 5 10c2.5-2.5 5-7 5-10S14.5 4.5 12 2z" />
    <path d="M12 2c-2.5 2.5-5 5.5-5 10s2.5 7.5 5 10c2.5-2.5 5-5.5 5-10S14.5 4.5 12 2z" opacity="0.3" />
    <path d="M7 12c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5z" />
    <path d="M12 9v6" />
    <path d="M9 12h6" />
  </svg>
)

export default function ProductView() {
  const [viewMode, setViewMode] = useState<"360" | "try-on">("360")
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle camera permission for Try-On view
  useEffect(() => {
    if (viewMode === "try-on") {
      // Request camera access when switching to try-on mode
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Camera access granted, clean up the stream
          stream.getTracks().forEach((track) => track.stop())
        })
        .catch((err) => {
          console.error("Camera access denied:", err)
        })
    }
  }, [viewMode])

  return (
    <>
      {/* Load Model Viewer script */}
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        onLoad={() => setModelViewerLoaded(true)}
      />

      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex flex-col w-full min-h-screen bg-[#ffffff]" style={{ fontFamily: "Sohne, sans-serif" }}>
          {/* AR Viewer - Full width on mobile */}
          <div className="w-full h-[calc(100vh-300px)] bg-[#f2f2f2] flex flex-col items-center justify-center relative">
            {/* View mode toggle */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex rounded-full bg-[#c6c6c6] p-1 w-[280px]">
                <button
                  onClick={() => setViewMode("360")}
                  className={`flex items-center justify-center gap-1 py-2 px-4 rounded-full w-1/2 transition-colors ${
                    viewMode === "360" ? "bg-[#ffffff] text-[#ff5e1a]" : "bg-transparent text-[#ffffff]"
                  }`}
                  style={{ fontFamily: "Sohne, sans-serif" }}
                >
                  <Icon360 className="w-4 h-4" />
                  <span className="font-medium whitespace-nowrap">360°</span>
                </button>
                <button
                  onClick={() => setViewMode("try-on")}
                  className={`flex items-center justify-center gap-1 py-2 px-4 rounded-full w-1/2 transition-colors ${
                    viewMode === "try-on" ? "bg-[#ffffff] text-[#ff5e1a]" : "bg-transparent text-[#ffffff]"
                  }`}
                  style={{ fontFamily: "Sohne, sans-serif" }}
                >
                  <Glasses className="w-4 h-4" />
                  <span className="font-medium whitespace-nowrap">TRY-ON</span>
                </button>
              </div>
            </div>

            {/* Viewer content */}
            <div className="w-full h-full flex items-center justify-center">
              {viewMode === "360" ? (
                <div className="w-full h-full flex items-center justify-center">
                  {modelViewerLoaded ? (
                    <model-viewer
                      src={selectedProduct.modelUrl}
                      alt={`${selectedProduct.name} 3D model`}
                      camera-controls
                      auto-rotate
                      ar
                      exposure="0.5"
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: "100%", height: "100%", backgroundColor: "#F2F2F2" }}
                    ></model-viewer>
                  ) : (
                    <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                      Loading 3D model...
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full">
                  <iframe
                    ref={iframeRef}
                    src={selectedProduct.tryOnUrl}
                    title="VerveAR Virtual Try-On"
                    className="w-full h-full border-0"
                    allow="camera; microphone; accelerometer; gyroscope"
                  ></iframe>
                </div>
              )}
            </div>
          </div>

          {/* Product Info - Mobile height */}
          <div
            className="w-full h-[300px] p-6 flex flex-col justify-between"
            style={{ fontFamily: "Sohne, sans-serif" }}
          >
            <div>
              <h1 className="text-[24px] font-bold text-[#000000] mb-1" style={{ fontFamily: "Sohne, sans-serif" }}>
                {selectedProduct.name}
              </h1>
              <p className="text-[18px] text-[#9b9b9b]" style={{ fontFamily: "Sohne, sans-serif" }}>
                {selectedProduct.description}
              </p>
            </div>

            {/* Thumbnails - horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-3 -mx-2">
              <div className="flex gap-3 px-4 py-2">
                {Array.from({ length: 12 }).map((_, index) => {
                  // First eight thumbnails are actual products, rest are placeholders
                  const isProduct = index < products.length
                  const product = isProduct ? products[index] : null
                  const isSelected = isProduct && selectedProduct.id === product?.id

                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-[67px] h-[70px] bg-[#f2f2f2] rounded-md overflow-hidden flex items-center justify-center ${
                        isProduct ? "cursor-pointer" : ""
                      } ${isSelected ? "ring-2 ring-[#FF5E1A] ring-offset-1" : ""}`}
                      onClick={() => isProduct && setSelectedProduct(product)}
                    >
                      {isProduct ? (
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={`${product.name} view`}
                          width={160}
                          height={160}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <Image
                          src="/placeholder.svg?height=160&width=160"
                          alt={`Glasses view ${index + 1}`}
                          width={160}
                          height={160}
                          className="object-contain w-full h-full"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Buy button */}
            <div>
              <button
                className="w-full bg-[#ff5e1a] text-white px-6 rounded-lg flex items-center justify-between"
                style={{ fontFamily: "Sohne, sans-serif", height: "50px" }}
              >
                <span className="text-xl font-medium">Buy Now</span>
                <span className="text-xl font-medium">$ {selectedProduct.price.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Desktop/Tablet Layout
        <div className="flex flex-row w-full min-h-screen bg-[#ffffff]" style={{ fontFamily: "Sohne, sans-serif" }}>
          {/* Left side - AR Viewer */}
          <div className="w-3/5 bg-[#f2f2f2] flex flex-col items-center justify-center relative">
            {/* View mode toggle */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex rounded-full bg-[#c6c6c6] p-1 w-[350px]">
                <button
                  onClick={() => setViewMode("360")}
                  className={`flex items-center justify-center gap-2 py-2 px-6 rounded-full w-1/2 transition-colors ${
                    viewMode === "360" ? "bg-[#ffffff] text-[#ff5e1a]" : "bg-transparent text-[#ffffff]"
                  }`}
                  style={{ fontFamily: "Sohne, sans-serif" }}
                >
                  <Icon360 className="w-5 h-5" />
                  <span className="font-medium">360°</span>
                </button>
                <button
                  onClick={() => setViewMode("try-on")}
                  className={`flex items-center justify-center gap-2 py-2 px-6 rounded-full w-1/2 transition-colors ${
                    viewMode === "try-on" ? "bg-[#ffffff] text-[#ff5e1a]" : "bg-transparent text-[#ffffff]"
                  }`}
                  style={{ fontFamily: "Sohne, sans-serif" }}
                >
                  <Glasses className="w-5 h-5" />
                  <span className="font-medium">TRY-ON</span>
                </button>
              </div>
            </div>

            {/* Viewer content */}
            <div className="w-full h-full flex items-center justify-center">
              {viewMode === "360" ? (
                <div className="w-full h-full flex items-center justify-center">
                  {modelViewerLoaded ? (
                    <model-viewer
                      src={selectedProduct.modelUrl}
                      alt={`${selectedProduct.name} 3D model`}
                      camera-controls
                      auto-rotate
                      ar
                      exposure="0.5"
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: "100%", height: "100%", backgroundColor: "#F2F2F2" }}
                    ></model-viewer>
                  ) : (
                    <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                      Loading 3D model...
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full">
                  <iframe
                    ref={iframeRef}
                    src={selectedProduct.tryOnUrl}
                    title="VerveAR Virtual Try-On"
                    className="w-full h-full border-0"
                    allow="camera; microphone; accelerometer; gyroscope"
                  ></iframe>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Product Info */}
          <div className="w-2/5 p-8 flex flex-col" style={{ fontFamily: "Sohne, sans-serif" }}>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#000000] mb-2" style={{ fontFamily: "Sohne, sans-serif" }}>
                {selectedProduct.name}
              </h1>
              <p className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                {selectedProduct.description}
              </p>
            </div>

            {/* Thumbnails grid */}
            <div className="grid grid-cols-4 gap-4 mb-auto">
              {Array.from({ length: 12 }).map((_, index) => {
                // First eight thumbnails are actual products, rest are placeholders
                const isProduct = index < products.length
                const product = isProduct ? products[index] : null
                const isSelected = isProduct && selectedProduct.id === product?.id

                return (
                  <div
                    key={index}
                    className={`aspect-square bg-[#f2f2f2] rounded-md overflow-hidden flex items-center justify-center ${
                      isProduct ? "cursor-pointer" : ""
                    } ${isSelected ? "ring-2 ring-[#FF5E1A]" : ""}`}
                    onClick={() => isProduct && setSelectedProduct(product)}
                  >
                    {isProduct ? (
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={`${product.name} view`}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <Image
                        src="/placeholder.svg?height=160&width=160"
                        alt={`Glasses view ${index + 1}`}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full"
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Buy button */}
            <div className="mt-8">
              <button
                className="w-full bg-[#ff5e1a] text-white py-4 px-6 rounded-lg flex items-center justify-between"
                style={{ fontFamily: "Sohne, sans-serif" }}
              >
                <span className="text-xl font-medium">Buy Now</span>
                <span className="text-xl font-medium">$ {selectedProduct.price.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
