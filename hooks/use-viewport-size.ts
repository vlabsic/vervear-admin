"use client"

import { useState, useEffect } from "react"

type ViewportSize = "desktop" | "tablet" | "mobile" | "unknown"

export function useViewportSize(): ViewportSize {
  const [viewportSize, setViewportSize] = useState<ViewportSize>("unknown")

  useEffect(() => {
    // Function to determine viewport size
    const updateViewportSize = () => {
      const rootElement = document.documentElement

      if (rootElement.classList.contains("viewport-desktop")) {
        setViewportSize("desktop")
      } else if (rootElement.classList.contains("viewport-tablet")) {
        setViewportSize("tablet")
      } else if (rootElement.classList.contains("viewport-mobile")) {
        setViewportSize("mobile")
      } else {
        // Fallback to window width if classes aren't set
        const width = window.innerWidth
        if (width >= 1024) {
          setViewportSize("desktop")
        } else if (width >= 768) {
          setViewportSize("tablet")
        } else {
          setViewportSize("mobile")
        }
      }
    }

    // Initial check
    updateViewportSize()

    // Set up observer to watch for class changes on root element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          updateViewportSize()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    // Clean up
    return () => {
      observer.disconnect()
    }
  }, [])

  return viewportSize
}
