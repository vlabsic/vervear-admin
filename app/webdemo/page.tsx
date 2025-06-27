"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Minus, Plus, Share, Sparkles, X } from "lucide-react"
import ProductViewAModal from "@/components/product-view-a-modal"

export default function WebDemo() {
  const [quantity, setQuantity] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleVirtualTryOn = () => {
    setIsModalOpen(true)
    setIsLoading(true)

    // Show loading for 2 seconds
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white text-center py-3">
        <p className="text-sm font-medium">Welcome to VerveAR Demo Store</p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <img
                src="/images/hydrogen-celerity.webp"
                alt="HydroEdge Celerity Goggle"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">HydroEdge Celerity Goggle</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">$0.00 CAD</span>
                <Badge variant="secondary" className="bg-gray-800 text-white">
                  Sold out
                </Badge>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(1)} className="h-10 w-10 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleVirtualTryOn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                VIRTUAL TRY-ON
              </Button>

              <Button disabled variant="outline" className="w-full py-3 text-base font-medium bg-transparent" size="lg">
                Sold out
              </Button>

              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 text-base font-medium"
                size="lg"
              >
                Buy it now
              </Button>
            </div>

            {/* Share Button */}
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600">
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Virtual Try-On Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[75vw] max-h-[75vh] w-[75vw] h-[75vh] p-0 overflow-hidden">
          <div className="relative w-full h-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Loading Virtual Try-On...</p>
              </div>
            ) : (
              <ProductViewAModal />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
