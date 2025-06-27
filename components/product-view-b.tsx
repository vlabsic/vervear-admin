"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Glasses, Edit2, Plus, Settings, AlertCircle } from "lucide-react"
import Image from "next/image"
import Script from "next/script"
import ProductEditModal, { type Product } from "./product-edit-modal"
import SettingsModal, { type UISettings } from "./settings-modal"

// Update the products array to match HydroEdge design
const initialProducts: (Product | null)[] = [
  {
    id: 1,
    name: "HydroEdge Celerity Mirrored Goggle",
    description: "Blue Mirrored / Brown Lens / Navy Frame",
    price: 14.4,
    image: "/images/hydrogen-celerity.webp",
    modelUrl: "/models/hydroedge-celerity-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685b4e935054254d580224b8",
    buyNowLink: "https://example.com/hydroedge-goggles",
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
    tryOnUrl: "https://ar.vervear.com/glasses/685b05985054254d58fe7a8b",
    colorOptions: [
      { name: "Hawaiian Sky", color: "#87ceeb" },
      { name: "Silver Mirror", color: "#c0c0c0" },
    ],
  },
  {
    id: 5,
    name: "Silver Mirrored Smoke Lens",
    description: "Silver Mirror / Smoke Lens / Black Frame",
    price: 14.4,
    image: "/images/product-5.webp",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5._gucci_pink_and_orange_frames-1UuK9zlAzNW49PLF9FtlBa334oYAJi.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f912d6a00d6990d91f088",
    colorOptions: [
      { name: "Silver Mirror", color: "#c0c0c0" },
      { name: "Black", color: "#000000" },
    ],
  },
  {
    id: 6,
    name: "Clear Red Goggle",
    description: "Clear Lens / Red Frame / Blue Accents",
    price: 14.4,
    image: "/images/product-6.webp",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red%20Gucci%20Test-JGnRYJl2mSg65dqBtxG2QIqoOK3rkr.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f8d8a6a00d6990d91f04a",
    colorOptions: [
      { name: "Red", color: "#ff0000" },
      { name: "Blue", color: "#0000ff" },
    ],
  },
  {
    id: 7,
    name: "Blue Water Cosmo",
    description: "Blue Mirror / Teal Frame / Cosmo Design",
    price: 14.4,
    image: "/images/product-7.webp",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/173._gucci_square_frames-Pc3uFZhVozTWqQTYICDVp8DLTivMOw.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/675f8cc86a00d6990d91f03c",
    colorOptions: [
      { name: "Blue Mirror", color: "#2770e5" },
      { name: "Teal", color: "#20b2aa" },
    ],
  },
  {
    id: 8,
    name: "Rainbow Black Mask",
    description: "Rainbow Mirror / Green Frame / Black Accents",
    price: 14.4,
    image: "/images/product-8.webp",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10.%20Gucci%20Blue%20and%20Black%20Frames-D8dm3GV3uLIvHCiB39ftTk168Jc5Ou.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/678d988cffaded27beffa877",
    colorOptions: [
      { name: "Rainbow", color: "#ff6b6b" },
      { name: "Green", color: "#4cbb17" },
    ],
  },
  {
    id: 9,
    name: "Silver Black Mask",
    description: "Silver Mirror / Black Frame / Professional",
    price: 14.4,
    image: "/images/product-9.webp",
    modelUrl: "/models/hydroedge-celerity-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685b4e935054254d580224b8",
    colorOptions: [
      { name: "Silver Mirror", color: "#c0c0c0" },
      { name: "Black", color: "#000000" },
    ],
  },
  {
    id: 10,
    name: "Clear Orange Goggle",
    description: "Clear Lens / White Frame / Orange Strap",
    price: 14.4,
    image: "/images/product-10.webp",
    modelUrl: "/models/antifog-s2-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685b59e85054254d58030ed3",
    colorOptions: [
      { name: "Clear", color: "#ffffff" },
      { name: "Orange", color: "#ff8c00" },
    ],
  },
  {
    id: 11,
    name: "Douglas Fir Silver Mirror",
    description: "Silver Mirror / Green Frame / Dark Grey",
    price: 14.4,
    image: "/images/product-11.webp",
    modelUrl: "/models/antifog-s2-mirrored-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685b51cc5054254d58026292",
    colorOptions: [
      { name: "Douglas Fir", color: "#228b22" },
      { name: "Silver Mirror", color: "#c0c0c0" },
    ],
  },
  {
    id: 12,
    name: "Revo Mirrored Lime",
    description: "Revo Mirror / Blue Frame / Lime Strap",
    price: 14.4,
    image: "/images/product-12.webp",
    modelUrl: "/models/womens-vanquisher-3-mirrored-goggle.glb",
    tryOnUrl: "https://ar.vervear.com/glasses/685b05985054254d58fe7a8b",
    colorOptions: [
      { name: "Revo Mirror", color: "#32cd32" },
      { name: "Lime", color: "#00ff00" },
    ],
  },
]

// Updated 360 icon component to match the new design
const Icon360 = ({ className }: { className?: string }) => (
  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12.7456 22.9877C9.83761 22.6015 7.44076 21.8063 5.55508 20.6022C3.6694 19.3981 2.72656 18.0122 2.72656 16.4446C2.72656 14.5589 4.03881 12.9518 6.66331 11.6232C9.28781 10.2946 12.5194 9.62982 16.358 9.62891C20.1966 9.628 23.4286 10.2928 26.054 11.6232C28.6794 12.9536 29.9912 14.5608 29.9894 16.4446C29.9894 17.7169 29.3705 18.8701 28.1328 19.9043C26.895 20.9384 25.2534 21.7504 23.2077 22.3402C22.8442 22.4538 22.5207 22.4029 22.2372 22.1875C21.9537 21.9721 21.8114 21.6818 21.8105 21.3165C21.8105 20.9075 21.93 20.544 22.169 20.226C22.408 19.9079 22.7202 19.6807 23.1055 19.5444C24.4687 19.09 25.5024 18.5734 26.2067 17.9945C26.9109 17.4156 27.2631 16.899 27.2631 16.4446C27.2631 15.7176 26.2916 14.8543 24.3487 13.8546C22.4058 12.855 19.7422 12.3552 16.358 12.3552C12.9737 12.3552 10.3097 12.855 8.36588 13.8546C6.42204 14.8543 5.45103 15.7176 5.45284 16.4446C5.45284 16.9899 6.03218 17.6433 7.19085 18.4048C8.34952 19.1663 9.99665 19.7398 12.1322 20.1251L11.3143 19.3072C11.0644 19.0573 10.9395 18.7392 10.9395 18.353C10.9395 17.9668 11.0644 17.6487 11.3143 17.3988C11.5643 17.1489 11.8823 17.0239 12.2685 17.0239C12.6548 17.0239 12.9728 17.1489 13.2227 17.3988L16.7669 20.943C17.0395 21.2156 17.1759 21.5337 17.1759 21.8972C17.1759 22.2607 17.0395 22.5787 16.7669 22.8514L13.2227 26.3955C12.9728 26.6454 12.6607 26.7763 12.2863 26.7881C11.9119 26.7999 11.5879 26.6691 11.3143 26.3955C11.0644 26.1456 10.9336 25.8335 10.9218 25.4591C10.9099 25.0847 11.0295 24.7607 11.2803 24.4871L12.7456 22.9877Z"
      fill="currentColor"
    />
  </svg>
)

export default function ProductViewB() {
  const [viewMode, setViewMode] = useState<"360" | "try-on">("360")
  const [products, setProducts] = useState<(Product | null)[]>(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState(products[0] as Product)
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false)
  const [newProductIndex, setNewProductIndex] = useState<number | null>(null)
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [productPositions, setProductPositions] = useState<{ [key: number]: { top: number; left: number } }>({})
  const [initialPositions, setInitialPositions] = useState<{ [key: number]: { top: number; left: number } }>({})
  const productRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [uiSettings, setUISettings] = useState<UISettings>({
    accentColor: "#2770E5",
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

  // Update selected product when products change
  useEffect(() => {
    // Find the first non-null product
    const firstProduct = products.find((p) => p !== null) as Product
    if (selectedProduct && products.includes(selectedProduct)) {
      // Keep the current selection if it still exists
    } else if (firstProduct) {
      // Select the first available product
      setSelectedProduct(firstProduct)
    }
  }, [products])

  // Add global cursor style when dragging
  useEffect(() => {
    if (isDragging) {
      document.body.classList.add("dragging")
    } else {
      document.body.classList.remove("dragging")
    }

    return () => {
      document.body.classList.remove("dragging")
    }
  }, [isDragging])

  // Capture initial positions of all product items
  useEffect(() => {
    if (!isDragging) {
      const positions: { [key: number]: { top: number; left: number } } = {}

      products.forEach((product, index) => {
        if (product) {
          const element = productRefs.current[product.id]
          if (element) {
            const rect = element.getBoundingClientRect()
            positions[product.id] = { top: rect.top, left: rect.left }
          }
        }
      })

      setInitialPositions(positions)
      setProductPositions(positions)
    }
  }, [products, isDragging])

  // Update viewMode when settings change
  useEffect(() => {
    // If current view mode is disabled, switch to the other mode
    if (viewMode === "360" && !uiSettings.show360View) {
      setViewMode("try-on")
    } else if (viewMode === "try-on" && !uiSettings.showTryOnView) {
      setViewMode("360")
    }
  }, [uiSettings, viewMode])

  const handleProductEdit = (product: Product) => {
    setProductToEdit(product)
    setIsCreatingNewProduct(false)
    setIsEditModalOpen(true)
  }

  const handleCreateNewProduct = (index: number) => {
    // Create a template for a new product
    const newProduct: Product = {
      id: Date.now(), // Use timestamp as temporary ID
      name: "New Product",
      description: "Add product description",
      price: 499.0,
      image: "/placeholder.svg?height=160&width=160",
      modelUrl: "",
      tryOnUrl: "",
    }

    setProductToEdit(newProduct)
    setIsCreatingNewProduct(true)
    setNewProductIndex(index)
    setIsEditModalOpen(true)
  }

  const handleSaveProduct = (updatedProduct: Product) => {
    if (isCreatingNewProduct && newProductIndex !== null) {
      // Add new product at the specified index
      const updatedProducts = [...products]
      updatedProducts[newProductIndex] = updatedProduct
      setProducts(updatedProducts)
      setSelectedProduct(updatedProduct)
    } else {
      // Update existing product
      setProducts((prevProducts) => prevProducts.map((p) => (p && p.id === updatedProduct.id ? updatedProduct : p)))
      if (selectedProduct.id === updatedProduct.id) {
        setSelectedProduct(updatedProduct)
      }
    }

    setIsCreatingNewProduct(false)
    setNewProductIndex(null)
  }

  const handleBuyNowClick = () => {
    if (selectedProduct && selectedProduct.buyNowLink) {
      window.open(selectedProduct.buyNowLink, "_blank")
    }
  }

  const handleDeleteProduct = (productId: number) => {
    // Find the index of the product to delete
    const indexToDelete = products.findIndex((p) => p && p.id === productId)

    if (indexToDelete !== -1) {
      // Create a new array with the product removed and null moved to the end
      const updatedProducts = [...products]
      updatedProducts.splice(indexToDelete, 1) // Remove the product
      updatedProducts.push(null) // Add null at the end

      setProducts(updatedProducts)

      // If the selected product is being deleted, select another one
      if (selectedProduct.id === productId) {
        const nextProduct = updatedProducts.find((p) => p !== null) as Product
        if (nextProduct) {
          setSelectedProduct(nextProduct)
        }
      }
    }
  }

  const handleSaveSettings = (newSettings: UISettings) => {
    setUISettings(newSettings)
  }

  // Drag and drop handlers
  const handleDragStart = (product: Product, index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!e || !product) return // Guard against undefined event or null product

    setDraggedProduct(product)
    setIsDragging(true)

    // Set the drag image to be the product image
    const dragImage = new Image()
    dragImage.src = product.image
    dragImage.width = 50
    dragImage.height = 50
    dragImage.style.opacity = "0.7"

    // Set the drag image with offset
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(dragImage, 25, 25)
      e.dataTransfer.setData("text/plain", product.id.toString())
      e.dataTransfer.effectAllowed = "move"
    }

    // Add a class to the dragged element for styling
    if (e.currentTarget) {
      e.currentTarget.classList.add("dragging")
    }

    // Capture initial positions
    const positions: { [key: number]: { top: number; left: number } } = {}
    products.forEach((p, i) => {
      if (p) {
        const element = productRefs.current[p.id]
        if (element) {
          const rect = element.getBoundingClientRect()
          positions[p.id] = { top: rect.top, left: rect.left }
        }
      }
    })

    setInitialPositions(positions)
    setProductPositions(positions)
  }

  const handleDragOver = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!e || !draggedProduct) return

    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move"
    }

    // Update the dragOverIndex to show where the item will be placed
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnter = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!e || !draggedProduct) return
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e) return
    e.preventDefault()
    // Only clear the dragOverIndex if we're leaving to an element that's not a valid drop target
    if (!e.currentTarget.classList.contains("product-item")) {
      setDragOverIndex(null)
    }
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e) return

    setIsDragging(false)
    setDraggedProduct(null)
    setDragOverIndex(null)

    // Remove the dragging class
    if (e.currentTarget) {
      e.currentTarget.classList.remove("dragging")
    }

    // Reset all product items
    const items = document.querySelectorAll(".product-item")
    items.forEach((item) => {
      ;(item as HTMLElement).style.transform = ""
      item.classList.remove("dragging", "drag-over")
    })

    // Reset positions
    setProductPositions({})
  }

  const handleDrop = (targetIndex: number) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!e || !draggedProduct) return

    e.preventDefault()

    // Find the index of the dragged product
    const draggedIndex = products.findIndex((p) => p && p.id === draggedProduct.id)

    if (draggedIndex === targetIndex) {
      return
    }

    // Create a new array with the swapped products
    const reorderedProducts = [...products]

    // Swap the positions
    const temp = reorderedProducts[draggedIndex]
    reorderedProducts[draggedIndex] = reorderedProducts[targetIndex]
    reorderedProducts[targetIndex] = temp

    // Update the state
    setProducts(reorderedProducts)
    setIsDragging(false)
    setDraggedProduct(null)
    setDragOverIndex(null)
    setProductPositions({})
  }

  // Safe event handler for mouse events
  const handleMouseDown = (element: HTMLElement) => {
    if (element) {
      element.style.cursor = "grabbing"
    }
  }

  const handleMouseUp = (element: HTMLElement) => {
    if (element) {
      element.style.cursor = ""
    }
  }

  // Safe handler for product selection
  const handleProductSelect = (product: Product) => {
    if (!isDragging && product) {
      setSelectedProduct(product)
    }
  }

  // Safe handler for edit button click
  const handleEditButtonClick = (e: React.MouseEvent, product: Product) => {
    if (e) {
      e.stopPropagation()
    }
    handleProductEdit(product)
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
      {/* Add CSS for drag and drop animations */}
      <style jsx global>{`
        .product-item {
          transition: transform 0.3s ease, opacity 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          z-index: 1;
        }
        
        .product-item.dragging {
          opacity: 0.6;
          z-index: 10;
          cursor: grabbing !important;
        }
        
        .product-item.drag-over {
          transform: scale(1.05);
          z-index: 5;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        
        /* Custom cursor styles */
        .product-item {
          cursor: default;
        }
        
        .product-item:active {
          cursor: grabbing;
        }
        
        body.dragging * {
          cursor: grabbing !important;
        }
        
        .product-item-animated {
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s ease;
        }

        .empty-product-slot {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f2f2f2;
          border: 2px dashed #d1d1d1;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .empty-product-slot:hover {
          background-color: #e8e8e8;
          border-color: #b1b1b1;
        }

        .empty-product-slot .plus-icon {
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }

        .empty-product-slot:hover .plus-icon {
          opacity: 1;
        }
      `}</style>

      {/* Load Model Viewer script */}
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        onLoad={() => setModelViewerLoaded(true)}
      />

      {/* Mobile Layout */}
      {isMobile ? (
        <div
          className="flex flex-col w-full h-[100vh] overflow-hidden bg-[#f2f2f2]"
          style={{ fontFamily: "Sohne, sans-serif" }}
        >
          {/* Full screen container for try-on mode */}
          {currentViewMode === "try-on" && selectedProduct && (
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

          {/* UI Container - always on top */}
          <div className="relative z-10 flex flex-col w-full h-full">
            {/* View mode toggle - only show if both options are enabled */}
            {showViewModeToggle && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex rounded-full bg-[#9b9b9b] p-1 w-[280px]" role="tablist" aria-label="View modes">
                  <button
                    onClick={() => setViewMode("360")}
                    className={`flex items-center justify-center gap-1 py-2 px-4 rounded-full w-1/2 transition-colors ${
                      currentViewMode === "360" ? "bg-[#ffffff]" : "bg-transparent"
                    }`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      color: currentViewMode === "360" ? uiSettings.accentColor : "#FFFFFF",
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
                      currentViewMode === "try-on" ? "bg-[#ffffff]" : "bg-transparent"
                    }`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      color: currentViewMode === "try-on" ? uiSettings.accentColor : "#FFFFFF",
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

            {/* 360 Viewer - only visible in 360 mode */}
            {currentViewMode === "360" && (
              <div
                className="w-full h-[75vh] flex items-center justify-center"
                id="360-view"
                role="tabpanel"
                aria-labelledby="360-tab"
              >
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
                    style={{ width: "100%", height: "100%", backgroundColor: uiSettings.viewerBackgroundColor }}
                  ></model-viewer>
                ) : (
                  <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                    {selectedProduct ? "Loading 3D model..." : "No product selected"}
                  </div>
                )}
              </div>
            )}

            {/* Bottom UI Section */}
            <div className={`w-full flex flex-col items-center ${currentViewMode === "try-on" ? "mt-auto" : ""}`}>
              {/* Product Name with Edit Button */}
              <div className="flex items-center justify-center mb-3 relative w-full px-4">
                <h1
                  className={`text-[22px] font-medium text-center ${
                    currentViewMode === "try-on" ? "text-[#ffffff]" : "text-[#4c4c4c]"
                  }`}
                  style={{ fontFamily: "Sohne, sans-serif" }}
                >
                  {selectedProduct ? selectedProduct.name : "No product selected"}
                </h1>
                {selectedProduct && (
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className={`absolute right-10 p-1.5 rounded-full ${
                      currentViewMode === "try-on" ? "bg-black bg-opacity-30" : "bg-white"
                    } shadow-sm`}
                    aria-label="Settings"
                    style={{ color: currentViewMode === "try-on" ? "#ffffff" : uiSettings.accentColor }}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Thumbnails - horizontal scroll on mobile with circular design */}
              <div className="overflow-x-auto w-full mb-3 px-2 py-3">
                <div className="flex gap-4 px-4 min-w-max">
                  {products.map((product, index) => {
                    const isSelected = product && selectedProduct && selectedProduct.id === product.id
                    const isBeingDragged = draggedProduct && product && draggedProduct.id === product.id
                    const isDraggedOver = dragOverIndex === index

                    if (product) {
                      // Render product item
                      return (
                        <div
                          key={index}
                          ref={(el) => product && (productRefs.current[product.id] = el)}
                          className={`relative flex-shrink-0 product-item product-item-animated
                            ${isBeingDragged ? "dragging" : ""}
                            ${isDraggedOver ? "drag-over" : ""}
                          `}
                          style={{
                            transform:
                              product && !isBeingDragged && productPositions[product.id] && initialPositions[product.id]
                                ? `translate(${productPositions[product.id].left - initialPositions[product.id].left}px, ${productPositions[product.id].top - initialPositions[product.id].top}px)`
                                : "",
                          }}
                          draggable={!!product}
                          onMouseDown={(e) => handleMouseDown(e.currentTarget)}
                          onMouseUp={(e) => handleMouseUp(e.currentTarget)}
                          onDragStart={handleDragStart(product, index)}
                          onDragOver={handleDragOver(index)}
                          onDragEnter={handleDragEnter(index)}
                          onDragLeave={handleDragLeave}
                          onDragEnd={handleDragEnd}
                          onDrop={handleDrop(index)}
                          onClick={() => handleProductSelect(product)}
                        >
                          <div
                            className={`w-[60px] h-[60px] overflow-hidden flex items-center justify-center bg-white`}
                            style={{
                              borderRadius: `${uiSettings.productCornerRadius}px`,
                              ...(isSelected
                                ? {
                                    boxShadow: `0 0 0 3px ${uiSettings.accentColor}, 0 0 0 4px white`,
                                  }
                                : {}),
                            }}
                          >
                            <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center relative">
                              <Image
                                src={product.image || "/placeholder.svg?height=50&width=50"}
                                alt={`${product.name} view`}
                                width={50}
                                height={50}
                                className="object-contain"
                                draggable={false}
                              />
                            </div>
                          </div>
                          <div className="absolute top-0 right-0">
                            <button
                              onClick={(e) => handleEditButtonClick(e, product)}
                              className="p-0.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                              aria-label="Edit product"
                            >
                              <Edit2 className="w-2.5 h-2.5" style={{ color: uiSettings.accentColor }} />
                            </button>
                          </div>
                        </div>
                      )
                    } else {
                      // Render empty slot
                      return (
                        <div
                          key={index}
                          className={`relative flex-shrink-0 w-[60px] h-[60px] empty-product-slot rounded-full
                            ${isDraggedOver ? "drag-over" : ""}
                          `}
                          style={{ borderRadius: `${uiSettings.productCornerRadius}px` }}
                          onDragOver={handleDragOver(index)}
                          onDragEnter={handleDragEnter(index)}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop(index)}
                          onClick={() => handleCreateNewProduct(index)}
                        >
                          <Plus className="w-5 h-5 text-[#9b9b9b] plus-icon" />
                        </div>
                      )
                    }
                  })}
                </div>
              </div>

              {/* Buy button and Price - Mobile */}
              <div className="w-full px-4 py-3">
                <div
                  className={`bg-white rounded-lg p-4 flex justify-between items-center ${currentViewMode === "try-on" ? "bg-opacity-80 backdrop-blur-sm" : ""}`}
                >
                  <div>
                    <h2 className="text-[24px] font-bold text-[#000000]" style={{ fontFamily: "Sohne, sans-serif" }}>
                      {selectedProduct ? `$${selectedProduct.price.toFixed(0)}` : "$0"}
                    </h2>
                    <p className="text-[12px] text-[#909090]" style={{ fontFamily: "Sohne, sans-serif" }}>
                      {selectedProduct ? selectedProduct.description : "No product selected"}
                    </p>
                  </div>
                  <button
                    onClick={handleBuyNowClick}
                    disabled={!selectedProduct}
                    className={`${selectedProduct ? "" : "bg-[#c6c6c6]"} text-white px-4 py-2`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      backgroundColor: selectedProduct ? uiSettings.accentColor : "#c6c6c6",
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
        // Desktop Layout - ORIGINAL STACKED LAYOUT
        <div
          className="flex flex-col w-full h-[100vh] overflow-hidden bg-[#f2f2f2]"
          style={{ fontFamily: "Sohne, sans-serif" }}
        >
          {/* Full screen container for try-on mode */}
          {currentViewMode === "try-on" && selectedProduct && (
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

          {/* UI Container - always on top */}
          <div className="relative z-10 flex flex-col w-full h-full">
            {/* View mode toggle - only show if both options are enabled */}
            {showViewModeToggle && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex rounded-full bg-[#9b9b9b] p-1 w-[350px]" role="tablist" aria-label="View modes">
                  <button
                    onClick={() => setViewMode("360")}
                    className={`flex items-center justify-center gap-2 py-2 px-6 rounded-full w-1/2 transition-colors ${
                      currentViewMode === "360" ? "bg-[#ffffff]" : "bg-transparent"
                    }`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      color: currentViewMode === "360" ? uiSettings.accentColor : "#FFFFFF",
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
                      currentViewMode === "try-on" ? "bg-[#ffffff]" : "bg-transparent"
                    }`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      color: currentViewMode === "try-on" ? uiSettings.accentColor : "#FFFFFF",
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

            {/* 360 Viewer - only visible in 360 mode */}
            {currentViewMode === "360" && (
              <div
                className="w-full h-[80vh] flex items-center justify-center"
                id="360-view-desktop"
                role="tabpanel"
                aria-labelledby="360-tab-desktop"
              >
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
                    style={{ width: "100%", height: "100%", backgroundColor: uiSettings.viewerBackgroundColor }}
                  ></model-viewer>
                ) : (
                  <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                    {selectedProduct ? "Loading 3D model..." : "No product selected"}
                  </div>
                )}
              </div>
            )}

            {/* Bottom UI Section */}
            <div className={`w-full flex flex-col items-center ${currentViewMode === "try-on" ? "mt-auto" : ""}`}>
              {/* Product Name with Edit Button */}
              <div className="flex items-center justify-center mb-4 relative w-full px-4">
                <h1
                  className={`text-[26px] font-medium text-center ${
                    currentViewMode === "try-on" ? "text-[#ffffff]" : "text-[#4c4c4c]"
                  }`}
                  style={{ fontFamily: "Sohne, sans-serif" }}
                >
                  {selectedProduct ? selectedProduct.name : "No product selected"}
                </h1>
                {selectedProduct && (
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className={`absolute right-12 p-2 rounded-full ${
                      currentViewMode === "try-on" ? "bg-black bg-opacity-30" : "bg-white"
                    } shadow-sm`}
                    aria-label="Settings"
                    style={{ color: currentViewMode === "try-on" ? "#ffffff" : uiSettings.accentColor }}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Thumbnails row */}
              <div className="flex justify-center gap-4 mb-4">
                {products.map((product, index) => {
                  const isSelected = product && selectedProduct && selectedProduct.id === product.id
                  const isBeingDragged = draggedProduct && product && draggedProduct.id === product.id
                  const isDraggedOver = dragOverIndex === index

                  if (product) {
                    // Render product item
                    return (
                      <div
                        key={index}
                        ref={(el) => product && (productRefs.current[product.id] = el)}
                        className={`relative product-item product-item-animated
                          ${isBeingDragged ? "dragging" : ""}
                          ${isDraggedOver ? "drag-over" : ""}
                        `}
                        style={{
                          transform:
                            product && !isBeingDragged && productPositions[product.id] && initialPositions[product.id]
                              ? `translate(${productPositions[product.id].left - initialPositions[product.id].left}px, ${productPositions[product.id].top - initialPositions[product.id].top}px)`
                              : "",
                        }}
                        draggable={!!product}
                        onMouseDown={(e) => handleMouseDown(e.currentTarget)}
                        onMouseUp={(e) => handleMouseUp(e.currentTarget)}
                        onDragStart={handleDragStart(product, index)}
                        onDragOver={handleDragOver(index)}
                        onDragEnter={handleDragEnter(index)}
                        onDragLeave={handleDragLeave}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop(index)}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div
                          className={`w-[78px] h-[78px] overflow-hidden flex items-center justify-center bg-white`}
                          style={{
                            borderRadius: `${uiSettings.productCornerRadius}px`,
                            ...(isSelected
                              ? {
                                  boxShadow: `0 0 0 3px ${uiSettings.accentColor}`,
                                }
                              : {}),
                          }}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                            <Image
                              src={product.image || "/placeholder.svg?height=65&width=65"}
                              alt={`${product.name} view`}
                              width={65}
                              height={65}
                              className="object-contain"
                              draggable={false}
                            />
                          </div>
                        </div>
                        <div className="absolute top-0 right-0">
                          <button
                            onClick={(e) => handleEditButtonClick(e, product)}
                            className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                            aria-label="Edit product"
                          >
                            <Edit2 className="w-3 h-3" style={{ color: uiSettings.accentColor }} />
                          </button>
                        </div>
                      </div>
                    )
                  } else {
                    // Render empty slot
                    return (
                      <div
                        key={index}
                        className={`relative w-[78px] h-[78px] empty-product-slot rounded-full
                          ${isDraggedOver ? "drag-over" : ""}
                        `}
                        style={{ borderRadius: `${uiSettings.productCornerRadius}px` }}
                        onDragOver={handleDragOver(index)}
                        onDragEnter={handleDragEnter(index)}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop(index)}
                        onClick={() => handleCreateNewProduct(index)}
                      >
                        <Plus className="w-6 h-6 text-[#9b9b9b] plus-icon" />
                      </div>
                    )
                  }
                })}
              </div>

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
                      {selectedProduct ? `$${selectedProduct.price.toFixed(0)}` : "$0"}
                    </h2>
                    <p className="text-[14px] text-[#909090] leading-tight" style={{ fontFamily: "Sohne, sans-serif" }}>
                      {selectedProduct ? selectedProduct.description : "No product selected"}
                    </p>
                  </div>
                  <button
                    onClick={handleBuyNowClick}
                    disabled={!selectedProduct}
                    className={`${selectedProduct ? "" : "bg-[#c6c6c6]"} text-white px-6 py-2`}
                    style={{
                      fontFamily: "Sohne, sans-serif",
                      backgroundColor: selectedProduct ? uiSettings.accentColor : "#c6c6c6",
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
      {(productToEdit || isCreatingNewProduct) && (
        <ProductEditModal
          product={productToEdit as Product}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setIsCreatingNewProduct(false)
            setNewProductIndex(null)
          }}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={uiSettings}
        onSave={handleSaveSettings}
      />
    </>
  )
}
