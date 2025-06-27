// Import the GlobalLayoutWrapper
import GlobalLayoutWrapper from "@/components/global-layout-wrapper"
import ProductViewB from "../../components/product-view-b"

// Wrap the page content with GlobalLayoutWrapper
export default function GlassesDemoB() {
  return (
    <GlobalLayoutWrapper>
      {/* Existing page content */}
      <ProductViewB />
    </GlobalLayoutWrapper>
  )
}
