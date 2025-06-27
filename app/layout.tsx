import type React from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add model-viewer polyfills for broader browser support */}
        <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js"></script>

        {/* Load Sohne font */}
        <link rel="stylesheet" href="https://use.typekit.net/hnf3gxr.css" type="text/css" />

        {/* Add viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
