"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export type UISettings = {
  accentColor: string
  productCornerRadius: number
  buttonCornerRadius: number
}

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  settings: UISettings
  onSave: (settings: UISettings) => void
}

export default function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<UISettings>(settings)

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    onSave(localSettings)
    onClose()
  }

  const handleChange = (key: keyof UISettings, value: string | number) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">UI Settings</h2>

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
              />
              <input
                type="text"
                value={localSettings.accentColor}
                onChange={(e) => handleChange("accentColor", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#ff5e1a"
              />
            </div>
          </div>

          {/* Product Corner Radius */}
          <div>
            <label htmlFor="productCornerRadius" className="block text-sm font-medium text-gray-700 mb-1">
              Product Frame Corner Radius (px)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                id="productCornerRadius"
                min="0"
                max="360"
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
                max="360"
              />
            </div>
            <div className="mt-2 flex justify-center">
              <div
                className="w-20 h-20 bg-gray-200 border border-gray-300 flex items-center justify-center"
                style={{
                  borderRadius: `${localSettings.productCornerRadius}px`,
                  boxShadow: `0 0 0 2px ${localSettings.accentColor}`,
                }}
              >
                <div className="w-12 h-12 bg-white"></div>
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
              >
                ADD TO CART
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: localSettings.accentColor }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
