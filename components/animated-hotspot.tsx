"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Hotspot } from "./hotspot-manager"

type AnimatedHotspotProps = {
  hotspot: Hotspot
  isEditMode: boolean
  onClick?: () => void
}

export default function AnimatedHotspot({ hotspot, isEditMode, onClick }: AnimatedHotspotProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)

  // Animation effect
  useEffect(() => {
    setIsVisible(true)

    // Pulse animation
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleHotspotClick = () => {
    if (isEditMode) {
      if (onClick) onClick()
      return
    }

    setShowContent((prev) => !prev)
  }

  return (
    <>
      <button
        className={`hotspot ${isVisible ? "hotspot-visible" : "hotspot-hidden"} ${isEditMode ? "hotspot-edit-mode" : ""}`}
        slot={`hotspot-${hotspot.id}`}
        data-id={hotspot.id}
        data-position={hotspot.position}
        data-normal={hotspot.normal}
        data-visibility-attribute="visible"
        onClick={handleHotspotClick}
      >
        <div className="hotspot-dot"></div>
        <div className="hotspot-label">{hotspot.title}</div>
      </button>

      {showContent && (
        <div id={`hotspot-${hotspot.id}-content`} className="hotspot-content-visible">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-[250px] text-left">
            {hotspot.image && (
              <div className="mb-2 rounded-md overflow-hidden">
                <Image
                  src={hotspot.image || "/placeholder.svg"}
                  alt={hotspot.title}
                  width={250}
                  height={150}
                  className="object-cover w-full h-auto"
                />
              </div>
            )}
            <h3 className="font-bold text-[#000000] text-sm mb-1">{hotspot.title}</h3>
            <p className="text-[#9b9b9b] text-xs">{hotspot.description}</p>
          </div>
        </div>
      )}
    </>
  )
}
