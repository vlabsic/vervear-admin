"use client"

import { type ReactNode, useEffect } from "react"
import TopNavigationBar from "./top-navigation-bar"
import ViewportContainer from "./viewport-container"

interface ResponsivePageWrapperProps {
  children: ReactNode
}

export default function ResponsivePageWrapper({ children }: ResponsivePageWrapperProps) {
  // Force a resize event on initial load to ensure responsive styles apply
  useEffect(() => {
    // Small delay to ensure all components are mounted
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 100)
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <TopNavigationBar />
      <ViewportContainer>{children}</ViewportContainer>
    </div>
  )
}
