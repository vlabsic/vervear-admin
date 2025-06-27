"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Edit2, Plus, Settings } from "lucide-react"
import Image from "next/image"
import Script from "next/script"
import ProductEditModal, { type Product } from "./product-edit-modal"
import SettingsModal, { type UISettings } from "./settings-modal"

// Sample initial products - replace with your own products
const initialProducts: (Product | null)[] = [
  {
    id: 1,
    name: "AssaultBike Classic",
    description: "High-performance air bike for intense workouts",
    price: 699.0,
    image: "/placeholder.svg?height=160&width=160", // Replace with your image
    modelUrl: "/placeholder.glb", // Replace with your 3D model URL
    buyNowLink: "#",
  },
  {
    id: 2,
    name: "AssaultBike Elite",
    description: "Premium air bike with advanced features",
    price: 999.0,
    image: "/placeholder.svg?height=160&width=160", // Replace with your image
    modelUrl: "/placeholder.glb", // Replace with your 3D model URL
    buyNowLink: "#",
  },
  {
    id: 3,
    name: "AssaultBike Pro",
    description: "Professional-grade air bike for gyms",
    price: 1299.0,
    image: "/placeholder.svg?height=160&width=160", // Replace with your image
    modelUrl: "/placeholder.glb", // Replace with your 3D model URL
    buyNowLink: "#",
  },
  null, // Empty slots for positions 4-12
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
]

export default function ProductSection() {
  const [products, setProducts] = useState<(Product | null)[]>(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState(products[0] as Product)
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false)
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
    accentColor: "#ff5e1a",
    productCornerRadius: 6,
    buttonCornerRadius: 8,
  })
  const [isEditingHotspots, setIsEditingHotspots] = useState(false)

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
  }, [products, selectedProduct])

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
      price: 699.0,
      image: "/placeholder.svg?height=160&width=160",
      modelUrl: "",
      buyNowLink: "#",
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

  const handleAddToCart = () => {
    if (selectedProduct && selectedProduct.buyNowLink) {
      // In a real app, you would add the product to cart here
      alert(`Added ${selectedProduct.name} to cart!`)
      // Or navigate to the cart page
      // window.location.href = "/cart"
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

  // Add a function to handle saving settings
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

  const toggleHotspotEditing = () => {
    setIsEditingHotspots(!isEditingHotspots)
  }

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
        <div className="flex flex-col w-full min-h-screen bg-[#ffffff]" style={{ fontFamily: "Sohne, sans-serif" }}>
          {/* AR Viewer - Full width on mobile */}
          <div className="w-full h-[calc(100vh-300px)] bg-[#f2f2f2] flex flex-col items-center justify-center relative">
            {/* Hotspot editing button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={toggleHotspotEditing}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${
                  isEditingHotspots ? "bg-[#ff5e1a] text-white" : "bg-white text-[#333333]"
                }`}
              >
                {isEditingHotspots ? "Done" : "Edit Hotspots"}
              </button>
            </div>

            {/* Viewer content */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                {modelViewerLoaded && selectedProduct ? (
                  <model-viewer
                    src={selectedProduct.modelUrl}
                    alt={`${selectedProduct.name} 3D model`}
                    camera-controls
                    auto-rotate
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    ar-scale="fixed"
                    exposure="0.5"
                    shadow-intensity="1"
                    environment-image="neutral"
                    style={{ width: "100%", height: "100%", backgroundColor: "#F2F2F2" }}
                  >
                    <button
                      slot="ar-button"
                      className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-full shadow-md absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    >
                      <span className="material-icons">view_in_ar</span>
                      VIEW IN YOUR SPACE
                    </button>
                  </model-viewer>
                ) : (
                  <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                    {selectedProduct ? "Loading 3D model..." : "No product selected"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info - Mobile height */}
          <div
            className="w-full h-[300px] p-6 flex flex-col justify-between"
            style={{ fontFamily: "Sohne, sans-serif" }}
          >
            <div className="flex justify-between items-start">
              <div>
                {selectedProduct ? (
                  <>
                    <h1
                      className="text-[24px] font-bold text-[#000000] mb-1"
                      style={{ fontFamily: "Sohne, sans-serif" }}
                    >
                      {selectedProduct.name}
                    </h1>
                    <p className="text-[18px] text-[#9b9b9b]" style={{ fontFamily: "Sohne, sans-serif" }}>
                      {selectedProduct.description}
                    </p>
                  </>
                ) : (
                  <h1 className="text-[24px] font-bold text-[#000000] mb-1" style={{ fontFamily: "Sohne, sans-serif" }}>
                    No product selected
                  </h1>
                )}
              </div>
              {selectedProduct && (
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 hover:bg-gray-100 bg-white rounded-full shadow-sm"
                  aria-label="Settings"
                  style={{ color: uiSettings.accentColor }}
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Thumbnails - horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-3 -mx-2">
              <div className="flex gap-3 px-4 py-2">
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
                        className={`relative flex-shrink-0 w-[67px] h-[70px] product-item product-item-animated
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
                          className={`w-full h-full bg-[#f2f2f2] overflow-hidden flex items-center justify-center`}
                          style={{
                            borderRadius: `${uiSettings.productCornerRadius}px`,
                            ...(isSelected
                              ? {
                                  boxShadow: `0 0 0 2px ${uiSettings.accentColor}, 0 0 0 4px white`,
                                }
                              : {}),
                          }}
                        >
                          <Image
                            src={product.image || "/placeholder.svg?height=160&width=160"}
                            alt={`${product.name} view`}
                            width={160}
                            height={160}
                            className="object-contain w-full h-full"
                            draggable={false}
                          />
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <button
                            onClick={(e) => handleEditButtonClick(e, product)}
                            className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                            aria-label="Edit product"
                          >
                            <Edit2 className="w-3 h-3 text-[#ff5e1a]" />
                          </button>
                        </div>
                      </div>
                    )
                  } else {
                    // Render empty slot
                    return (
                      <div
                        key={index}
                        className={`relative flex-shrink-0 w-[67px] h-[70px] empty-product-slot
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

            {/* Add to Cart button */}
            <div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedProduct}
                className={`w-full ${selectedProduct ? "" : "bg-[#c6c6c6]"} text-white px-6 flex items-center justify-between`}
                style={{
                  fontFamily: "Sohne, sans-serif",
                  height: "50px",
                  backgroundColor: selectedProduct ? uiSettings.accentColor : "#c6c6c6",
                  borderRadius: `${uiSettings.buttonCornerRadius}px`,
                }}
              >
                <span className="text-xl font-medium">ADD TO CART</span>
                <span className="text-xl font-medium">
                  {selectedProduct ? `$ ${selectedProduct.price.toFixed(2)}` : "$ 0.00"}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Desktop/Tablet Layout
        <div className="flex flex-row w-full min-h-screen bg-[#ffffff]" style={{ fontFamily: "Sohne, sans-serif" }}>
          {/* Left side - AR Viewer */}
          <div className="w-3/5 bg-[#f2f2f2] flex flex-col items-center justify-center relative">
            {/* Hotspot editing button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={toggleHotspotEditing}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${
                  isEditingHotspots ? "bg-[#ff5e1a] text-white" : "bg-white text-[#333333]"
                }`}
              >
                {isEditingHotspots ? "Done" : "Edit Hotspots"}
              </button>
            </div>

            {/* Viewer content */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                {modelViewerLoaded && selectedProduct ? (
                  <model-viewer
                    src={selectedProduct.modelUrl}
                    alt={`${selectedProduct.name} 3D model`}
                    camera-controls
                    auto-rotate
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    ar-scale="fixed"
                    exposure="0.5"
                    shadow-intensity="1"
                    environment-image="neutral"
                    style={{ width: "100%", height: "100%", backgroundColor: "#F2F2F2" }}
                  >
                    <button
                      slot="ar-button"
                      className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full shadow-md absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    >
                      <span className="material-icons">view_in_ar</span>
                      VIEW IN YOUR SPACE
                    </button>
                  </model-viewer>
                ) : (
                  <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                    {selectedProduct ? "Loading 3D model..." : "No product selected"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Product Info */}
          <div className="w-2/5 p-8 flex flex-col" style={{ fontFamily: "Sohne, sans-serif" }}>
            <div className="flex justify-between items-start mb-8">
              <div>
                {selectedProduct ? (
                  <>
                    <h1 className="text-4xl font-bold text-[#000000] mb-2" style={{ fontFamily: "Sohne, sans-serif" }}>
                      {selectedProduct.name}
                    </h1>
                    <p className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Sohne, sans-serif" }}>
                      {selectedProduct.description}
                    </p>
                  </>
                ) : (
                  <h1 className="text-4xl font-bold text-[#000000] mb-2" style={{ fontFamily: "Sohne, sans-serif" }}>
                    No product selected
                  </h1>
                )}
              </div>
              {selectedProduct && (
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 hover:bg-gray-100 bg-white rounded-full shadow-sm"
                  aria-label="Settings"
                  style={{ color: uiSettings.accentColor }}
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Thumbnails grid */}
            <div className="grid grid-cols-4 gap-4 mb-auto">
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
                        className={`aspect-square bg-[#f2f2f2] overflow-hidden flex items-center justify-center`}
                        style={{
                          borderRadius: `${uiSettings.productCornerRadius}px`,
                          ...(isSelected
                            ? {
                                boxShadow: `0 0 0 2px ${uiSettings.accentColor}`,
                              }
                            : {}),
                        }}
                      >
                        <Image
                          src={product.image || "/placeholder.svg?height=160&width=160"}
                          alt={`${product.name} view`}
                          width={160}
                          height={160}
                          className="object-contain w-full h-full"
                          draggable={false}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <button
                          onClick={(e) => handleEditButtonClick(e, product)}
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          aria-label="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#ff5e1a]" />
                        </button>
                      </div>
                    </div>
                  )
                } else {
                  // Render empty slot
                  return (
                    <div
                      key={index}
                      className={`relative aspect-square empty-product-slot
                      ${isDraggedOver ? "drag-over" : ""}
                    `}
                      style={{ borderRadius: `${uiSettings.productCornerRadius}px` }}
                      onDragOver={handleDragOver(index)}
                      onDragEnter={handleDragEnter(index)}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop(index)}
                      onClick={() => handleCreateNewProduct(index)}
                    >
                      <Plus className="w-8 h-8 text-[#9b9b9b] plus-icon" />
                    </div>
                  )
                }
              })}
            </div>

            {/* Add to Cart button */}
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedProduct}
                className={`w-full ${selectedProduct ? "" : "bg-[#c6c6c6]"} text-white py-4 px-6 flex items-center justify-between`}
                style={{
                  fontFamily: "Sohne, sans-serif",
                  backgroundColor: selectedProduct ? uiSettings.accentColor : "#c6c6c6",
                  borderRadius: `${uiSettings.buttonCornerRadius}px`,
                }}
              >
                <span className="text-xl font-medium">ADD TO CART</span>
                <span className="text-xl font-medium">
                  {selectedProduct ? `$ ${selectedProduct.price.toFixed(2)}` : "$ 0.00"}
                </span>
              </button>
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
