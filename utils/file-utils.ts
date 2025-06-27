export type FileUploadResult = {
  file: File
  url: string
}

export async function handleFileUpload(file: File, acceptedTypes: string[]): Promise<FileUploadResult | null> {
  // Validate file type
  const fileType = file.type.split("/")[1]?.toLowerCase()
  const isValidType = acceptedTypes.some((type) => file.name.toLowerCase().endsWith(type) || fileType === type)

  if (!isValidType) {
    alert(`Please upload a valid file type: ${acceptedTypes.join(", ")}`)
    return null
  }

  // Create a URL for the file
  const fileUrl = URL.createObjectURL(file)

  return {
    file,
    url: fileUrl,
  }
}

export function getDefaultModelImage(modelUrl: string): Promise<string> {
  return new Promise((resolve) => {
    // Create a temporary div to render the model-viewer
    const tempDiv = document.createElement("div")
    tempDiv.style.position = "absolute"
    tempDiv.style.width = "600px" // Larger size for better quality
    tempDiv.style.height = "600px"
    tempDiv.style.left = "-9999px"
    document.body.appendChild(tempDiv)

    // Create model-viewer
    const modelViewer = document.createElement("model-viewer")
    modelViewer.src = modelUrl
    modelViewer.style.width = "100%"
    modelViewer.style.height = "100%"
    modelViewer.setAttribute("camera-controls", "")
    modelViewer.setAttribute("auto-rotate", "")
    modelViewer.setAttribute("exposure", "0.7") // Better lighting
    modelViewer.setAttribute("shadow-intensity", "1.5")
    modelViewer.setAttribute("environment-image", "neutral")
    modelViewer.setAttribute("camera-orbit", "0deg 75deg 105%") // Better default angle
    tempDiv.appendChild(modelViewer)

    // Wait for the model to load and then capture it
    modelViewer.addEventListener("load", () => {
      // Give time for the model to fully render with better positioning
      setTimeout(() => {
        try {
          const imageUrl = modelViewer.toDataURL("image/png", 1.0) // Higher quality
          document.body.removeChild(tempDiv)
          resolve(imageUrl)
        } catch (e) {
          document.body.removeChild(tempDiv)
          resolve("/placeholder.svg?height=600&width=600")
        }
      }, 1500) // Longer wait for better rendering
    })

    // Fallback in case load event doesn't fire
    setTimeout(() => {
      try {
        const imageUrl = modelViewer.toDataURL("image/png", 1.0)
        document.body.removeChild(tempDiv)
        resolve(imageUrl)
      } catch (e) {
        document.body.removeChild(tempDiv)
        resolve("/placeholder.svg?height=600&width=600")
      }
    }, 4000) // Longer timeout
  })
}
