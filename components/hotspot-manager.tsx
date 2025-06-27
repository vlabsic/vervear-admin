"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus, X, Move, ImageIcon } from "lucide-react"
import Image from "next/image"

export type Hotspot = {
  id: string
  position: string // Format: "x y z"
  normal: string // Format: "x y z"
  title: string
  description: string
  image?: string
}

type HotspotManagerProps = {
  hotspots: Hotspot[]
  onChange: (hotspots: Hotspot[]) => void
  modelViewerRef: React.RefObject<HTMLElement>
  isEditMode: boolean
}

export default function HotspotManager({ hotspots, onChange, modelViewerRef, isEditMode }: HotspotManagerProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [editForm, setEditForm] = useState<{
    title: string
    description: string
    image?: string
  }>({ title: "", description: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset form when selected hotspot changes
  useEffect(() => {
    if (selectedHotspot) {
      setEditForm({
        title: selectedHotspot.title,
        description: selectedHotspot.description,
        image: selectedHotspot.image,
      })
    } else {
      setEditForm({ title: "", description: "" })
    }
  }, [selectedHotspot])

  // Setup drag-and-drop functionality
  useEffect(() => {
    if (!modelViewerRef.current || !isEditMode) return

    const modelViewer = modelViewerRef.current

    // Function to handle hotspot drag start
    const handleDragStart = (event: MouseEvent) => {
      const hotspotElement = event.target as HTMLElement
      if (!hotspotElement.classList.contains("hotspot") || !isEditMode) return

      setIsDragging(true)
      hotspotElement.style.cursor = "grabbing"

      // Prevent default behavior to allow custom drag
      event.preventDefault()
    }

    // Function to handle hotspot dragging
    const handleDrag = (event: MouseEvent) => {
      if (!isDragging || !isEditMode) return

      const intersectionData = getIntersectionData(event)
      if (!intersectionData) return

      const hotspotElement = event.target as HTMLElement
      const hotspotId = hotspotElement.getAttribute("data-id")
      if (!hotspotId) return

      // Update hotspot position
      const updatedHotspots = hotspots.map((hotspot) => {
        if (hotspot.id === hotspotId) {
          return {
            ...hotspot,
            position: `${intersectionData.position.x} ${intersectionData.position.y} ${intersectionData.position.z}`,
            normal: `${intersectionData.normal.x} ${intersectionData.normal.y} ${intersectionData.normal.z}`,
          }
        }
        return hotspot
      })

      onChange(updatedHotspots)
    }

    // Function to handle hotspot drag end
    const handleDragEnd = () => {
      if (isDragging) {
        setIsDragging(false)
        document.querySelectorAll(".hotspot").forEach((el) => {
          ;(el as HTMLElement).style.cursor = ""
        })
      }
    }

    // Function to get intersection data from mouse event
    const getIntersectionData = (event: MouseEvent) => {
      const rect = modelViewer.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const positionOnCanvas = { x: x / rect.width, y: y / rect.height }

      // Use model-viewer's positionAndNormalFromPoint method to get 3D position
      try {
        // @ts-ignore - model-viewer specific method
        return modelViewer.positionAndNormalFromPoint(positionOnCanvas.x, positionOnCanvas.y)
      } catch (error) {
        console.error("Error getting position from point:", error)
        return null
      }
    }

    // Add event listeners for drag operations
    modelViewer.addEventListener("mousedown", handleDragStart)
    modelViewer.addEventListener("mousemove", handleDrag)
    modelViewer.addEventListener("mouseup", handleDragEnd)
    modelViewer.addEventListener("mouseleave", handleDragEnd)

    // Cleanup event listeners
    return () => {
      modelViewer.removeEventListener("mousedown", handleDragStart)
      modelViewer.removeEventListener("mousemove", handleDrag)
      modelViewer.removeEventListener("mouseup", handleDragEnd)
      modelViewer.removeEventListener("mouseleave", handleDragEnd)
    }
  }, [modelViewerRef, isEditMode, isDragging, hotspots, onChange])

  // Function to add a new hotspot
  const handleAddHotspot = (event: React.MouseEvent) => {
    if (!modelViewerRef.current || !isEditMode) return

    const modelViewer = modelViewerRef.current
    const rect = modelViewer.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const positionOnCanvas = { x: x / rect.width, y: y / rect.height }

    try {
      // @ts-ignore - model-viewer specific method
      const intersectionData = modelViewer.positionAndNormalFromPoint(positionOnCanvas.x, positionOnCanvas.y)
      if (!intersectionData) return

      const newHotspot: Hotspot = {
        id: `hotspot-${Date.now()}`,
        position: `${intersectionData.position.x} ${intersectionData.position.y} ${intersectionData.position.z}`,
        normal: `${intersectionData.normal.x} ${intersectionData.normal.y} ${intersectionData.normal.z}`,
        title: "New Hotspot",
        description: "Click to edit this hotspot",
      }

      const updatedHotspots = [...hotspots, newHotspot]
      onChange(updatedHotspots)
      setSelectedHotspot(newHotspot)
      setIsEditing(true)
    } catch (error) {
      console.error("Error adding hotspot:", error)
    }
  }

  // Function to delete a hotspot
  const handleDeleteHotspot = (id: string) => {
    const updatedHotspots = hotspots.filter((hotspot) => hotspot.id !== id)
    onChange(updatedHotspots)
    if (selectedHotspot?.id === id) {
      setSelectedHotspot(null)
      setIsEditing(false)
    }
  }

  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditForm({
          ...editForm,
          image: event.target.result as string,
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // Function to save hotspot edits
  const handleSaveHotspot = () => {
    if (!selectedHotspot) return

    const updatedHotspots = hotspots.map((hotspot) => {
      if (hotspot.id === selectedHotspot.id) {
        return {
          ...hotspot,
          title: editForm.title,
          description: editForm.description,
          image: editForm.image,
        }
      }
      return hotspot
    })

    onChange(updatedHotspots)
    setIsEditing(false)
  }

  // Function to select a hotspot for editing
  const handleSelectHotspot = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    setIsEditing(true)
  }

  return (
    <>
      {isEditMode && (
        <div className="absolute top-20 right-4 z-20 bg-white rounded-lg shadow-lg p-4 max-w-xs w-full">
          <h3 className="text-lg font-semibold mb-2">Hotspot Manager</h3>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {isDragging
                ? "Release to place hotspot"
                : "Click on the model to add a new hotspot or drag existing hotspots to reposition them."}
            </p>

            <button
              onClick={handleAddHotspot}
              className="flex items-center justify-center gap-1 bg-[#ff5e1a] text-white px-3 py-1.5 rounded-md text-sm w-full"
            >
              <Plus size={16} />
              <span>Add New Hotspot</span>
            </button>
          </div>

          {hotspots.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Existing Hotspots:</h4>
              <div className="max-h-40 overflow-y-auto">
                {hotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className={`flex items-center justify-between p-2 rounded-md mb-1 cursor-pointer ${
                      selectedHotspot?.id === hotspot.id ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelectHotspot(hotspot)}
                  >
                    <div className="flex items-center gap-2">
                      <Move size={14} className="text-gray-400" />
                      <span className="text-sm truncate max-w-[120px]">{hotspot.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteHotspot(hotspot.id)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isEditing && selectedHotspot && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Edit Hotspot</h3>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="hotspot-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="hotspot-title"
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff5e1a]"
              />
            </div>

            <div>
              <label htmlFor="hotspot-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="hotspot-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff5e1a]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {editForm.image ? (
                    <Image
                      src={editForm.image || "/placeholder.svg"}
                      alt="Hotspot image"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon size={24} className="text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                >
                  <ImageIcon size={16} />
                  <span>Upload Image</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveHotspot}
                className="px-4 py-2 bg-[#ff5e1a] text-white rounded-md hover:bg-[#e54e09] transition-colors"
              >
                Save Hotspot
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
