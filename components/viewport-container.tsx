import type { ReactNode } from "react"

interface ViewportContainerProps {
  children: ReactNode
}

export default function ViewportContainer({ children }: ViewportContainerProps) {
  return (
    <div id="viewport-container" className="viewport-desktop">
      {children}
    </div>
  )
}
