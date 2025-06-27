// Import the GlobalLayoutWrapper
import GlobalLayoutWrapper from "@/components/global-layout-wrapper"
import SingleProductViewB from "../../components/single-product-view-b"

// Wrap the page content with GlobalLayoutWrapper
export default function SingleGlassesDemoB() {
  return (
    <GlobalLayoutWrapper>
      {/* Existing page content */}
      <SingleProductViewB />
    </GlobalLayoutWrapper>
  )
}
