// Import the GlobalLayoutWrapper
import GlobalLayoutWrapper from "@/components/global-layout-wrapper"
import ProductViewA from "../../components/product-view-a"

// Wrap the page content with GlobalLayoutWrapper
export default function GlassesDemoA() {
  return (
    <GlobalLayoutWrapper>
      {/* Existing page content */}
      <ProductViewA />
    </GlobalLayoutWrapper>
  )
}
