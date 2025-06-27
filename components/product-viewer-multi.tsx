// Replace the entire file with the following updated code that includes product editing, settings, and product management

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Edit2, Plus, Settings } from "lucide-react"
import Image from "next/image"
import Script from "next/script"
import { QRCodeSVG } from "qrcode.react"
import ProductEditModal, { type Product } from "./product-edit-modal"
import SettingsModal, { type UISettings } from "./settings-modal"

// Initial products array with null placeholders for up to 12 products
const initialProducts: (Product | null)[] = [
  {
    id: 1,
    name: "AssaultBike Classic",
    description: "High-performance air bike for intense workouts",
    price: 699.0,
    image:
      "https://res.cloudinary.com/drnavq85s/image/upload/v1741970345/Screenshot_2025-03-14_at_9.38.26_AM_wulfob.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AssaultBike_Classic-sZSvmqvCGUo2dPr4jKRk7kRcUQxeiV.glb",
    buyNowLink: "#",
    hotspots: [
      {
        id: "default-1",
        position: "0.15 0.6 0.12",
        normal: "0 0 1",
        name: "Console",
        description: "LCD display shows time, calories, distance, and speed metrics",
        subcopy: "Tracks all your workout data in real-time",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "default-2",
        position: "0 0.3 0.2",
        normal: "0 0 1",
        name: "Drive Train",
        description: "20 sealed ball bearings with precision steel shaft for durability",
        subcopy: "Engineered for smooth operation and long-lasting performance",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "default-3",
        position: "-0.18 0.25 0",
        normal: "-1 0 0",
        name: "Foot Pegs",
        description: "Anti-slip foot pegs for stability during upper body workouts",
        subcopy: "Secure footing for maximum workout efficiency",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "default-4",
        position: "0 0.05 0.15",
        normal: "0 1 0",
        name: "Base Frame",
        description: "Heavy-duty steel frame supports up to 350 lbs",
        subcopy: "Built to last with commercial-grade materials",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
  {
    id: 2,
    name: "AssaultBike Elite",
    description: "Premium air bike with advanced performance metrics",
    price: 1099.0,
    image:
      "https://res.cloudinary.com/drnavq85s/image/upload/v1741970850/Screenshot_2025-03-14_at_9.47.23_AM_lk3gfv.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AssaultBike_Elite-yH7SVUhOqFYgVu3FwoC6pw1T4QU1H8.glb",
    buyNowLink: "#",
  },
  {
    id: 3,
    name: "AssaultRunner Pro",
    description: "Manual curved treadmill for natural running motion",
    price: 2999.0,
    image:
      "https://res.cloudinary.com/drnavq85s/image/upload/v1741971018/Screenshot_2025-03-14_at_9.50.10_AM_p50rdw.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AssaultRunner-3mYHrXXHDJon7SZu7hEiLKnji95FUH.glb",
    buyNowLink: "#",
  },
  {
    id: 4,
    name: "AssaultRunner Elite",
    description: "Premium curved treadmill with enhanced durability",
    price: 3499.0,
    image:
      "https://res.cloudinary.com/drnavq85s/image/upload/v1741971470/Screenshot_2025-03-14_at_9.57.44_AM_hcb5rm.png",
    modelUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AssaultRunner_Elite-dla0aaRlSYSBc7bZDGq2SHGCBn6KtE.glb",
    buyNowLink: "#",
  },
  null, // Empty slots for positions 5-12
  null,
  null,
  null,
  null,
  null,
  null,
  null,
]

// Predefined positions for the AssaultBike Classic
const presetPositions = [
  { id: "top", label: "Top", position: "0 0.6 0", normal: "0 1 0" },
  { id: "front", label: "Front", position: "0 0.3 0.3", normal: "0 0 1" },
  { id: "back", label: "Back", position: "0 0.3 -0.3", normal: "0 0 -1" },
  { id: "left", label: "Left", position: "-0.3 0.3 0", normal: "-1 0 0" },
  { id: "right", label: "Right", position: "0.3 0.3 0", normal: "1 0 0" },
  { id: "bottom", label: "Bottom", position: "0 0.1 0", normal: "0 -1 0" },
  { id: "console", label: "Console", position: "0 0.5 0.2", normal: "0 0.5 0.5" },
  { id: "pedals", label: "Pedals", position: "0 0.2 0.1", normal: "0 0.2 0.8" },
  { id: "seat", label: "Seat", position: "0 0.4 -0.2", normal: "0 0.4 -0.6" },
  { id: "handlebars", label: "Handlebars", position: "0 0.45 0.15", normal: "0 0.3 0.7" },
]

// AR Icon component with new SVG
const ARIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.5001 2.13397C11.6521 2.04621 11.8245 2 12.0001 2C12.1756 2 12.348 2.04621 12.5001 2.13397L14.5001 3.28897C14.7279 3.42253 14.8936 3.64076 14.9611 3.89606C15.0286 4.15135 14.9924 4.42298 14.8603 4.65167C14.7283 4.88036 14.5112 5.04754 14.2563 5.11672C14.0015 5.18591 13.7296 5.15149 13.5001 5.02097L13.0001 4.73197V5.99997C13.0001 6.26519 12.8947 6.51954 12.7072 6.70708C12.5196 6.89462 12.2653 6.99997 12.0001 6.99997C11.7348 6.99997 11.4805 6.89462 11.2929 6.70708C11.1054 6.51954 11.0001 6.26519 11.0001 5.99997V4.73197L10.5001 5.02097C10.2705 5.15149 9.99863 5.18591 9.74379 5.11672C9.48895 5.04754 9.27182 4.88036 9.13978 4.65167C9.00774 4.42298 8.97152 4.15135 9.03902 3.89606C9.10651 3.64076 9.27225 3.42253 9.50005 3.28897L11.5001 2.13397ZM7.07205 5.84497C7.20466 6.07465 7.24059 6.3476 7.17195 6.60377C7.10332 6.85995 6.93573 7.07836 6.70605 7.21097L6.20605 7.49997L7.30405 8.13397C7.4187 8.19916 7.51932 8.28637 7.60012 8.3906C7.68092 8.49483 7.74031 8.61401 7.77486 8.74128C7.80942 8.86855 7.81846 9.00141 7.80146 9.13218C7.78446 9.26296 7.74176 9.38909 7.67582 9.5033C7.60988 9.61751 7.522 9.71755 7.41723 9.79766C7.31247 9.87777 7.1929 9.93636 7.0654 9.97007C6.9379 10.0038 6.80499 10.0119 6.67433 9.99407C6.54367 9.97621 6.41783 9.93267 6.30405 9.86597L5.20605 9.23197V9.80897C5.20605 10.0742 5.1007 10.3285 4.91316 10.5161C4.72563 10.7036 4.47127 10.809 4.20605 10.809C3.94084 10.809 3.68648 10.7036 3.49895 10.5161C3.31141 10.3285 3.20605 10.0742 3.20605 9.80897V7.49997C3.20623 7.32461 3.25253 7.15238 3.34029 7.00056C3.42804 6.84873 3.55419 6.72266 3.70605 6.63497L5.70605 5.47997C5.93573 5.34737 6.20868 5.31144 6.46485 5.38008C6.72103 5.44871 6.93944 5.6163 7.07205 5.84597V5.84497ZM16.9281 5.84497C17.0607 5.6153 17.2791 5.44771 17.5353 5.37908C17.7914 5.31044 18.0644 5.34637 18.2941 5.47897L20.2941 6.63397C20.4461 6.72174 20.5723 6.84797 20.6601 6.99999C20.7478 7.152 20.7941 7.32444 20.7941 7.49997V9.80997C20.7941 10.0752 20.6887 10.3295 20.5012 10.5171C20.3136 10.7046 20.0593 10.81 19.7941 10.81C19.5288 10.81 19.2745 10.7046 19.0869 10.5171C18.8994 10.3295 18.7941 10.0752 18.7941 9.80997V9.23197L17.6961 9.86597C17.4665 9.99649 17.1946 10.0309 16.9398 9.96172C16.6849 9.89254 16.4678 9.72536 16.3358 9.49667C16.2037 9.26798 16.1675 8.99635 16.235 8.74106C16.3025 8.48576 16.4682 8.26752 16.6961 8.13397L17.7941 7.49997L17.2941 7.21097C17.0644 7.07836 16.8968 6.85995 16.8282 6.60377C16.7595 6.3476 16.7955 6.07465 16.9281 5.84497ZM8.53605 9.99997C8.66867 9.7703 8.88708 9.60271 9.14326 9.53407C9.39943 9.46544 9.67238 9.50137 9.90205 9.63397L12.0001 10.845L14.0981 9.63397C14.3276 9.50346 14.5995 9.46904 14.8543 9.53823C15.1092 9.60741 15.3263 9.77459 15.4583 10.0033C15.5904 10.232 15.6266 10.5036 15.5591 10.7589C15.4916 11.0142 15.3259 11.2324 15.0981 11.366L13.0001 12.577V15C13.0001 15.2652 12.8947 15.5195 12.7072 15.7071C12.5196 15.8946 12.2653 16 12.0001 16C11.7348 16 11.4805 15.8946 11.2929 15.7071C11.1054 15.5195 11.0001 15.2652 11.0001 15V12.577L8.90205 11.366C8.67238 11.2334 8.50479 11.0149 8.43616 10.7588C8.36752 10.5026 8.40345 10.2297 8.53605 9.99997ZM4.20605 13.19C4.47127 13.19 4.72563 13.2953 4.91316 13.4829C5.1007 13.6704 5.20605 13.9248 5.20605 14.19V14.768L6.30405 14.134C6.53361 14.0035 6.80548 13.969 7.06032 14.0382C7.31516 14.1074 7.53229 14.2746 7.66433 14.5033C7.79637 14.732 7.83259 15.0036 7.76509 15.2589C7.6976 15.5142 7.53186 15.7324 7.30405 15.866L6.20605 16.5L6.70605 16.789C6.8207 16.8542 6.92132 16.9414 7.00212 17.0456C7.08292 17.1498 7.14231 17.269 7.17686 17.3963C7.21142 17.5236 7.22046 17.6564 7.20346 17.7872C7.18646 17.918 7.14376 18.0441 7.07782 18.1583C7.01188 18.2725 6.924 18.3726 6.81923 18.4527C6.71447 18.5328 6.5949 18.5914 6.4674 18.6251C6.3399 18.6588 6.20699 18.6669 6.07633 18.6491C5.94567 18.6312 5.81983 18.5877 5.70605 18.521L3.70605 17.366C3.55404 17.2782 3.4278 17.152 3.34004 17C3.25227 16.8479 3.20606 16.6755 3.20605 16.5V14.19C3.20605 13.9248 3.31141 13.6704 3.49895 13.4829C3.68648 13.2953 3.94084 13.19 4.20605 13.19ZM19.7941 13.19C20.0593 13.19 20.3136 13.2953 20.5012 13.4829C20.6887 13.6704 20.7941 13.9248 20.7941 14.19V16.5C20.7941 16.6755 20.7478 16.8479 20.6601 17C20.5723 17.152 20.4461 17.2782 20.2941 17.366L18.2941 18.521C18.1803 18.5877 18.0544 18.6312 17.9238 18.6491C17.7931 18.6669 17.6602 18.6588 17.5327 18.6251C17.4052 18.5914 17.2856 18.5328 17.1809 18.4527C17.0761 18.3726 16.9882 18.2725 16.9223 18.1583C16.8563 18.0441 16.8136 17.918 16.7967 17.7872C16.7797 17.6564 16.7887 17.5236 16.8232 17.3963C16.8578 17.269 16.9172 17.1498 16.998 17.0456C17.0788 16.9414 17.1794 16.8542 17.2941 16.789L17.7941 16.5L16.6961 15.866C16.5814 15.8008 16.4808 15.7136 16.4 15.6093C16.3192 15.5051 16.2598 15.3859 16.2252 15.2587C16.1907 15.1314 16.1817 14.9985 16.1987 14.8678C16.2156 14.737 16.2583 14.6109 16.3243 14.4966C16.3902 14.3824 16.4781 14.2824 16.5829 14.2023C16.6876 14.1222 16.8072 14.0636 16.9347 14.0299C17.0622 13.9962 17.1951 13.988 17.3258 14.0059C17.4564 14.0237 17.5823 14.0673 17.6961 14.134L18.7941 14.768V14.191C18.7941 13.9258 18.8994 13.6714 19.0869 13.4839C19.2745 13.2963 19.5288 13.191 19.7941 13.191V13.19ZM12.0001 17C12.2653 17 12.5196 17.1053 12.7072 17.2929C12.8947 17.4804 13.0001 17.7348 13.0001 18V19.268L13.5001 18.979C13.6138 18.9123 13.7397 18.8687 13.8703 18.8509C14.001 18.833 14.1339 18.8412 14.2614 18.8749C14.3889 18.9086 14.5085 18.9672 14.6132 19.0473C14.718 19.1274 14.8059 19.2274 14.8718 19.3416C14.9378 19.4559 14.9805 19.582 14.9975 19.7128C15.0145 19.8435 15.0054 19.9764 14.9709 20.1037C14.9363 20.2309 14.8769 20.3501 14.7961 20.4543C14.7153 20.5586 14.6147 20.6458 14.5001 20.711L12.5001 21.866C12.348 21.9537 12.1756 22 12.0001 22C11.8245 22 11.6521 21.9537 11.5001 21.866L9.50005 20.711C9.38541 20.6458 9.28479 20.5586 9.20399 20.4543C9.12319 20.3501 9.0638 20.2309 9.02924 20.1037C8.99469 19.9764 8.98565 19.8435 9.00265 19.7128C9.01965 19.582 9.06235 19.4559 9.12829 19.3416C9.19423 19.2274 9.28211 19.1274 9.38688 19.0473C9.49164 18.9672 9.61121 18.9086 9.73871 18.8749C9.86621 18.8412 9.99912 18.833 10.1298 18.8509C10.2604 18.8687 10.3863 18.9123 10.5001 18.979L11.0001 19.268V18C11.0001 17.7348 11.1054 17.4804 11.2929 17.2929C11.4805 17.1053 11.7348 17 12.0001 17Z"
      fill="black"
    />
  </svg>
)

export default function ProductViewerMulti() {
  const [products, setProducts] = useState<(Product | null)[]>(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState(products[0] as Product)
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [showQRCode, setShowQRCode] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const modelViewerRef = useRef<HTMLElement | null>(null)

  // Product editing states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false)
  const [newProductIndex, setNewProductIndex] = useState<number | null>(null)

  // Drag and drop states
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [productPositions, setProductPositions] = useState<{ [key: number]: { top: number; left: number } }>({})
  const [initialPositions, setInitialPositions] = useState<{ [key: number]: { top: number; left: number } }>({})
  const productRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  // UI Settings states
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  // Update the UI Settings state to include viewerBackgroundColor
  const [uiSettings, setUISettings] = useState<UISettings>({
    accentColor: "#EB2B21",
    productCornerRadius: 6,
    buttonCornerRadius: 5,
    viewerBackgroundColor: "#F2F2F2", // Add default background color
  })

  // Hotspot editing states
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingHotspot, setEditingHotspot] = useState<any>(null)
  const [allHotspots, setAllHotspots] = useState<any[]>([])
  const [showHotspotForm, setShowHotspotForm] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // Initialize hotspots when product changes
  useEffect(() => {
    if (selectedProduct && selectedProduct.hotspots) {
      setAllHotspots([...selectedProduct.hotspots])
    } else {
      setAllHotspots([])
    }
  }, [selectedProduct])

  // Handle responsive layout and device detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      // Consider both mobile and tablet as the same layout (anything under 1024px)
      setIsMobileOrTablet(width < 1024)
      setIsDesktop(width >= 1024)
    }

    // Detect iOS device
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      return /iphone|ipad|ipod/.test(userAgent)
    }

    // Set initial values
    handleResize()
    setIsIOS(detectIOS())

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reset active hotspot when product changes
  useEffect(() => {
    setActiveHotspot(null)
  }, [selectedProduct])

  // Update selected product when products change
  useEffect(() => {
    // Find the first non-null product
    const firstProduct = products.find((p) => p !== null) as Product
    if (selectedProduct && products.includes(selectedProduct)) {
      // Keep the current selection if it still exists
    } else if (firstProduct) {
      // Select the first available product
      setSelectedProduct(firstProduct)
    }
  }, [products, selectedProduct])

  // Add global cursor style when dragging
  useEffect(() => {
    if (isDragging) {
      document.body.classList.add("dragging")
    } else {
      document.body.classList.remove("dragging")
    }

    return () => {
      document.body.classList.remove("dragging")
    }
  }, [isDragging])

  // Capture initial positions of all product items
  useEffect(() => {
    if (!isDragging) {
      const positions: { [key: number]: { top: number; left: number } } = {}

      products.forEach((product, index) => {
        if (product) {
          const element = productRefs.current[product.id]
          if (element) {
            const rect = element.getBoundingClientRect()
            positions[product.id] = { top: rect.top, left: rect.left }
          }
        }
      })

      setInitialPositions(positions)
      setProductPositions(positions)
    }
  }, [products, isDragging])

  // Generate AR URL for QR code
  const getARUrl = () => {
    const baseUrl = window.location.origin
    const modelUrl = selectedProduct.modelUrl

    // Create a URL that will handle redirecting to the appropriate AR experience
    return `${baseUrl}/ar-redirect?model=${encodeURIComponent(modelUrl)}&name=${encodeURIComponent(selectedProduct.name)}`
  }

  // Handle AR button click
  const handleARButtonClick = () => {
    if (isDesktop) {
      // Show QR code for desktop users
      setShowQRCode(!showQRCode)
    } else {
      // For mobile devices, use the model-viewer's AR functionality
      if (modelViewerRef.current) {
        modelViewerRef.current.activateAR()
      }
    }
  }

  // Handle hotspot click
  const handleHotspotClick = (id: string) => {
    setActiveHotspot(activeHotspot === id ? null : id)
  }

  // Handle adding a new hotspot
  const handleAddHotspot = () => {
    setIsEditMode(true)
    setShowHotspotForm(true)
    setEditingHotspot(null)
    setUploadedImage(null)
  }

  // Handle saving a hotspot
  const handleSaveHotspot = (formData: any) => {
    if (editingHotspot) {
      // Update existing hotspot without changing position
      const updatedHotspots = allHotspots.map((h) =>
        h.id === editingHotspot.id
          ? {
              ...editingHotspot,
              name: formData.name,
              description: formData.description,
              subcopy: formData.subcopy,
              image: uploadedImage || formData.image,
            }
          : h,
      )
      setAllHotspots(updatedHotspots)
    } else {
      // Add new hotspot with default position
      const newHotspot = {
        ...formData,
        id: `custom-${Date.now()}`, // Generate a unique ID
        position: "0 0.3 0", // Default position in the center
        normal: "0 0 1", // Default normal facing forward
      }
      setAllHotspots([...allHotspots, newHotspot])
    }

    setShowHotspotForm(false)
    setIsEditMode(true) // Keep edit mode active
    setEditingHotspot(null)
    setUploadedImage(null)
  }

  // Handle editing an existing hotspot
  const handleEditHotspot = (hotspot: any) => {
    setIsEditMode(true)
    setEditingHotspot(hotspot)
    setShowHotspotForm(true)
    setUploadedImage(hotspot.image)
  }

  // Handle deleting a hotspot
  const handleDeleteHotspot = (hotspotId: string) => {
    setAllHotspots(allHotspots.filter((h) => h.id !== hotspotId))
    setActiveHotspot(null)
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Cancel hotspot editing
  const handleCancelHotspotEdit = () => {
    setShowHotspotForm(false)
    setEditingHotspot(null)
    setUploadedImage(null)
  }

  // Product editing functions
  const handleProductEdit = (product: Product) => {
    setProductToEdit(product)
    setIsCreatingNewProduct(false)
    setIsEditModalOpen(true)
  }

  const handleCreateNewProduct = (index: number) => {
    // Create a template for a new product
    const newProduct: Product = {
      id: Date.now(), // Use timestamp as temporary ID
      name: "New Product",
      description: "Add product description",
      price: 699.0,
      image: "/placeholder.svg?height=160&width=160",
      modelUrl: "",
      buyNowLink: "#",
    }

    setProductToEdit(newProduct)
    setIsCreatingNewProduct(true)
    setNewProductIndex(index)
    setIsEditModalOpen(true)
  }

  const handleSaveProduct = (updatedProduct: Product) => {
    if (isCreatingNewProduct && newProductIndex !== null) {
      // Add new product at the specified index
      const updatedProducts = [...products]
      updatedProducts[newProductIndex] = updatedProduct
      setProducts(updatedProducts)
      setSelectedProduct(updatedProduct)
    } else {
      // Update existing product
      setProducts((prevProducts) => prevProducts.map((p) => (p && p.id === updatedProduct.id ? updatedProduct : p)))
      if (selectedProduct.id === updatedProduct.id) {
        setSelectedProduct(updatedProduct)
      }
    }

    setIsCreatingNewProduct(false)
    setNewProductIndex(null)
  }

  const handleAddToCart = () => {
    if (selectedProduct && selectedProduct.buyNowLink) {
      // In a real app, you would add the product to cart here
      alert(`Added ${selectedProduct.name} to cart!`)
      // Or navigate to the cart page
      // window.location.href = "/cart"
    }
  }

  const handleDeleteProduct = (productId: number) => {
    // Find the index of the product to delete
    const indexToDelete = products.findIndex((p) => p && p.id === productId)

    if (indexToDelete !== -1) {
      // Create a new array with the product removed and null moved to the end
      const updatedProducts = [...products]
      updatedProducts.splice(indexToDelete, 1) // Remove the product
      updatedProducts.push(null) // Add null at the end

      setProducts(updatedProducts)

      // If the selected product is being deleted, select another one
      if (selectedProduct.id === productId) {
        const nextProduct = updatedProducts.find((p) => p !== null) as Product
        if (nextProduct) {
          setSelectedProduct(nextProduct)
        }
      }
    }
  }

  // Add a function to handle saving settings
  const handleSaveSettings = (newSettings: UISettings) => {
    setUISettings(newSettings)
  }

  // Drag and drop handlers
  const handleDragStart = (product: Product, index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!e || !product) return // Guard against undefined event or null product

    setDraggedProduct(product)
    setIsDragging(true)

    // Set the drag image to be the product image
    const dragImage = new Image()
    dragImage.src = product.image
    dragImage.width = 50
    dragImage.height = 50
    dragImage.style.opacity = "0.7"

    // Set the drag image with offset
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(dragImage, 25, 25)
      e.dataTransfer.setData("text/plain", product.id.toString())
      e.dataTransfer.effectAllowed = "move"
    }

    // Add a class to the dragged element for styling
    if (e.currentTarget) {
      e.currentTarget.classList.add("dragging")
    }

    // Capture initial positions
    const positions: { [key: number]: { top: number; left: number } } = {}
    products.forEach((p, i) => {
      if (p) {
        const element = productRefs.current[p.id]
        if (element) {
          const rect = element.getBoundingClientRect()
          positions[p.id] = { top: rect.top, left: rect.left }
        }
      }
    })

    setInitialPositions(positions)
    setProductPositions(positions)
  }

  const handleDragOver = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!e || !draggedProduct) return

    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move"
    }

    // Update the dragOverIndex to show where the item will be placed
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnter = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!e || !draggedProduct) return
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e) return
    e.preventDefault()
    // Only clear the dragOverIndex if we're leaving to an element that's not a valid drop target
    if (!e.currentTarget.classList.contains("product-item")) {
      setDragOverIndex(null)
    }
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e) return

    setIsDragging(false)
    setDraggedProduct(null)
    setDragOverIndex(null)

    // Remove the dragging class
    if (e.currentTarget) {
      e.currentTarget.classList.remove("dragging")
    }

    // Reset all product items
    const items = document.querySelectorAll(".product-item")
    items.forEach((item) => {
      ;(item as HTMLElement).style.transform = ""
      item.classList.remove("dragging", "drag-over")
    })

    // Reset positions
    setProductPositions({})
  }

  const handleDrop = (targetIndex: number) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!e || !draggedProduct) return

    e.preventDefault()

    // Find the index of the dragged product
    const draggedIndex = products.findIndex((p) => p && p.id === draggedProduct.id)

    if (draggedIndex === targetIndex) {
      return
    }

    // Create a new array with the swapped products
    const reorderedProducts = [...products]

    // Swap the positions
    const temp = reorderedProducts[draggedIndex]
    reorderedProducts[draggedIndex] = reorderedProducts[targetIndex]
    reorderedProducts[targetIndex] = temp

    // Update the state
    setProducts(reorderedProducts)
    setIsDragging(false)
    setDraggedProduct(null)
    setDragOverIndex(null)
    setProductPositions({})
  }

  // Safe event handler for mouse events
  const handleMouseDown = (element: HTMLElement) => {
    if (element) {
      element.style.cursor = "grabbing"
    }
  }

  const handleMouseUp = (element: HTMLElement) => {
    if (element) {
      element.style.cursor = ""
    }
  }

  // Safe handler for product selection
  const handleProductSelect = (product: Product) => {
    if (!isDragging && product) {
      setSelectedProduct(product)
    }
  }

  // Safe handler for edit button click
  const handleEditButtonClick = (e: React.MouseEvent, product: Product) => {
    if (e) {
      e.stopPropagation()
    }
    handleProductEdit(product)
  }

  // Render hotspots for the selected product
  const renderHotspots = () => {
    if (!allHotspots || allHotspots.length === 0) return null

    return allHotspots.map((hotspot, index) => {
      const isActive = activeHotspot === hotspot.id

      return (
        <button
          key={hotspot.id}
          slot={`hotspot-${index + 1}`}
          data-position={hotspot.position}
          data-normal={hotspot.normal}
          className={`hotspot ${isActive ? "active" : ""}`}
          onClick={() => handleHotspotClick(hotspot.id)}
        >
          <div className="hotspot-dot"></div>
          {isActive && (
            <div className="hotspot-label">
              <div className="hotspot-container">
                {hotspot.image && (
                  <div className="hotspot-image">
                    <Image
                      src={hotspot.image || "/placeholder.svg"}
                      alt={hotspot.name}
                      width={120}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="hotspot-content">
                  <div className="hotspot-title">{hotspot.name}</div>
                  <div className="hotspot-description">{hotspot.description}</div>
                  {hotspot.subcopy && <div className="hotspot-subcopy">{hotspot.subcopy}</div>}
                  {isEditMode && (
                    <div className="hotspot-actions mt-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditHotspot(hotspot)
                        }}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteHotspot(hotspot.id)
                        }}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </button>
      )
    })
  }

  // Hotspot Form Component
  const HotspotForm = () => {
    const [formData, setFormData] = useState({
      name: editingHotspot?.name || "",
      description: editingHotspot?.description || "",
      subcopy: editingHotspot?.subcopy || "",
      image: editingHotspot?.image || uploadedImage || "/placeholder.svg?height=200&width=200",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // Update the image from the uploaded image if available
      const finalFormData = {
        ...formData,
        image: uploadedImage || formData.image,
      }
      handleSaveHotspot(finalFormData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">{editingHotspot ? "Edit Hotspot" : "Add New Hotspot"}</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Hotspot Image</label>
              <div className="mb-2">
                <Image
                  src={uploadedImage || formData.image}
                  alt="Hotspot preview"
                  width={200}
                  height={150}
                  className="rounded border object-cover w-full h-auto"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Main Copy (Title)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subcopy" className="block text-sm font-medium mb-1">
                Subcopy
              </label>
              <textarea
                id="subcopy"
                name="subcopy"
                value={formData.subcopy}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={handleCancelHotspotEdit} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Save Hotspot
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Add CSS for drag and drop animations */}
      <style jsx global>{`
      .product-item {
        transition: transform 0.3s ease, opacity 0.2s ease, box-shadow 0.2s ease;
        position: relative;
        z-index: 1;
      }
      
      .product-item.dragging {
        opacity: 0.6;
        z-index: 10;
        cursor: grabbing !important;
      }
      
      .product-item.drag-over {
        transform: scale(1.05);
        z-index: 5;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }
      
      /* Custom cursor styles */
      .product-item {
        cursor: default;
      }
      
      .product-item:active {
        cursor: grabbing;
      }
      
      body.dragging * {
        cursor: grabbing !important;
      }
      
      .product-item-animated {
        transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s ease;
      }

      .empty-product-slot {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f2f2f2;
        border: 2px dashed #d1d1d1;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .empty-product-slot:hover {
        background-color: #e8e8e8;
        border-color: #b1b1b1;
      }

      .empty-product-slot .plus-icon {
        opacity: 0.5;
        transition: opacity 0.2s ease;
      }

      .empty-product-slot:hover .plus-icon {
        opacity: 1;
      }
      
      .hotspot {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        border: none;
        background-color: transparent;
        position: relative;
        cursor: pointer;
        outline: none;
        z-index: 10;
      }
      
      .hotspot-dot {
        display: block;
        width: 12px;
        height: 12px;
        border-radius: 6px;
        border: 2px solid white;
        background-color: #EB2B21;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        position: absolute;
        top: 4px;
        left: 4px;
        transition: all 0.3s ease;
      }
      
      .hotspot:hover .hotspot-dot {
        transform: scale(1.2);
      }
      
      .hotspot.active .hotspot-dot {
        transform: scale(1.5);
        background-color: #EB2B21;
      }
      
      .hotspot-label {
        position: absolute;
        width: 320px;
        border-radius: 6px;
        background-color: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
        top: 25px;
        left: -160px;
        transform: translateX(0);
        z-index: 10;
        overflow: hidden;
      }
      
      .hotspot-container {
        display: flex;
        flex-direction: row;
      }
      
      .hotspot-image {
        width: 120px;
        flex-shrink: 0;
        overflow: hidden;
      }
      
      .hotspot-content {
        flex: 1;
        padding: 10px;
        display: flex;
        flex-direction: column;
      }
      
      .hotspot-title {
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 4px;
        color: #000000;
      }
      
      .hotspot-description {
        font-size: 12px;
        color: #333333;
        line-height: 1.4;
        margin-bottom: 4px;
      }
      
      .hotspot-subcopy {
        font-size: 11px;
        color: #666666;
        line-height: 1.3;
        font-style: italic;
      }
      
      .hotspot-actions {
        margin-top: auto;
      }
      
      /* Responsive adjustments for mobile */
      @media (max-width: 768px) {
        .hotspot-label {
          width: 280px;
          left: -140px;
        }
        
        .hotspot-image {
          width: 100px;
        }
      }
    `}</style>

      {/* Load Model Viewer script */}
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        onLoad={() => setModelViewerLoaded(true)}
      />

      {/* Mobile/Tablet Layout */}
      {isMobileOrTablet ? (
        <div className="flex flex-col w-full min-h-screen bg-[#ffffff]" style={{ fontFamily: "Inter, sans-serif" }}>
          {/* AR Viewer - Full width on mobile/tablet */}
          <div className="w-full h-[calc(100vh-300px)] bg-[#f2f2f2] flex flex-col items-center justify-center relative">
            {/* 3D Model Viewer */}
            <div className="w-full h-full flex items-center justify-center relative">
              {modelViewerLoaded && selectedProduct ? (
                <>
                  {/* Update the model-viewer component to use the background color from settings */}
                  <model-viewer
                    ref={(ref) => {
                      modelViewerRef.current = ref
                    }}
                    src={selectedProduct.modelUrl}
                    alt={`${selectedProduct.name} 3D model`}
                    camera-controls
                    auto-rotate={!isEditMode}
                    ar
                    ar-modes="webxr scene-viewer"
                    ar-scale="fixed"
                    exposure="0.5"
                    shadow-intensity="1"
                    environment-image="neutral"
                    interaction-prompt="none"
                    style={{ width: "100%", height: "100%", backgroundColor: uiSettings.viewerBackgroundColor }}
                  >
                    {renderHotspots()}
                  </model-viewer>

                  {/* Edit Mode Controls - Mobile */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        isEditMode ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                      }`}
                    >
                      {isEditMode ? "Exit Edit" : "Edit Hotspots"}
                    </button>

                    {isEditMode && (
                      <button
                        onClick={handleAddHotspot}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                      >
                        Add Hotspot
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Inter, sans-serif" }}>
                  {selectedProduct ? "Loading 3D model..." : "No product selected"}
                </div>
              )}
            </div>

            {/* AR Button - Mobile/Tablet */}
            {selectedProduct && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleARButtonClick}
                  className="flex items-center justify-center gap-2 bg-white rounded-full py-3 px-6 shadow-md"
                  style={{ color: "#000000" }}
                >
                  <ARIcon className="w-5 h-5" />
                  <span className="font-medium">VIEW IN YOUR SPACE</span>
                </button>
              </div>
            )}
          </div>

          {/* Product Info - Mobile/Tablet height */}
          <div
            className="w-full h-[300px] p-6 flex flex-col justify-between"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <div className="flex justify-between items-start">
              <div>
                {selectedProduct ? (
                  <>
                    <h1
                      className="text-[24px] font-bold text-[#000000] mb-1"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {selectedProduct.name}
                    </h1>
                    <p className="text-[18px] text-[#9b9b9b]" style={{ fontFamily: "Inter, sans-serif" }}>
                      {selectedProduct.description}
                    </p>
                  </>
                ) : (
                  <h1 className="text-[24px] font-bold text-[#000000] mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    No product selected
                  </h1>
                )}
              </div>
              {selectedProduct && (
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 hover:bg-gray-100 bg-white rounded-full shadow-sm"
                  aria-label="Settings"
                  style={{ color: uiSettings.accentColor }}
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Thumbnails - horizontal scroll on mobile/tablet */}
            <div className="overflow-x-auto pb-3 -mx-2">
              <div className="flex gap-3 px-4 py-2">
                {products.map((product, index) => {
                  const isSelected = product && selectedProduct && selectedProduct.id === product.id
                  const isBeingDragged = draggedProduct && product && draggedProduct.id === product.id
                  const isDraggedOver = dragOverIndex === index

                  if (product) {
                    // Render product item
                    return (
                      <div
                        key={index}
                        ref={(el) => product && (productRefs.current[product.id] = el)}
                        className={`relative flex-shrink-0 w-[67px] h-[70px] product-item product-item-animated
                          ${isBeingDragged ? "dragging" : ""}
                          ${isDraggedOver ? "drag-over" : ""}
                        `}
                        style={{
                          transform:
                            product && !isBeingDragged && productPositions[product.id] && initialPositions[product.id]
                              ? `translate(${productPositions[product.id].left - initialPositions[product.id].left}px, ${productPositions[product.id].top - initialPositions[product.id].top}px)`
                              : "",
                        }}
                        draggable={!!product}
                        onMouseDown={(e) => handleMouseDown(e.currentTarget)}
                        onMouseUp={(e) => handleMouseUp(e.currentTarget)}
                        onDragStart={handleDragStart(product, index)}
                        onDragOver={handleDragOver(index)}
                        onDragEnter={handleDragEnter(index)}
                        onDragLeave={handleDragLeave}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop(index)}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div
                          className={`w-full h-full bg-[#f2f2f2] overflow-hidden flex items-center justify-center`}
                          style={{
                            borderRadius: `${uiSettings.productCornerRadius}px`,
                            ...(isSelected
                              ? {
                                  boxShadow: `0 0 0 2px ${uiSettings.accentColor}, 0 0 0 4px white`,
                                }
                              : {}),
                          }}
                        >
                          <Image
                            src={product.image || "/placeholder.svg?height=160&width=160"}
                            alt={`${product.name} view`}
                            width={160}
                            height={160}
                            className="object-contain w-full h-full"
                            draggable={false}
                          />
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <button
                            onClick={(e) => handleEditButtonClick(e, product)}
                            className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                            aria-label="Edit product"
                          >
                            <Edit2 className="w-3 h-3" style={{ color: uiSettings.accentColor }} />
                          </button>
                        </div>
                      </div>
                    )
                  } else {
                    // Render empty slot
                    return (
                      <div
                        key={index}
                        className={`relative flex-shrink-0 w-[67px] h-[70px] empty-product-slot
                          ${isDraggedOver ? "drag-over" : ""}
                        `}
                        style={{ borderRadius: `${uiSettings.productCornerRadius}px` }}
                        onDragOver={handleDragOver(index)}
                        onDragEnter={handleDragEnter(index)}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop(index)}
                        onClick={() => handleCreateNewProduct(index)}
                      >
                        <Plus className="w-5 h-5 text-[#9b9b9b] plus-icon" />
                      </div>
                    )
                  }
                })}
              </div>
            </div>

            {/* Add to Cart button */}
            <div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedProduct}
                className={`w-full ${selectedProduct ? "" : "bg-[#c6c6c6]"} text-white px-6 flex items-center justify-between`}
                style={{
                  fontFamily: "Inter, sans-serif",
                  height: "50px",
                  backgroundColor: selectedProduct ? uiSettings.accentColor : "#c6c6c6",
                  borderRadius: `${uiSettings.buttonCornerRadius}px`,
                }}
              >
                <span className="text-xl font-medium">ADD TO CART</span>
                <span className="text-xl font-medium">
                  {selectedProduct ? `$ ${selectedProduct.price.toFixed(2)}` : "$ 0.00"}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Desktop Layout
        <div className="flex flex-row w-full min-h-screen bg-[#ffffff]" style={{ fontFamily: "Inter, sans-serif" }}>
          {/* Left side - AR Viewer */}
          <div className="w-3/5 bg-[#f2f2f2] flex flex-col items-center justify-center relative">
            {/* 3D Model Viewer */}
            <div className="w-full h-full flex items-center justify-center relative">
              {modelViewerLoaded && selectedProduct ? (
                <>
                  {/* Update the model-viewer component to use the background color from settings */}
                  <model-viewer
                    ref={(ref) => {
                      modelViewerRef.current = ref
                    }}
                    src={selectedProduct.modelUrl}
                    alt={`${selectedProduct.name} 3D model`}
                    camera-controls
                    auto-rotate={!isEditMode}
                    ar
                    ar-modes="webxr scene-viewer"
                    ar-scale="fixed"
                    exposure="0.5"
                    shadow-intensity="1"
                    environment-image="neutral"
                    interaction-prompt="none"
                    style={{ width: "100%", height: "100%", backgroundColor: uiSettings.viewerBackgroundColor }}
                  >
                    {renderHotspots()}
                  </model-viewer>

                  {/* Edit Mode Controls */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className={`px-4 py-2 rounded-md ${
                        isEditMode ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                      }`}
                    >
                      {isEditMode ? "Exit Edit Mode" : "Edit Hotspots"}
                    </button>

                    {isEditMode && (
                      <button onClick={handleAddHotspot} className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md">
                        Add Hotspot
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Inter, sans-serif" }}>
                  {selectedProduct ? "Loading 3D model..." : "No product selected"}
                </div>
              )}
            </div>

            {/* AR Button - Desktop */}
            {selectedProduct && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleARButtonClick}
                  className="flex items-center justify-center gap-2 bg-white rounded-full py-3 px-8 shadow-md hover:bg-gray-50 transition-colors"
                  style={{ color: "#000000" }}
                >
                  <ARIcon className="w-6 h-6" />
                  <span className="font-medium text-lg">VIEW IN YOUR SPACE</span>
                </button>
              </div>
            )}

            {/* QR Code Overlay - Only shown when button is clicked on desktop */}
            {showQRCode && isDesktop && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                <div className="bg-white p-8 rounded-lg max-w-md text-center">
                  <button
                    onClick={() => setShowQRCode(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                  <h3 className="text-xl font-bold mb-4">Scan to view in AR</h3>
                  <div className="bg-white p-4 inline-block rounded-lg mb-4">
                    <QRCodeSVG value={getARUrl()} size={200} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Scan this QR code with your mobile device to view this product in your space.
                  </p>
                  <p className="text-xs text-gray-500">Works with AR Quick Look on iOS and ARCore on Android.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Product Info */}
          <div className="w-2/5 p-8 flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex justify-between items-start mb-8">
              <div>
                {selectedProduct ? (
                  <>
                    <h1 className="text-4xl font-bold text-[#000000] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      {selectedProduct.name}
                    </h1>
                    <p className="text-[#9b9b9b] text-lg" style={{ fontFamily: "Inter, sans-serif" }}>
                      {selectedProduct.description}
                    </p>
                  </>
                ) : (
                  <h1 className="text-4xl font-bold text-[#000000] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    No product selected
                  </h1>
                )}
              </div>
              {selectedProduct && (
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 hover:bg-gray-100 bg-white rounded-full shadow-sm"
                  aria-label="Settings"
                  style={{ color: uiSettings.accentColor }}
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Thumbnails grid */}
            <div className="grid grid-cols-4 gap-4 mb-auto">
              {products.map((product, index) => {
                const isSelected = product && selectedProduct && selectedProduct.id === product.id
                const isBeingDragged = draggedProduct && product && draggedProduct.id === product.id
                const isDraggedOver = dragOverIndex === index

                if (product) {
                  // Render product item
                  return (
                    <div
                      key={index}
                      ref={(el) => product && (productRefs.current[product.id] = el)}
                      className={`relative product-item product-item-animated
                      ${isBeingDragged ? "dragging" : ""}
                      ${isDraggedOver ? "drag-over" : ""}
                    `}
                      style={{
                        transform:
                          product && !isBeingDragged && productPositions[product.id] && initialPositions[product.id]
                            ? `translate(${productPositions[product.id].left - initialPositions[product.id].left}px, ${productPositions[product.id].top - initialPositions[product.id].top}px)`
                            : "",
                      }}
                      draggable={!!product}
                      onMouseDown={(e) => handleMouseDown(e.currentTarget)}
                      onMouseUp={(e) => handleMouseUp(e.currentTarget)}
                      onDragStart={handleDragStart(product, index)}
                      onDragOver={handleDragOver(index)}
                      onDragEnter={handleDragEnter(index)}
                      onDragLeave={handleDragLeave}
                      onDragEnd={handleDragEnd}
                      onDrop={handleDrop(index)}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div
                        className={`aspect-square bg-[#f2f2f2] overflow-hidden flex items-center justify-center`}
                        style={{
                          borderRadius: `${uiSettings.productCornerRadius}px`,
                          ...(isSelected
                            ? {
                                boxShadow: `0 0 0 2px ${uiSettings.accentColor}`,
                              }
                            : {}),
                        }}
                      >
                        <Image
                          src={product.image || "/placeholder.svg?height=160&width=160"}
                          alt={`${product.name} view`}
                          width={160}
                          height={160}
                          className="object-contain w-full h-full"
                          draggable={false}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <button
                          onClick={(e) => handleEditButtonClick(e, product)}
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          aria-label="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" style={{ color: uiSettings.accentColor }} />
                        </button>
                      </div>
                    </div>
                  )
                } else {
                  // Render empty slot
                  return (
                    <div
                      key={index}
                      className={`relative aspect-square empty-product-slot
                      ${isDraggedOver ? "drag-over" : ""}
                    `}
                      style={{ borderRadius: `${uiSettings.productCornerRadius}px` }}
                      onDragOver={handleDragOver(index)}
                      onDragEnter={handleDragEnter(index)}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop(index)}
                      onClick={() => handleCreateNewProduct(index)}
                    >
                      <Plus className="w-8 h-8 text-[#9b9b9b] plus-icon" />
                    </div>
                  )
                }
              })}
            </div>

            {/* Add to Cart button */}
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedProduct}
                className={`w-full ${selectedProduct ? "" : "bg-[#c6c6c6]"} text-white py-4 px-6 flex items-center justify-between`}
                style={{
                  fontFamily: "Inter, sans-serif",
                  backgroundColor: selectedProduct ? uiSettings.accentColor : "#c6c6c6",
                  borderRadius: `${uiSettings.buttonCornerRadius}px`,
                }}
              >
                <span className="text-xl font-medium">ADD TO CART</span>
                <span className="text-xl font-medium">
                  {selectedProduct ? `$ ${selectedProduct.price.toFixed(2)}` : "$ 0.00"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {(productToEdit || isCreatingNewProduct) && (
        <ProductEditModal
          product={productToEdit as Product}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setIsCreatingNewProduct(false)
            setNewProductIndex(null)
          }}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={uiSettings}
        onSave={handleSaveSettings}
      />

      {/* Hotspot Form Modal */}
      {showHotspotForm && <HotspotForm />}
    </>
  )
}
