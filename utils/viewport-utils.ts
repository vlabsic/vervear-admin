/**
 * Utility functions for viewport simulation
 */

// Function to simulate a media query match
export function simulateMediaQuery(query: string): boolean {
  // Parse the query to extract min/max width
  const minWidthMatch = query.match(/min-width:\s*(\d+)px/)
  const maxWidthMatch = query.match(/max-width:\s*(\d+)px/)

  // Get the current viewport simulation from the document
  const isTablet = document.documentElement.classList.contains("viewport-tablet")
  const isMobile = document.documentElement.classList.contains("viewport-mobile")

  // Simulate viewport width based on current simulation
  let simulatedWidth = window.innerWidth // Default to actual width

  if (isTablet) {
    simulatedWidth = 768 // Tablet width
  } else if (isMobile) {
    simulatedWidth = 375 // Mobile width
  }

  // Check if the simulated width matches the query
  if (minWidthMatch && maxWidthMatch) {
    const minWidth = Number.parseInt(minWidthMatch[1])
    const maxWidth = Number.parseInt(maxWidthMatch[1])
    return simulatedWidth >= minWidth && simulatedWidth <= maxWidth
  } else if (minWidthMatch) {
    const minWidth = Number.parseInt(minWidthMatch[1])
    return simulatedWidth >= minWidth
  } else if (maxWidthMatch) {
    const maxWidth = Number.parseInt(maxWidthMatch[1])
    return simulatedWidth <= maxWidth
  }

  return false
}

// Hook to get current viewport type
export function getViewportType(): "desktop" | "tablet" | "mobile" {
  if (typeof window === "undefined") return "desktop"

  const isTablet = document.documentElement.classList.contains("viewport-tablet")
  const isMobile = document.documentElement.classList.contains("viewport-mobile")

  if (isMobile) return "mobile"
  if (isTablet) return "tablet"
  return "desktop"
}
