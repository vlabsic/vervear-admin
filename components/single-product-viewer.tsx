"use client"

import { useState, useEffect, useRef } from "react"
import { Edit2, Settings, X, AlertCircle } from "lucide-react"
import Script from "next/script"
import ProductEditModal, { type Product } from "./product-edit-modal"
import type { UISettings } from "./settings-modal"

// Custom View in Space icon
const ARIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.5001 2.13397C11.6521 2.04621 11.8245 2 12.0001 2C12.1756 2 12.348 2.04621 12.5001 2.13397L14.5001 3.28897C14.7279 3.42253 14.8936 3.64076 14.9611 3.89606C15.0286 4.15135 14.9924 4.42298 14.8603 4.65167C14.7283 4.88036 14.5112 5.04754 14.2563 5.11672C14.0015 5.18591 13.7296 5.15149 13.5001 5.02097L13.0001 4.73197V5.99997C13.0001 6.26519 12.8947 6.51954 12.7072 6.70708C12.5196 6.89462 12.2653 6.99997 12.0001 6.99997C11.7348 6.99997 11.4805 6.89462 11.2929 6.70708C11.1054 6.51954 11.0001 6.26519 11.0001 5.99997V4.73197L10.5001 5.02097C10.2705 5.15149 9.99863 5.18591 9.74379 5.11672C9.48895 5.04754 9.27182 4.88036 9.13978 4.65167C9.00774 4.42298 8.97152 4.15135 9.03902 3.89606C9.10651 3.64076 9.27225 3.42253 9.50005 3.28897L11.5001 2.13397ZM7.07205 5.84497C7.20466 6.07465 7.24059 6.3476 7.17195 6.60377C7.10332 6.85995 6.93573 7.07836 6.70605 7.21097L6.20605 7.49997L7.30405 8.13397C7.4187 8.19916 7.51932 8.28637 7.60012 8.3906C7.68092 8.49483 7.74031 8.61401 7.77486 8.74128C7.80942 8.86855 7.81846 9.00141 7.80146 9.13218C7.78446 9.26296 7.74176 9.38909 7.67582 9.5033C7.60988 9.61751 7.522 9.71755 7.41723 9.79766C7.31247 9.87777 7.1929 9.93636 7.0654 9.97007C6.9379 10.0038 6.80499 10.0119 6.67433 9.99407C6.54367 9.97621 6.41783 9.93267 6.30405 9.86597L5.20605 9.23197V9.80897C5.20605 10.0742 5.1007 10.3285 4.91316 10.5161C4.72563 10.7036 4.47127 10.809 4.20605 10.809C3.94084 10.809 3.68648 10.7036 3.49895 10.5161C3.31141 10.3285 3.20605 10.0742 3.20605 9.80897V7.49997C3.20623 7.32461 3.25253 7.15238 3.34029 7.00056C3.42804 6.84873 3.55419 6.72266 3.70605 6.63497L5.70605 5.47997C5.93573 5.34737 6.20868 5.31144 6.46485 5.38008C6.72103 5.44871 6.93944 5.6163 7.07205 5.84597V5.84497ZM16.9281 5.84497C17.0607 5.6153 17.2791 5.44771 17.5353 5.37908C17.7914 5.31044 18.0644 5.34637 18.2941 5.47897L20.2941 6.63397C20.4461 6.72174 20.5723 6.84797 20.6601 6.99999C20.7478 7.152 20.7941 7.32444 20.7941 7.49997V9.80997C20.7941 10.0752 20.6887 10.3295 20.5012 10.5171C20.3136 10.7046 20.0593 10.81 19.7941 10.81C19.5288 10.81 19.2745 10.7046 19.0869 10.5171C18.8994 10.3295 18.7941 10.0752 18.7941 9.80997V9.23197L17.6961 9.86597C17.4665 9.99649 17.1946 10.0309 16.9398 9.96172C16.6849 9.89254 16.4678 9.72536 16.3358 9.49667C16.2037 9.26798 16.1675 8.99635 16.235 8.74106C16.3025 8.48576 16.4682 8.26752 16.6961 8.13397L17.7941 7.49997L17.2941 7.21097C17.0644 7.07836 16.8968 6.85995 16.8282 6.60377C16.7595 6.3476 16.7955 6.07465 16.9281 5.84497ZM8.53605 9.99997C8.66867 9.7703 8.88708 9.60271 9.14326 9.53407C9.39943 9.46544 9.67238 9.50137 9.90205 9.63397L12.0001 10.845L14.0981 9.63397C14.3276 9.50346 14.5995 9.46904 14.8543 9.53823C15.1092 9.60741 15.3263 9.77459 15.4583 10.0033C15.5904 10.232 15.6266 10.5036 15.5591 10.7589C15.4916 11.0142 15.3259 11.2324 15.0981 11.366L13.0001 12.577V15C13.0001 15.2652 12.8947 15.5195 12.7072 15.7071C12.5196 15.8946 12.2653 16 12.0001 16C11.7348 16 11.4805 15.8946 11.2929 15.7071C11.1054 15.5195 11.0001 15.2652 11.0001 15V12.577L8.90205 11.366C8.67238 11.2334 8.50479 11.0149 8.43616 10.7588C8.36752 10.5026 8.40345 10.2297 8.53605 9.99997ZM4.20605 13.19C4.47127 13.19 4.72563 13.2953 4.91316 13.4829C5.1007 13.6704 5.20605 13.9248 5.20605 14.19V14.768L6.30405 14.134C6.53361 14.0035 6.80548 13.969 7.06032 14.0382C7.31516 14.1074 7.53229 14.2746 7.66433 14.5033C7.79637 14.732 7.83259 15.0036 7.76509 15.2589C7.6976 15.5142 7.53186 15.7324 7.30405 15.866L6.20605 16.5L6.70605 16.789C6.8207 16.8542 6.92132 16.9414 7.00212 17.0456C7.08292 17.1498 7.14231 17.269 7.17686 17.3963C7.21142 17.5236 7.22046 17.6564 7.20346 17.7872C7.18646 17.918 7.14376 18.0441 7.07782 18.1583C7.01188 18.2725 6.924 18.3726 6.81923 18.4527C6.71447 18.5328 6.5949 18.5914 6.4674 18.6251C6.3399 18.6588 6.20699 18.6669 6.07633 18.6491C5.94567 18.6312 5.81983 18.5877 5.70605 18.521L3.70605 17.366C3.55404 17.2782 3.4278 17.152 3.34004 17C3.25227 16.8479 3.20606 16.6755 3.20605 16.5V14.19C3.20605 13.9248 3.31141 13.6704 3.49895 13.4829C3.68648 13.2953 3.94084 13.19 4.20605 13.19ZM19.7941 13.19C20.0593 13.19 20.3136 13.2953 20.5012 13.4829C20.6887 13.6704 20.7941 13.9248 20.7941 14.19V16.5C20.7941 16.6755 20.7478 16.8479 20.6601 17C20.5723 17.152 20.4461 17.2782 20.2941 17.366L18.2941 18.521C18.1803 18.5877 18.0544 18.6312 17.9238 18.6491C17.7931 18.6669 17.6602 18.6588 17.5327 18.6251C17.4052 18.5914 17.2856 18.5328 17.1809 18.4527C17.0761 18.3726 16.9882 18.2725 16.9223 18.1583C16.8563 18.0441 16.8136 17.918 16.7967 17.7872C16.7797 17.6564 16.7887 17.5236 16.8232 17.3963C16.8578 17.269 16.9172 17.1498 16.998 17.0456C17.0788 16.9414 17.1794 16.8542 17.2941 16.789L17.7941 16.5L16.6961 15.866C16.5814 15.8008 16.4808 15.7136 16.4 15.6093C16.3192 15.5051 16.2598 15.3859 16.2252 15.2587C16.1907 15.1314 16.1817 14.9985 16.1987 14.8678C16.2156 14.737 16.2583 14.6109 16.3243 14.4966C16.3902 14.3824 16.4781 14.2824 16.5829 14.2023C16.6876 14.1222 16.8072 14.0636 16.9347 14.0299C17.0622 13.9962 17.1951 13.988 17.3258 14.0059C17.4564 14.0237 17.5823 14.0673 17.6961 14.134L18.7941 14.768V14.191C18.7941 13.9258 18.8994 13.6714 19.0869 13.4839C19.2745 13.2963 19.5288 13.191 19.7941 13.191V13.19ZM12.0001 17C12.2653 17 12.5196 17.1053 12.7072 17.2929C12.8947 17.4804 13.0001 17.7348 13.0001 18V19.268L13.5001 18.979C13.6138 18.9123 13.7397 18.8687 13.8703 18.8509C14.001 18.833 14.1339 18.8412 14.2614 18.8749C14.3889 18.9086 14.5085 18.9672 14.6132 19.0473C14.718 19.1274 14.8059 19.2274 14.8718 19.3416C14.9378 19.4559 14.9805 19.582 14.9975 19.7128C15.0145 19.8435 15.0054 19.9764 14.9709 20.1037C14.9363 20.2309 14.8769 20.3501 14.7961 20.4543C14.7153 20.5586 14.6147 20.6458 14.5001 20.711L12.5001 21.866C12.348 21.9537 12.1756 22 12.0001 22C11.8245 22 11.6521 21.9537 11.5001 21.866L9.50005 20.711C9.38541 20.6458 9.28479 20.5586 9.20399 20.4543C9.12319 20.3501 9.0638 20.2309 9.02924 20.1037C8.99469 19.9764 8.98565 19.8435 9.00265 19.7128C9.01965 19.582 9.06235 19.4559 9.12829 19.3416C9.19423 19.2274 9.28211 19.1274 9.38688 19.0473C9.49164 18.9672 9.61121 18.9086 9.73871 18.8749C9.86621 18.8412 9.99912 18.833 10.1298 18.8509C10.2604 18.8687 10.3863 18.9123 10.5001 18.979L11.0001 19.268V18C11.0001 17.7348 11.1054 17.4804 11.2929 17.2929C11.4805 17.1053 11.7348 17 12.0001 17Z"
      fill="black"
    />
  </svg>
)

// Single product for this view
const initialProduct: Product = {
  id: 1,
  name: "Fonteyn Console Desk, Oak",
  description: "Modern oak console desk with sleek design",
  price: 699.0,
  image: "https://res.cloudinary.com/drnavq85s/image/upload/v1736166879/image_168_deayxg.png",
  modelUrl: "/models/fonteyn_console_desk_oak.glb",
  buyNowLink: "https://www.made.com/fonteyn-console-desk-oak",
}

export default function SingleProductViewer() {
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
  const modelViewerRef = useRef<HTMLElement | null>(null)

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

  // Function to activate AR mode
  const handleViewInSpace = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR()
    }
  }

  return (
    <>
      {/* Add CSS for styling */}
      <style jsx global>{`
        .product-item {
          transition: transform 0.3s ease, opacity 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          z-index: 1;
        }
        
        /* Prevent scrolling on mobile */
        @media (max-width: 767px) {
          html, body {
            overflow: hidden;
            height: 100%;
            position: fixed;
            width: 100%;
          }
        }
        
        .view-in-space-button {
          background-color: white;
          color: #000000;
          border: none;
          border-radius: 9999px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: "Sohne", sans-serif;
        }

        .view-in-space-button:hover {
          background-color: #f8f8f8;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
          {/* UI Container */}
          <div className="relative z-10 flex flex-col w-full h-full">
            {/* Action buttons - positioned at the top right */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={handleProductEdit}
                className="p-1.5 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Edit product"
                style={{ color: uiSettings.accentColor }}
              >
                <Edit2 className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-1.5 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Settings"
                style={{ color: uiSettings.accentColor }}
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* 3D Viewer */}
            <div className="w-full h-[75vh] flex items-center justify-center">
              {modelViewerLoaded ? (
                <model-viewer
                  ref={(ref) => {
                    modelViewerRef.current = ref
                  }}
                  src={product.modelUrl}
                  alt={`${product.name} 3D model`}
                  camera-controls
                  auto-rotate
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  ar-scale="fixed"
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

            {/* Bottom UI Section */}
            <div className="w-full flex flex-col items-center mt-auto">
              {/* View in Space Button - Positioned above product info */}
              <div className="w-full flex justify-center -mt-8 mb-4 z-20">
                <button onClick={handleViewInSpace} className="view-in-space-button">
                  <ARIcon className="w-5 h-5" />
                  <span>VIEW IN YOUR ROOM</span>
                </button>
              </div>

              {/* Buy button and Price - Mobile */}
              <div className="w-full px-4 py-3">
                <div className="bg-white rounded-lg p-4 flex justify-between items-center">
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
          {/* UI Container */}
          <div className="relative z-10 flex flex-col w-full h-full">
            {/* Action buttons - positioned at the top right */}
            <div className="absolute top-6 right-12 z-20 flex items-center gap-3">
              <button
                onClick={handleProductEdit}
                className="p-2 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Edit product"
                style={{ color: uiSettings.accentColor }}
              >
                <Edit2 className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Settings"
                style={{ color: uiSettings.accentColor }}
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* 3D Viewer */}
            <div className="w-full h-[80vh] flex items-center justify-center">
              {modelViewerLoaded ? (
                <model-viewer
                  ref={(ref) => {
                    modelViewerRef.current = ref
                  }}
                  src={product.modelUrl}
                  alt={`${product.name} 3D model`}
                  camera-controls
                  auto-rotate
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  ar-scale="fixed"
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

            {/* Bottom UI Section */}
            <div className="w-full flex flex-col items-center mt-auto">
              {/* View in Space Button - Positioned above product info */}
              <div className="w-full flex justify-center -mt-16 mb-6 z-20">
                <button onClick={handleViewInSpace} className="view-in-space-button">
                  <ARIcon className="w-6 h-6" />
                  <span>VIEW IN YOUR ROOM</span>
                </button>
              </div>

              {/* Price and Buy Button Row */}
              <div className="w-full max-w-6xl px-12 py-2">
                <div className="bg-white rounded-lg py-2 px-4 flex justify-between items-center h-[80px]">
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

      {/* Settings Modal */}
      <SingleProductSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={uiSettings}
        onSave={handleSaveSettings}
      />
    </>
  )
}

// Custom Settings Modal for SingleProductViewer
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
      // Validate color format
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(localSettings.accentColor)) {
        setError("Invalid color format. Please use hexadecimal format (e.g., #FF5E1A)")
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

            {/* Error message */}
            {error && (
              <div className="mt-2 text-red-500 text-sm flex items-center" id="settings-error" role="alert">
                <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                {error}
              </div>
            )}
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
