"use client"

import type { ReactNode } from "react"
import TopNavigationBar from "./top-navigation-bar"
import ViewportContainer from "./viewport-container"

interface PageWrapperProps {
  children: ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="page-wrapper">
      <TopNavigationBar />
      <div className="content-wrapper">
        <ViewportContainer>{children}</ViewportContainer>
      </div>
    </div>
  )
}
