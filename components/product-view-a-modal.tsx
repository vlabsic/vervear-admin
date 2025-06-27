"use client"
import { useState, useEffect, useRef } from "react"
import { Glasses, AlertCircle } from "lucide-react"
import Image from "next/image"
import Script from "next/script"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  modelUrl: string
  tryOnUrl: string
  colorOptions?: { name: string; color: string }[]
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "HydroEdge Celerity",
    description: "Blue Mirrored / Brown Lens / Navy Frame",
    price: 14.4,
    image: "/images/hydrogen-celerity.webp",
    modelUrl: "/models/hydroedge-celerity-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685b4e935054254d580224b8",
    colorOptions: [
      { name: "Blue Mirrored", color: "#2770e5" },
      { name: "Teal Green", color: "#20b2aa" },
    ],
  },
  {
    id: 2,
    name: "Antifog S2",
    description: "Silver Mirror / Smoke Lens / Kelly Green Frame",
    price: 14.4,
    image: "/images/antifog-s2.webp",
    modelUrl: "/models/antifog-s2-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685b59e85054254d58030ed3",
    colorOptions: [
      { name: "Silver Mirror", color: "#c0c0c0" },
      { name: "Kelly Green", color: "#4cbb17" },
    ],
  },
  {
    id: 3,
    name: "Antifog S3 Mirrored",
    description: "Blue Mirror Smoke Lens/Magenta Frame",
    price: 14.4,
    image: "/images/antifog-s3-mirrored.webp",
    modelUrl: "/models/antifog-s2-mirrored-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685b51cc5054254d58026292",
    colorOptions: [
      { name: "Blue Mirror", color: "#2770e5" },
      { name: "Magenta", color: "#ff1493" },
    ],
  },
  {
    id: 4,
    name: "Women's Vanquisher 3.0",
    description: "Hawaiian Sky/Grey/Silver Mirror",
    price: 14.4,
    image: "/images/womens-vanquisher.webp",
    modelUrl: "/models/womens-vanquisher-3-mirrored-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685e4d615054254d5816f260",
    colorOptions: [
      { name: "Hawaiian Sky", color: "#87ceeb" },
      { name: "Silver Mirror", color: "#c0c0c0" },
    ],
  },
]

// Improved 360 icon component
const Icon360 = ({ className }: { className?: string }) => (
  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12.7456 22.9877C9.83761 22.6015 7.44076 21.8063 5.55508 20.6022C3.6694 19.3981 2.72656 18.0122 2.72656 16.4446C2.72656 14.5589 4.03881 12.9518 6.66331 11.6232C9.28781 10.2946 12.5194 9.62982 16.358 9.62891C20.1966 9.628 23.4286 10.2928 26.054 11.6232C28.6794 12.9536 29.9912 14.5608 29.9894 16.4446C29.9894 17.7169 29.3705 18.8701 28.1328 19.9043C26.895 20.9384 25.2534 21.7504 23.2077 22.3402C22.8442 22.4538 22.5207 22.4029 22.2372 22.1875C21.9537 21.9721 21.8114 21.6818 21.8105 21.3165C21.8105 20.9075 21.93 20.544 22.169 20.226C22.408 19.9079 22.7202 19.6807 23.1055 19.5444C24.4687 19.09 25.5024 18.5734 26.2067 17.9945C26.9109 17.4156 27.2631 16.899 27.2631 16.4446C27.2631 15.7176 26.2916 14.8543 24.3487 13.8546C22.4058 12.855 19.7422 12.3552 16.358 12.3552C12.9737 12.3552 10.3097 12.855 8.36588 13.8546C6.42204 14.8543 5.45103 15.7176 5.45284 16.4446C5.45284 16.9899 6.03218 17.6433 7.19085 18.4048C8.34952 19.1663 9.99665 19.7398 12.1322 20.1251L11.3143 19.3072C11.0644 19.0573 10.9395 18.7392 10.9395 18.353C10.9395 17.9668 11.0644 17.6487 11.3143 17.3988C11.5643 17.1489 11.8823 17.0239 12.2685 17.0239C12.6548 17.0239 12.9728 17.1489 13.2227 17.3988L16.7669 20.943C17.0395 21.2156 17.1759 21.5337 17.1759 21.8972C17.1759 22.2607 17.0395 22.5787 16.7669 22.8514L13.2227 26.3955C12.9728 26.6454 12.6607 26.7763 12.2863 26.7881C11.9119 26.7999 11.5879 26.6691 11.3143 26.3955C11.0644 26.1456 10.9336 25.8335 10.9218 25.4591C10.9099 25.0847 11.0295 24.7607 11.2803 24.4871L12.7456 22.9877Z"
      fill="currentColor"
    />
  </svg>
)

export default function ProductViewAModal() {
  const [viewMode, setViewMode] = useState<"360" | "try-on">("360")
  const [selectedProduct, setSelectedProduct] = useState(initialProducts[0])
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle camera permission for Try-On view
  useEffect(() => {
    if (viewMode === "try-on") {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop())
          setCameraError(null)
        })
        .catch((err) => {
          console.error("Camera access denied:", err)
          setCameraError("Camera access denied. Please enable camera permissions to use Try-On view.")
        })
    }
  }, [viewMode])

  const handleBuyNowClick = () => {
    window.open("https://example.com/buy-now", "_blank")
  }

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
        <div className="flex flex-col w-full h-full bg-[#ffffff]" style={{ fontFamily: "Sohne, sans-serif" }}>
          {/* AR Viewer */}
          <div className="flex-1 bg-[#f2f2f2] flex flex-col items-center justify-center relative">
            {/* Full screen container for try-on mode */}
            {viewMode === "try-on" && (
              <div className="absolute inset-0 z-0">
                {cameraError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-500 p-4 text-center">
                    <div>
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <p>{cameraError}</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={selectedProduct.tryOnUrl}
                    title="VerveAR Virtual Try-On"
                    className="w-full h-full border-0"
                    allow="camera; microphone; accelerometer; gyroscope"
                  ></iframe>
                )}
              </div>
            )}

            {/* View mode toggle */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex rounded-full bg-[#c6c6c6] p-1 w-[280px]" role="tablist" aria-label="View modes">
                <button
                  onClick={() => setViewMode("360")}
                  className={`flex items-center justify-center gap-1 py-2 px-4 rounded-full w-1/2 transition-colors ${
                    viewMode === "360" ? "bg-[#ffffff] text-[#2770E5]" : "bg-transparent text-[#ffffff]"
                  }`}
                  style={{ fontFamily: "Sohne, sans-serif" }}
                >
                  <Icon360 className="w-4 h-4" />
                  <span className="font-medium whitespace-nowrap">360°</span>
                </button>
                <button
                  onClick={() => setViewMode("try-on")}
                  className={`flex items-center justify-center gap-1 py-2 px-4 rounded-full w-1/2 transition-colors ${
                    viewMode === "try-on" ? "bg-[#ffffff] text-[#2770E5]" : "bg-transparent text-[#ffffff]"
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
                  {modelViewerLoaded && selectedProduct ? (
                    <model-viewer
                      src={selectedProduct.modelUrl}
                      alt={`${selectedProduct.name} 3D model`}
                      camera-controls
                      auto-rotate
                      ar
                      exposure="0.5"
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: "100%", height: "100%", backgroundColor: "#FFFFFF" }}
                    ></model-viewer>
                  ) : (
                    <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                      Loading 3D model...
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full">{/* Content is rendered via the iframe above */}</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div
            className="h-[200px] p-4 flex flex-col justify-between"
            style={{ fontFamily: "Sohne, sans-serif", backgroundColor: "#F5F5F5" }}
          >
            <div>
              <h1 className="text-xl font-semibold text-[#000000] mb-1" style={{ fontFamily: "Sohne, sans-serif" }}>
                {selectedProduct.name}
              </h1>
              <p className="text-sm text-[#9b9b9b]" style={{ fontFamily: "Sohne, sans-serif" }}>
                {selectedProduct.description}
              </p>
            </div>

            {/* Thumbnails */}
            <div className="overflow-x-auto pb-2 -mx-2">
              <div className="flex gap-2 px-2">
                {initialProducts.map((product, index) => {
                  const isSelected = selectedProduct.id === product.id
                  return (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-[50px] h-[50px] cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div
                        className="w-full h-full bg-[#FFFFFF] overflow-hidden flex items-center justify-center rounded"
                        style={{
                          ...(isSelected
                            ? {
                                boxShadow: "0 0 0 2px #2770E5, 0 0 0 4px white",
                              }
                            : {}),
                        }}
                      >
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={`${product.name} view`}
                          width={50}
                          height={50}
                          className="object-contain w-full h-full"
                          draggable={false}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Buy button */}
            <button
              onClick={handleBuyNowClick}
              className="w-full bg-[#2770E5] text-white px-4 py-2 rounded flex items-center justify-between"
              style={{ fontFamily: "Sohne, sans-serif" }}
            >
              <span className="text-sm font-medium">Buy Now</span>
              <span className="text-sm font-medium">$ {selectedProduct.price.toFixed(2)}</span>
            </button>
          </div>
        </div>
      ) : (
        // Desktop Layout
        <div className="flex flex-row w-full h-full bg-[#ffffff]" style={{ fontFamily: "Sohne, sans-serif" }}>
          {/* Left side - AR */}
          <div className="w-3/5 bg-[#f2f2f2] flex flex-col items-center justify-center relative">
            {/* Full screen container for try-on mode */}
            {viewMode === "try-on" && (
              <div className="absolute inset-0 z-0">
                {cameraError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-500 p-4 text-center">
                    <div>
                      <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-xl">{cameraError}</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={selectedProduct.tryOnUrl}
                    title="VerveAR Virtual Try-On"
                    className="w-full h-full border-0"
                    allow="camera; microphone; accelerometer; gyroscope"
                  ></iframe>
                )}
              </div>
            )}

            {/* View mode toggle */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex rounded-full bg-[#c6c6c6] p-1 w-[350px]" role="tablist" aria-label="View modes">
                <button
                  onClick={() => setViewMode("360")}
                  className={`flex items-center justify-center gap-2 py-2 px-6 rounded-full w-1/2 transition-colors ${
                    viewMode === "360" ? "bg-[#ffffff] text-[#2770E5]" : "bg-transparent text-[#ffffff]"
                  }`}
                  style={{ fontFamily: "Sohne, sans-serif" }}
                >
                  <Icon360 className="w-5 h-5" />
                  <span className="font-medium">360°</span>
                </button>
                <button
                  onClick={() => setViewMode("try-on")}
                  className={`flex items-center justify-center gap-2 py-2 px-6 rounded-full w-1/2 transition-colors ${
                    viewMode === "try-on" ? "bg-[#ffffff] text-[#2770E5]" : "bg-transparent text-[#ffffff]"
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
                  {modelViewerLoaded && selectedProduct ? (
                    <model-viewer
                      src={selectedProduct.modelUrl}
                      alt={`${selectedProduct.name} 3D model`}
                      camera-controls
                      auto-rotate
                      ar
                      exposure="0.5"
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: "100%", height: "100%", backgroundColor: "#FFFFFF" }}
                    ></model-viewer>
                  ) : (
                    <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                      Loading 3D model...
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full">{/* Content is rendered via the iframe above */}</div>
              )}
            </div>
          </div>

          {/* Right side - Product Info */}
          <div
            className="w-2/5 p-6 flex flex-col"
            style={{ fontFamily: "Sohne, sans-serif", backgroundColor: "#F5F5F5" }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-[#000000] mb-2" style={{ fontFamily: "Sohne, sans-serif" }}>
                {selectedProduct.name}
              </h1>
              <p className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                {selectedProduct.description}
              </p>
            </div>

            {/* Thumbnails grid */}
            <div className="grid grid-cols-4 gap-3 mb-auto">
              {initialProducts.map((product, index) => {
                const isSelected = selectedProduct.id === product.id
                return (
                  <div key={index} className="relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <div
                      className="aspect-square bg-[#FFFFFF] overflow-hidden flex items-center justify-center rounded"
                      style={{
                        ...(isSelected
                          ? {
                              boxShadow: "0 0 0 2px #2770E5",
                            }
                          : {}),
                      }}
                    >
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={`${product.name} view`}
                        width={120}
                        height={120}
                        className="object-contain w-full h-full"
                        draggable={false}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Buy button */}
            <div className="mt-6">
              <button
                onClick={handleBuyNowClick}
                className="w-full bg-[#2770E5] text-white py-3 px-6 rounded flex items-center justify-between"
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
