"use client"

import { useState, useEffect } from "react"
import { Glasses, Edit2, Settings, X, AlertCircle } from "lucide-react"
import Script from "next/script"
import ProductEditModal, { type Product } from "./product-edit-modal"
import type { UISettings } from "./settings-modal"

// Single product for this view
const initialProduct: Product = {
  id: 1,
  name: "Gucci Fuischa",
  description: "Fuischa Flower glasses",
  price: 450.0,
  image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166879/image_168_deayxg.png",
  modelUrl:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.%20Gucci%20Fuschia%20and%20Black%20Frames-W5mqIjw9VMCl0Th9UznHcB0XYa1d1S.glb",
  tryOnUrl: "https://ar.vervear.com/glasses/675f8f536a00d6990d91f06a",
  buyNowLink:
    "https://www.gucci.com/us/en/pr/women/accessories-for-women/eyewear-for-women/sunglasses-for-women/rectangular-frame-sunglasses-p-663736J07401317",
}

// Updated 360 icon component to match the new design
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
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2c-2.5 2.5-5 7-5 10s2.5 7.5 5 10c2.5-2.5 5-7 5-10S14.5 4.5 12 2z" />
  </svg>
)

export default function SingleProductViewB() {
  const [viewMode, setViewMode] = useState<"360" | "try-on">("360")
  const [product, setProduct] = useState<Product>(initialProduct)
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [uiSettings, setUISettings] = useState<UISettings>({
    accentColor: "#ff5e1a",
    productCornerRadius: 360,
    buttonCornerRadius: 8,
    show360View: true,
    showTryOnView: true,
    viewerBackgroundColor: "#F2F2F2", // Add default background color
  })
  const [cameraError, setCameraError] = useState<string | null>(null)

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
          setCameraError(null)
        })
        .catch((err) => {
          console.error("Camera access denied:", err)
          setCameraError("Camera access denied. Please enable camera permissions to use Try-On view.")
        })
    }
  }, [viewMode])

  // Update viewMode when settings change
  useEffect(() => {
    // If current view mode is disabled, switch to the other mode
    if (viewMode === "360" && !uiSettings.show360View) {
      setViewMode("try-on")
    } else if (viewMode === "try-on" && !uiSettings.showTryOnView) {
      setViewMode("360")
    }
  }, [uiSettings, viewMode])

  const handleProductEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveProduct = (updatedProduct: Product) => {
    setProduct(updatedProduct)
    setIsEditModalOpen(false)
  }

  const handleBuyNowClick = () => {
    if (product && product.buyNowLink) {
      window.open(product.buyNowLink, "_blank", "noopener,noreferrer")
    }
  }

  const handleSaveSettings = (newSettings: UISettings) => {
    setUISettings(newSettings)
  }

  // Determine if we should show the view mode toggle
  const showViewModeToggle = uiSettings.show360View && uiSettings.showTryOnView

  // Determine which view to show based on settings
  const currentViewMode = (() => {
    if (!uiSettings.show360View) return "try-on"
    if (!uiSettings.showTryOnView) return "360"
    return viewMode
  })()

  return (
    <>
      {/* Add CSS for styling */}
      <style jsx global>{`
        .product-item {
          transition: transform 0.3s ease, opacity 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Load Model Viewer script */}
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        onLoad={() => setModelViewerLoaded(true)}
        strategy="afterInteractive"
      />

      {/* Mobile Layout */}
      {isMobile ? (
        <div
          className="flex flex-col w-full h-[100vh] overflow-hidden bg-[#f2f2f2]"
          style={{ fontFamily: "Sohne, sans-serif" }}
        >
          {/* Full screen container for try-on mode */}
          {currentViewMode === "try-on" && (
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
                  src={product.tryOnUrl}
                  title="VerveAR Virtual Try-On"
                  className="w-full h-full border-0"
                  allow="camera; microphone; accelerometer; gyroscope"
                ></iframe>
              )}
            </div>
          )}

          {/* UI Container - always on top */}
          <div className="relative z-10 flex flex-col w-full h-full">
            {/* View mode toggle - only show if both options are enabled */}
            {showViewModeToggle && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex rounded-full bg-[#9b9b9b] p-1 w-[280px]" role="tablist" aria-label="View modes">
                  <button
                    onClick={() => setViewMode("360")}
                    className={`flex items-center justify-center gap-1 py-2 px-4 rounded-full w-1/2 transition-colors ${
                      currentViewMode === "360" ? "bg-[#ffffff]" : "bg-transparent text-[#ffffff]"
                    }`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      color: currentViewMode === "360" ? uiSettings.accentColor : "#ffffff",
                    }}
                    role="tab"
                    aria-selected={currentViewMode === "360"}
                    aria-controls="360-view"
                    id="360-tab"
                  >
                    <Icon360 className="w-4 h-4" />
                    <span className="font-medium whitespace-nowrap">360°</span>
                  </button>
                  <button
                    onClick={() => setViewMode("try-on")}
                    className={`flex items-center justify-center gap-1 py-2 px-4 rounded-full w-1/2 transition-colors ${
                      currentViewMode === "try-on" ? "bg-[#ffffff]" : "bg-transparent text-[#ffffff]"
                    }`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      color: currentViewMode === "try-on" ? uiSettings.accentColor : "#ffffff",
                    }}
                    role="tab"
                    aria-selected={currentViewMode === "try-on"}
                    aria-controls="try-on-view"
                    id="try-on-tab"
                  >
                    <Glasses className="w-4 h-4" />
                    <span className="font-medium whitespace-nowrap">TRY-ON</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons - positioned at the top right */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={handleProductEdit}
                className={`p-1.5 rounded-full ${
                  currentViewMode === "try-on" ? "bg-black bg-opacity-30" : "bg-white"
                } shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                aria-label="Edit product"
                style={{ color: currentViewMode === "try-on" ? "#ffffff" : uiSettings.accentColor }}
              >
                <Edit2 className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className={`p-1.5 rounded-full ${
                  currentViewMode === "try-on" ? "bg-black bg-opacity-30" : "bg-white"
                } shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                aria-label="Settings"
                style={{ color: currentViewMode === "try-on" ? "#ffffff" : uiSettings.accentColor }}
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* 360 Viewer - only visible in 360 mode */}
            {currentViewMode === "360" && (
              <div
                className="w-full h-[75vh] flex items-center justify-center"
                id="360-view"
                role="tabpanel"
                aria-labelledby="360-tab"
              >
                {modelViewerLoaded ? (
                  <model-viewer
                    src={product.modelUrl}
                    alt={`${product.name} 3D model`}
                    camera-controls
                    auto-rotate
                    ar
                    exposure="0.5"
                    shadow-intensity="1"
                    environment-image="neutral"
                    style={{ width: "100%", height: "100%", backgroundColor: uiSettings.viewerBackgroundColor }}
                  ></model-viewer>
                ) : (
                  <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                    Loading 3D model...
                  </div>
                )}
              </div>
            )}

            {/* Try-on View - only visible in try-on mode */}
            {currentViewMode === "try-on" && (
              <div
                className="w-full h-[75vh] flex items-center justify-center"
                id="try-on-view"
                role="tabpanel"
                aria-labelledby="try-on-tab"
              >
                {/* Content is rendered via the iframe above */}
              </div>
            )}

            {/* Bottom UI Section - Exactly matching /glassesdemob */}
            <div className="w-full flex flex-col items-center mt-auto">
              {/* Buy button and Price - Mobile */}
              <div className="w-full px-4 py-3">
                <div
                  className={`bg-white rounded-lg p-4 flex justify-between items-center ${currentViewMode === "try-on" ? "bg-opacity-80 backdrop-blur-sm" : ""}`}
                >
                  <div>
                    <h2 className="text-[24px] font-bold text-[#000000]" style={{ fontFamily: "Sohne, sans-serif" }}>
                      ${product.price.toFixed(0)}
                    </h2>
                    <p className="text-[12px] text-[#909090]" style={{ fontFamily: "Sohne, sans-serif" }}>
                      {product.description}
                    </p>
                  </div>
                  <button
                    onClick={handleBuyNowClick}
                    className="text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      backgroundColor: uiSettings.accentColor,
                      borderRadius: `${uiSettings.buttonCornerRadius}px`,
                    }}
                  >
                    <span className="text-sm font-medium">BUY NOW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Desktop Layout
        <div
          className="flex flex-col w-full h-[100vh] overflow-hidden bg-[#f2f2f2]"
          style={{ fontFamily: "Sohne, sans-serif" }}
        >
          {/* Full screen container for try-on mode */}
          {currentViewMode === "try-on" && (
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
                  src={product.tryOnUrl}
                  title="VerveAR Virtual Try-On"
                  className="w-full h-full border-0"
                  allow="camera; microphone; accelerometer; gyroscope"
                ></iframe>
              )}
            </div>
          )}

          {/* UI Container - always on top */}
          <div className="relative z-10 flex flex-col w-full h-full">
            {/* View mode toggle - only show if both options are enabled */}
            {showViewModeToggle && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex rounded-full bg-[#9b9b9b] p-1 w-[350px]" role="tablist" aria-label="View modes">
                  <button
                    onClick={() => setViewMode("360")}
                    className={`flex items-center justify-center gap-2 py-2 px-6 rounded-full w-1/2 transition-colors ${
                      currentViewMode === "360" ? "bg-[#ffffff]" : "bg-transparent text-[#ffffff]"
                    }`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      color: currentViewMode === "360" ? uiSettings.accentColor : "#ffffff",
                    }}
                    role="tab"
                    aria-selected={currentViewMode === "360"}
                    aria-controls="360-view-desktop"
                    id="360-tab-desktop"
                  >
                    <Icon360 className="w-5 h-5" />
                    <span className="font-medium">360°</span>
                  </button>
                  <button
                    onClick={() => setViewMode("try-on")}
                    className={`flex items-center justify-center gap-2 py-2 px-6 rounded-full w-1/2 transition-colors ${
                      currentViewMode === "try-on" ? "bg-[#ffffff]" : "bg-transparent text-[#ffffff]"
                    }`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      color: currentViewMode === "try-on" ? uiSettings.accentColor : "#ffffff",
                    }}
                    role="tab"
                    aria-selected={currentViewMode === "try-on"}
                    aria-controls="try-on-view-desktop"
                    id="try-on-tab-desktop"
                  >
                    <Glasses className="w-5 h-5" />
                    <span className="font-medium">TRY-ON</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons - positioned at the top right */}
            <div className="absolute top-6 right-12 z-20 flex items-center gap-3">
              <button
                onClick={handleProductEdit}
                className={`p-2 rounded-full ${
                  currentViewMode === "try-on" ? "bg-black bg-opacity-30" : "bg-white"
                } shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                aria-label="Edit product"
                style={{ color: currentViewMode === "try-on" ? "#ffffff" : uiSettings.accentColor }}
              >
                <Edit2 className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className={`p-2 rounded-full ${
                  currentViewMode === "try-on" ? "bg-black bg-opacity-30" : "bg-white"
                } shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                aria-label="Settings"
                style={{ color: currentViewMode === "try-on" ? "#ffffff" : uiSettings.accentColor }}
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* 360 Viewer - only visible in 360 mode */}
            {currentViewMode === "360" && (
              <div
                className="w-full h-[80vh] flex items-center justify-center"
                id="360-view-desktop"
                role="tabpanel"
                aria-labelledby="360-tab-desktop"
              >
                {modelViewerLoaded ? (
                  <model-viewer
                    src={product.modelUrl}
                    alt={`${product.name} 3D model`}
                    camera-controls
                    auto-rotate
                    ar
                    exposure="0.5"
                    shadow-intensity="1"
                    environment-image="neutral"
                    style={{ width: "100%", height: "100%", backgroundColor: uiSettings.viewerBackgroundColor }}
                  ></model-viewer>
                ) : (
                  <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                    Loading 3D model...
                  </div>
                )}
              </div>
            )}

            {/* Try-on View - only visible in try-on mode */}
            {currentViewMode === "try-on" && (
              <div
                className="w-full h-[80vh] flex items-center justify-center"
                id="try-on-view-desktop"
                role="tabpanel"
                aria-labelledby="try-on-tab-desktop"
              >
                {/* Content is rendered via the iframe above */}
              </div>
            )}

            {/* Bottom UI Section - Exactly matching /glassesdemob */}
            <div className="w-full flex flex-col items-center mt-auto">
              {/* Price and Buy Button Row */}
              <div className="w-full max-w-6xl px-12 py-2">
                <div
                  className={`bg-white rounded-lg py-2 px-4 flex justify-between items-center h-[80px] ${currentViewMode === "try-on" ? "bg-opacity-80 backdrop-blur-sm" : ""}`}
                >
                  <div>
                    <h2
                      className="text-[26px] font-bold text-[#000000] leading-tight"
                      style={{ fontFamily: "Sohne, sans-serif" }}
                    >
                      ${product.price.toFixed(0)}
                    </h2>
                    <p className="text-[14px] text-[#909090] leading-tight" style={{ fontFamily: "Sohne, sans-serif" }}>
                      {product.description}
                    </p>
                  </div>
                  <button
                    onClick={handleBuyNowClick}
                    className="text-white px-6 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      backgroundColor: uiSettings.accentColor,
                      borderRadius: `${uiSettings.buttonCornerRadius}px`,
                    }}
                  >
                    <span className="text-base font-medium">BUY NOW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <ProductEditModal
        product={product}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProduct}
        onDelete={() => {
          // Since this is a single product view, we don't actually delete the product
          // Instead, we could reset it to default values
          setProduct(initialProduct)
          setIsEditModalOpen(false)
        }}
      />

      {/* Custom Settings Modal for SingleProductViewB */}
      <SingleProductSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={uiSettings}
        onSave={handleSaveSettings}
      />
    </>
  )
}

// Custom Settings Modal for SingleProductViewB
type SingleProductSettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  settings: UISettings
  onSave: (settings: UISettings) => void
}

function SingleProductSettingsModal({ isOpen, onClose, settings, onSave }: SingleProductSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<UISettings>(settings)
  const [error, setError] = useState<string | null>(null)

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    try {
      // Validate that at least one view option is enabled
      if (!localSettings.show360View && !localSettings.showTryOnView) {
        setError("At least one view option must be enabled")
        return
      }

      // Validate color format
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(localSettings.accentColor)) {
        setError("Invalid color format. Please use hexadecimal format (e.g., #FF5E1A)")
        return
      }

      // Validate color format
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(localSettings.viewerBackgroundColor)) {
        setError("Invalid color format. Please use hexadecimal format (e.g., #F2F2F2)")
        return
      }

      onSave(localSettings)
      onClose()
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("An error occurred while saving settings")
    }
  }

  const handleChange = (key: keyof UISettings, value: string | number | boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Clear error when user makes changes
    setError(null)
  }

  const handleToggleChange = (key: "show360View" | "showTryOnView") => {
    // Get the current value
    const currentValue = localSettings[key]

    // Check if we're trying to disable the only enabled option
    if (
      (key === "show360View" && currentValue && !localSettings.showTryOnView) ||
      (key === "showTryOnView" && currentValue && !localSettings.show360View)
    ) {
      setError("At least one view option must be enabled")
      return
    }

    // Toggle the value
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    setError(null)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 transition-opacity duration-300"
      style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
      onClick={(e) => {
        // Close when clicking the backdrop, but not when clicking the drawer itself
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative h-full w-full max-w-md bg-white shadow-lg overflow-hidden transition-transform duration-300 ease-in-out flex flex-col"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          borderTopLeftRadius: "0.5rem",
          borderBottomLeftRadius: "0.5rem",
        }}
      >
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">UI Settings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Accent Color Picker */}
            <div>
              <label htmlFor="single-accentColor" className="block text-sm font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="single-accentColor"
                  value={localSettings.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                  aria-describedby="color-error"
                />
                <input
                  type="text"
                  value={localSettings.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#ff5e1a"
                  aria-describedby="color-error"
                />
              </div>
            </div>

            {/* Button Corner Radius */}
            <div>
              <label htmlFor="single-buttonCornerRadius" className="block text-sm font-medium text-gray-700 mb-1">
                Buy Now Button Corner Radius (px)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  id="single-buttonCornerRadius"
                  min="0"
                  max="20"
                  value={localSettings.buttonCornerRadius}
                  onChange={(e) => handleChange("buttonCornerRadius", Number.parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={localSettings.buttonCornerRadius}
                  onChange={(e) => handleChange("buttonCornerRadius", Number.parseInt(e.target.value) || 0)}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="20"
                />
              </div>
              <div className="mt-2 flex justify-center">
                <div
                  className="w-32 h-10 flex items-center justify-center text-white text-sm"
                  style={{
                    borderRadius: `${localSettings.buttonCornerRadius}px`,
                    backgroundColor: localSettings.accentColor,
                  }}
                  aria-hidden="true"
                >
                  Buy Now
                </div>
              </div>
            </div>

            {/* Viewer Background Color */}
            <div>
              <label htmlFor="single-viewerBackgroundColor" className="block text-sm font-medium text-gray-700 mb-1">
                3D Viewer Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="single-viewerBackgroundColor"
                  value={localSettings.viewerBackgroundColor}
                  onChange={(e) => handleChange("viewerBackgroundColor", e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                  aria-describedby="color-error"
                />
                <input
                  type="text"
                  value={localSettings.viewerBackgroundColor}
                  onChange={(e) => handleChange("viewerBackgroundColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#F2F2F2"
                  aria-describedby="color-error"
                />
              </div>
              <div className="mt-2 flex justify-center">
                <div
                  className="w-32 h-20 flex items-center justify-center text-gray-500 text-sm"
                  style={{
                    backgroundColor: localSettings.viewerBackgroundColor,
                    border: "1px solid #e5e7eb",
                  }}
                  aria-hidden="true"
                >
                  3D Viewer
                </div>
              </div>
            </div>

            {/* View Options */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">View Options</h3>

              {/* 360° View Toggle */}
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="single-toggle360View" className="text-sm font-medium text-gray-700">
                  Show 360° View
                </label>
                <button
                  id="single-toggle360View"
                  onClick={() => handleToggleChange("show360View")}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    localSettings.show360View ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={localSettings.show360View}
                  aria-labelledby="single-toggle360View-label"
                >
                  <span
                    className={`${
                      localSettings.show360View ? "translate-x-6" : "translate-x-1"
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Try-On View Toggle */}
              <div className="flex items-center justify-between">
                <label htmlFor="single-toggleTryOnView" className="text-sm font-medium text-gray-700">
                  Show Try-On View
                </label>
                <button
                  id="single-toggleTryOnView"
                  onClick={() => handleToggleChange("showTryOnView")}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    localSettings.showTryOnView ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={localSettings.showTryOnView}
                  aria-labelledby="single-toggleTryOnView-label"
                >
                  <span
                    className={`${
                      localSettings.showTryOnView ? "translate-x-6" : "translate-x-1"
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-2 text-red-500 text-sm flex items-center" id="settings-error" role="alert">
                  <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                  {error}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500">
                Note: At least one view option must be enabled. The view switcher will only be displayed if both options
                are enabled.
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer with buttons */}
        <div className="border-t bg-white p-4 flex justify-end gap-3 sticky bottom-0 left-0 right-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ backgroundColor: localSettings.accentColor }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
