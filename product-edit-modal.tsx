"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Camera, LinkIcon } from "lucide-react"
import Image from "next/image"

export type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
  modelUrl: string
  tryOnUrl?: string
  buyNowLink?: string
}

// Add a new prop for handling product deletion
type ProductEditModalProps = {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSave: (updatedProduct: Product) => void
  onDelete: (productId: number) => void
}

// Helper function to handle file uploads
async function handleFileUpload(file: File, acceptedTypes: string[]): Promise<{ file: File; url: string } | null> {
  // Validate file type
  const fileType = file.type.split("/")[1]?.toLowerCase()
  const isValidType = acceptedTypes.some((type) => file.name.toLowerCase().endsWith(type) || fileType === type)

  if (!isValidType) {
    alert(`Please upload a valid file type: ${acceptedTypes.join(", ")}`)
    return null
  }

  // Create a URL for the file
  const fileUrl = URL.createObjectURL(file)

  return {
    file,
    url: fileUrl,
  }
}

// Update the function signature to include onDelete
export default function ProductEditModal({ product, isOpen, onClose, onSave, onDelete }: ProductEditModalProps) {
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product })
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const modelInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Reset form when product changes
  useEffect(() => {
    setEditedProduct({ ...product })
    setModelFile(null)
    setImageFile(null)
    setShowDeleteConfirmation(false)
  }, [product, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let newValue: string | number = value

    if (name === "price") {
      newValue = Number.parseFloat(value) || 0
    }

    setEditedProduct((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await handleFileUpload(file, ["glb", "gltf"])
    if (result) {
      setModelFile(file)
      setEditedProduct((prev) => ({
        ...prev,
        modelUrl: result.url,
      }))

      // Generate a thumbnail from the model if no image is provided
      if (!editedProduct.image || editedProduct.image.includes("placeholder")) {
        setIsGeneratingImage(true)
        try {
          // In a real app, you would generate a thumbnail from the 3D model
          // For now, we'll just use a placeholder
          setTimeout(() => {
            setEditedProduct((prev) => ({
              ...prev,
              image: "/placeholder.svg?height=160&width=160&text=Generated",
            }))
            setIsGeneratingImage(false)
          }, 1000)
        } catch (error) {
          console.error("Failed to generate model image:", error)
          setIsGeneratingImage(false)
        }
      }
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await handleFileUpload(file, ["jpg", "jpeg", "png"])
    if (result) {
      setImageFile(file)
      setEditedProduct((prev) => ({
        ...prev,
        image: result.url,
      }))
    }
  }

  const handleSave = () => {
    onSave(editedProduct)
    onClose()
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true)
  }

  const handleConfirmDelete = () => {
    onDelete(product.id)
    onClose()
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6"
        style={{ fontFamily: "Sohne, sans-serif" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

        {showDeleteConfirmation ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Are you sure you want to delete this product?</h3>
            <p className="text-red-600 mb-4">This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                No, cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Text fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5e1a]"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editedProduct.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5e1a]"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5e1a]"
                />
              </div>

              <div>
                <label htmlFor="buyNowLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Buy Now Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="buyNowLink"
                    name="buyNowLink"
                    value={editedProduct.buyNowLink || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/product"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5e1a]"
                  />
                  <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Right column - Files and previews */}
            <div className="space-y-6">
              {/* 3D Model Upload */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">3D Model (.glb)</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                    {isGeneratingImage ? (
                      <div className="animate-pulse">Generating...</div>
                    ) : (
                      <model-viewer
                        src={editedProduct.modelUrl}
                        alt="3D model preview"
                        camera-controls
                        auto-rotate
                        disable-zoom
                        style={{ width: "100%", height: "100%" }}
                      ></model-viewer>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => modelInputRef.current?.click()}
                    className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload .glb
                  </button>
                  <input
                    ref={modelInputRef}
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleModelUpload}
                    className="hidden"
                  />
                </div>
                {modelFile && <p className="text-xs text-gray-500 mt-1">{modelFile.name}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Product Image (.jpg, .png)</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                    {isGeneratingImage ? (
                      <div className="animate-pulse text-center text-xs">
                        <span>Generating image from model...</span>
                      </div>
                    ) : (
                      <Image
                        src={editedProduct.image || "/placeholder.svg?height=80&width=80"}
                        alt="Product image"
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Image
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {imageFile && <p className="text-xs text-gray-500 mt-1">{imageFile.name}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {!showDeleteConfirmation && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-md shadow-sm text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Product
            </button>
          )}

          <div className="flex space-x-4 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5e1a]"
            >
              Cancel
            </button>
            {!showDeleteConfirmation && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-[#ff5e1a] hover:bg-[#e54e09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5e1a]"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
