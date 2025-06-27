"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react"

type ViewportSize = "desktop" | "tablet" | "mobile"

export default function TopNavigationBar() {
  const [activeDevice, setActiveDevice] = useState<ViewportSize>("desktop")

  // Apply viewport changes when device selection changes
  useEffect(() => {
    const viewportContainer = document.getElementById("viewport-container")
    if (!viewportContainer) return

    // Apply the appropriate viewport class
    viewportContainer.classList.remove("viewport-desktop", "viewport-tablet", "viewport-mobile")
    viewportContainer.classList.add(`viewport-${activeDevice}`)

    // Set the appropriate width based on the device
    if (activeDevice === "desktop") {
      document.body.style.minWidth = "100%"
      document.body.classList.remove("tablet-view", "mobile-view")
    } else if (activeDevice === "tablet") {
      document.body.style.minWidth = "768px"
      document.body.classList.add("tablet-view")
      document.body.classList.remove("mobile-view")
    } else if (activeDevice === "mobile") {
      document.body.style.minWidth = "390px"
      document.body.classList.add("mobile-view")
      document.body.classList.remove("tablet-view")
    }

    // Trigger a resize event to ensure responsive layouts update
    window.dispatchEvent(new Event("resize"))
  }, [activeDevice])

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left: Back to Home */}
      <div>
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-700 hover:text-primary px-3 py-1.5 rounded-md border border-gray-200 hover:border-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Center: Device Controls */}
      <div className="bg-gray-100 rounded-md p-1 flex items-center">
        <button
          className={`p-2 rounded ${activeDevice === "desktop" ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
          onClick={() => setActiveDevice("desktop")}
          aria-label="Desktop view"
          title="Desktop view"
        >
          <Monitor size={18} />
        </button>
        <button
          className={`p-2 rounded ${activeDevice === "tablet" ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
          onClick={() => setActiveDevice("tablet")}
          aria-label="Tablet view"
          title="Tablet view"
        >
          <Tablet size={18} />
        </button>
        <button
          className={`p-2 rounded ${activeDevice === "mobile" ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
          onClick={() => setActiveDevice("mobile")}
          aria-label="Mobile view"
          title="Mobile view"
        >
          <Smartphone size={18} />
        </button>
      </div>

      {/* Right: Preview & Publish Buttons */}
      <div className="flex items-center gap-3">
        <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm">
          <span>Preview</span>
        </button>
        <button className="bg-primary text-white px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-opacity-90 transition-colors text-sm">
          <span>Publish</span>
        </button>
      </div>
    </div>
  )
}
