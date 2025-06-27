"use client"

import { useEffect, useState } from "react"

type ViewportType = "desktop" | "tablet" | "mobile"

export function useResponsiveViewport() {
  const [viewportType, setViewportType] = useState<ViewportType>("desktop")

  useEffect(() => {
    // Function to detect the current viewport simulation
    const detectViewport = () => {
      const root = document.documentElement

      if (root.classList.contains("viewport-mobile")) {
        setViewportType("mobile")
      } else if (root.classList.contains("viewport-tablet")) {
        setViewportType("tablet")
      } else {
        setViewportType("desktop")
      }
    }

    // Initial detection
    detectViewport()

    // Set up mutation observer to watch for class changes on the root element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          detectViewport()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    // Clean up
    return () => {
      observer.disconnect()
    }
  }, [])

  // Return viewport type and helper functions
  return {
    viewportType,
    isMobile: viewportType === "mobile",
    isTablet: viewportType === "tablet",
    isDesktop: viewportType === "desktop",
  }
}
