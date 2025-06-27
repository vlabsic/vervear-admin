"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Upload, Trash2 } from "lucide-react"

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  modelUrl: string
  tryOnUrl?: string
  buyNowLink?: string
  hotspots?: Array<{
    id: string
    position: string
    normal: string
    name: string
    description: string
    subcopy?: string
    image?: string
  }>
  colorOptions?: Array<{
    name: string
    color: string
  }>
}

interface ProductEditModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  onDelete: (productId: number) => void
}

export default function ProductEditModal({ product, isOpen, onClose, onSave, onDelete }: ProductEditModalProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    setEditedProduct(product)
    setImagePreview(null)
  }, [product])

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setEditedProduct((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImagePreview(result)
        setEditedProduct((prev) => ({
          ...prev,
          image: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave(editedProduct)
    onClose()
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      onDelete(editedProduct.id)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview || editedProduct.image ? (
                  <img
                    src={imagePreview || editedProduct.image}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Upload Image
                </label>
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={editedProduct.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editedProduct.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={editedProduct.price}
              onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 3D Model URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">3D Model URL</label>
            <input
              type="url"
              value={editedProduct.modelUrl}
              onChange={(e) => handleInputChange("modelUrl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/model.glb"
            />
          </div>

          {/* Try-On URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Try-On URL (Optional)</label>
            <input
              type="url"
              value={editedProduct.tryOnUrl || ""}
              onChange={(e) => handleInputChange("tryOnUrl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ar.vervear.com/glasses/..."
            />
          </div>

          {/* Buy Now Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buy Now Link (Optional)</label>
            <input
              type="url"
              value={editedProduct.buyNowLink || ""}
              onChange={(e) => handleInputChange("buyNowLink", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/product"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} />
            Delete Product
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
