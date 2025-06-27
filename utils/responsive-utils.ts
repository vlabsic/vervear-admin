/**
 * Forces the browser to apply responsive styles based on the current viewport
 */
export function forceResponsiveStyles(viewport: "desktop" | "tablet" | "mobile"): void {
  // Get all media query style tags
  const mediaQueryRules: string[] = []

  // Extract media query rules from stylesheets
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const styleSheet = document.styleSheets[i]
      const rules = styleSheet.cssRules || styleSheet.rules

      if (!rules) continue

      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j]
        if (rule instanceof CSSMediaRule) {
          // Check if this is a media query for the target viewport
          if (
            (viewport === "mobile" && rule.conditionText.includes("max-width: 767px")) ||
            (viewport === "tablet" &&
              rule.conditionText.includes("min-width: 768px") &&
              rule.conditionText.includes("max-width: 1023px")) ||
            (viewport === "desktop" && rule.conditionText.includes("min-width: 1024px"))
          ) {
            // Extract the CSS rules inside this media query
            for (let k = 0; k < rule.cssRules.length; k++) {
              mediaQueryRules.push(rule.cssRules[k].cssText)
            }
          }
        }
      }
    } catch (e) {
      // Skip cross-origin stylesheets
      continue
    }
  }

  // Apply the extracted rules directly
  if (mediaQueryRules.length > 0) {
    const styleTag = document.createElement("style")
    styleTag.id = "forced-responsive-styles"
    styleTag.textContent = mediaQueryRules.join("\n")

    // Remove any existing forced styles
    document.getElementById("forced-responsive-styles")?.remove()

    // Add the new styles
    document.head.appendChild(styleTag)
  }
}
