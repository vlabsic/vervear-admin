"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react"

type VerveARLayoutProps = {
  children: React.ReactNode
  title?: string
}

export default function VerveARLayout({ children, title }: VerveARLayoutProps) {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  return (
    <div className="min-h-screen bg-[#1f1f23] flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          {/* VerveAR Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff5e1a] rounded-md flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 19.5H22L12 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-[#ff5e1a] font-semibold text-xl">VerveAR</span>
          </div>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2 rounded-full border border-white/20 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Device Preview Toggles */}
        <div className="bg-[#131313] rounded-md p-1 flex items-center">
          <button
            className={`p-2 rounded ${activeDevice === "desktop" ? "bg-[#3f3f46] text-white" : "text-white/60"}`}
            onClick={() => setActiveDevice("desktop")}
          >
            <Monitor size={20} />
          </button>
          <button
            className={`p-2 rounded ${activeDevice === "tablet" ? "bg-[#3f3f46] text-white" : "text-white/60"}`}
            onClick={() => setActiveDevice("tablet")}
          >
            <Tablet size={20} />
          </button>
          <button
            className={`p-2 rounded ${activeDevice === "mobile" ? "bg-[#3f3f46] text-white" : "text-white/60"}`}
            onClick={() => setActiveDevice("mobile")}
          >
            <Smartphone size={20} />
          </button>
        </div>

        {/* Preview & Publish Buttons */}
        <div className="flex items-center gap-3">
          <button className="bg-[#131313] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#3f3f46] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 4.5L4.5 12L12 19.5M19.5 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Preview</span>
          </button>
          <button className="bg-[#ff5e1a] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#e54e09] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 4.5L19.5 12L12 19.5M4.5 12H18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex items-center justify-center">
        <div
          className={`bg-white rounded-lg overflow-hidden shadow-xl ${
            activeDevice === "desktop"
              ? "w-[1200px] h-[800px]"
              : activeDevice === "tablet"
                ? "w-[768px] h-[1024px]"
                : "w-[375px] h-[667px]"
          } transition-all duration-300`}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
