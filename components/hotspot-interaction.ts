// This file adds JavaScript to handle hotspot interactions
// It will be imported in both product view components

export function setupHotspotInteractions(modelViewerElement: HTMLElement | null) {
  if (!modelViewerElement) return

  // Wait for the model-viewer to be fully loaded
  setTimeout(() => {
    const hotspots = modelViewerElement.querySelectorAll(".hotspot")
    const contents = modelViewerElement.querySelectorAll(".hotspot-content")

    // Hide all content elements initially
    contents.forEach((content) => {
      ;(content as HTMLElement).style.display = "none"
    })

    // Add click event listeners to each hotspot
    hotspots.forEach((hotspot, index) => {
      hotspot.addEventListener("click", () => {
        // Hide all content elements
        contents.forEach((content) => {
          ;(content as HTMLElement).style.display = "none"
        })

        // Show the corresponding content element
        const contentId = `hotspot-${index + 1}-content`
        const content = modelViewerElement.querySelector(`#${contentId}`)
        if (content) {
          ;(content as HTMLElement).style.display = "block"

          // Position the content near the hotspot
          const rect = (hotspot as HTMLElement).getBoundingClientRect()
          const modelRect = modelViewerElement.getBoundingClientRect()
          ;(content as HTMLElement).style.left = `${rect.left - modelRect.left}px`
          ;(content as HTMLElement).style.top = `${rect.top - modelRect.top - 10}px`
        }
      })
    })

    // Close content when clicking elsewhere
    modelViewerElement.addEventListener("click", (event) => {
      if (!(event.target as HTMLElement).closest(".hotspot")) {
        contents.forEach((content) => {
          ;(content as HTMLElement).style.display = "none"
        })
      }
    })
  }, 1000) // Give time for the model-viewer to initialize
}
