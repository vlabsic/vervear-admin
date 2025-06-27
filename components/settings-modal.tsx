"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle } from "lucide-react"

export interface UISettings {
  accentColor: string
  productCornerRadius: number
  buttonCornerRadius: number
  show360View?: boolean
  showTryOnView?: boolean
  viewerBackgroundColor: string
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: UISettings
  onSave: (settings: UISettings) => void
}

export default function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<UISettings>(settings)
  const [error, setError] = useState<string | null>(null)

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    try {
      // Validate that at least one view option is enabled (if they exist)
      if (localSettings.show360View !== undefined && localSettings.showTryOnView !== undefined) {
        if (!localSettings.show360View && !localSettings.showTryOnView) {
          setError("At least one view option must be enabled")
          return
        }
      }

      // Validate color format
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(localSettings.accentColor)) {
        setError("Invalid accent color format. Please use hexadecimal format (e.g., #FF5E1A)")
        return
      }

      // Validate viewer background color format
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(localSettings.viewerBackgroundColor)) {
        setError("Invalid viewer background color format. Please use hexadecimal format (e.g., #F2F2F2)")
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
              <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="accentColor"
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
                  placeholder="#2770E5"
                  aria-describedby="color-error"
                />
              </div>
            </div>

            {/* Product Corner Radius */}
            <div>
              <label htmlFor="productCornerRadius" className="block text-sm font-medium text-gray-700 mb-1">
                Product Card Corner Radius (px)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  id="productCornerRadius"
                  min="0"
                  max="20"
                  value={localSettings.productCornerRadius}
                  onChange={(e) => handleChange("productCornerRadius", Number.parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={localSettings.productCornerRadius}
                  onChange={(e) => handleChange("productCornerRadius", Number.parseInt(e.target.value) || 0)}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="20"
                />
              </div>
              <div className="mt-2 flex justify-center">
                <div
                  className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs"
                  style={{
                    borderRadius: `${localSettings.productCornerRadius}px`,
                  }}
                  aria-hidden="true"
                >
                  Card
                </div>
              </div>
            </div>

            {/* Button Corner Radius */}
            <div>
              <label htmlFor="buttonCornerRadius" className="block text-sm font-medium text-gray-700 mb-1">
                Button Corner Radius (px)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  id="buttonCornerRadius"
                  min="0"
                  max="50"
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
                  max="50"
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
              <label htmlFor="viewerBackgroundColor" className="block text-sm font-medium text-gray-700 mb-1">
                3D Viewer Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="viewerBackgroundColor"
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
                  placeholder="#FFFFFF"
                  aria-describedby="color-error"
                />
              </div>
              <div className="mt-2 flex justify-center">
                <div
                  className="w-32 h-20 flex items-center justify-center text-gray-500 text-sm border"
                  style={{
                    backgroundColor: localSettings.viewerBackgroundColor,
                  }}
                  aria-hidden="true"
                >
                  3D Viewer
                </div>
              </div>
            </div>

            {/* View Options - Only show if they exist in settings */}
            {(localSettings.show360View !== undefined || localSettings.showTryOnView !== undefined) && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">View Options</h3>

                {/* 360° View Toggle */}
                {localSettings.show360View !== undefined && (
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="toggle360View" className="text-sm font-medium text-gray-700">
                      Show 360° View
                    </label>
                    <button
                      id="toggle360View"
                      onClick={() => handleToggleChange("show360View")}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        localSettings.show360View ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      role="switch"
                      aria-checked={localSettings.show360View}
                      aria-labelledby="toggle360View-label"
                    >
                      <span
                        className={`${
                          localSettings.show360View ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}

                {/* Try-On View Toggle */}
                {localSettings.showTryOnView !== undefined && (
                  <div className="flex items-center justify-between">
                    <label htmlFor="toggleTryOnView" className="text-sm font-medium text-gray-700">
                      Show Try-On View
                    </label>
                    <button
                      id="toggleTryOnView"
                      onClick={() => handleToggleChange("showTryOnView")}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        localSettings.showTryOnView ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      role="switch"
                      aria-checked={localSettings.showTryOnView}
                      aria-labelledby="toggleTryOnView-label"
                    >
                      <span
                        className={`${
                          localSettings.showTryOnView ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="mt-2 text-red-500 text-sm flex items-center" id="settings-error" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                    {error}
                  </div>
                )}

                {localSettings.show360View !== undefined && localSettings.showTryOnView !== undefined && (
                  <div className="mt-2 text-xs text-gray-500">
                    Note: At least one view option must be enabled. The view switcher will only be displayed if both
                    options are enabled.
                  </div>
                )}
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
