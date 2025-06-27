"use client"

import { type ReactNode, useEffect } from "react"
import TopNavigationBar from "./top-navigation-bar"
import ViewportContainer from "./viewport-container"

interface GlobalLayoutWrapperProps {
  children: ReactNode
}

export default function GlobalLayoutWrapper({ children }: GlobalLayoutWrapperProps) {
  // Force a resize event on initial load to ensure responsive styles apply
  useEffect(() => {
    // Small delay to ensure all components are mounted
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 100)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigationBar />
      <div className="flex-grow">
        <ViewportContainer>{children}</ViewportContainer>
      </div>
    </div>
  )
}
