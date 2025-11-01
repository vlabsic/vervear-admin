import { type NextRequest, NextResponse } from "next/server"

function getImagesLeftFromCookie(request: NextRequest): number {
  const cookieValue = request.cookies.get("imagesLeft")?.value
  return cookieValue ? Number.parseInt(cookieValue, 10) : 10
}

function setImagesLeftCookie(response: NextResponse, imagesLeft: number): void {
  response.cookies.set("imagesLeft", imagesLeft.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
}

export async function POST(request: NextRequest) {
  try {
    const { images, image, prompt, imageCount, furnitureCount, backgroundType, includePropFurniture, angleImages } =
      await request.json()

    const currentImagesLeft = getImagesLeftFromCookie(request)
    console.log("[v0] Server-side check - Images left:", currentImagesLeft, "Requested:", imageCount)

    if (currentImagesLeft < imageCount) {
      console.log("[v0] Server rejected: Not enough images left")
      return NextResponse.json(
        { error: "Image limit exceeded. Please subscribe or purchase more images." },
        { status: 403 },
      )
    }

    if (currentImagesLeft <= 0) {
      console.log("[v0] Server rejected: Image limit reached (0 images)")
      return NextResponse.json(
        { error: "Image limit reached. Please subscribe or purchase more images." },
        { status: 403 },
      )
    }

    const furnitureImages = images || (image ? [image] : [])
    const numFurniture = furnitureCount || furnitureImages.length

    console.log("[v0] Generate background request received", {
      hasImages: furnitureImages.length,
      prompt,
      imageCount,
      furnitureCount: numFurniture,
      backgroundType,
      includePropFurniture,
    })

    if (furnitureImages.length === 0 || !prompt) {
      return NextResponse.json({ error: "At least one image and prompt are required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.error("[v0] GEMINI_API_KEY environment variable is not set")
      return NextResponse.json(
        { error: "API key not configured. Please add GEMINI_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const imageDataArray = furnitureImages.map((img: string) => img.split(",")[1])

    const angleImageDataMap: Record<number, Record<string, { data: string; mimeType: string }>> = {}
    if (angleImages) {
      for (const [mainImageIndex, angles] of Object.entries(angleImages)) {
        angleImageDataMap[Number.parseInt(mainImageIndex)] = {}
        for (const [angleType, angleImageUrl] of Object.entries(angles as Record<string, string>)) {
          if (angleImageUrl) {
            const mimeTypeMatch = angleImageUrl.match(/^data:([^;]+);base64,/)
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg"
            const base64Data = angleImageUrl.split(",")[1]

            angleImageDataMap[Number.parseInt(mainImageIndex)][angleType] = {
              data: base64Data,
              mimeType: mimeType,
            }
          }
        }
      }
    }

    const backgroundContext = backgroundType ? `in a ${backgroundType.toLowerCase()} setting` : ""
    const environmentDescription = backgroundContext ? `${prompt} ${backgroundContext}` : prompt

    const angleImagesContext =
      Object.keys(angleImageDataMap).length > 0
        ? `\n\nADDITIONAL REFERENCE IMAGES PROVIDED:
- You have been provided with additional angle views (Front, Back, Left, Right) of the furniture
- Use these angle images as CRITICAL REFERENCE to understand:
  * The exact material composition and texture of the furniture
  * Surface finishes, grain patterns, and material properties
  * Color accuracy and tonal variations across different angles
  * Construction details and joinery
  * Dimensional accuracy and proportions from multiple perspectives
- These angle views are ESSENTIAL for maintaining material and texture fidelity
- Ensure the staged furniture matches the materials shown in ALL reference angles
- Pay special attention to how light interacts with the materials shown in the angle views`
        : ""

    const backgroundEmphasis = backgroundType
      ? `\n\nCRITICAL BACKGROUND REQUIREMENT:\n- The furniture MUST be staged in a ${backgroundType.toUpperCase()} environment\n- The setting should clearly represent a ${backgroundType.toLowerCase()} space\n- All background elements must be appropriate for a ${backgroundType.toLowerCase()}\n- The ${backgroundType.toLowerCase()} setting is NON-NEGOTIABLE and must be clearly visible`
      : ""

    const propFurnitureInstructions = includePropFurniture
      ? `\n\nPROP FURNITURE REQUIREMENTS:
- Analyze the uploaded furniture to understand its style, scale, and purpose
- Add complementary prop furniture and decor to enrich the scene
- Prop furniture should enhance the environment and create a complete, lived-in space
- Examples: side tables, lamps, plants, artwork, rugs, cushions, books, decorative objects
- Ensure prop furniture is contextually appropriate for the space type
- The UPLOADED FURNITURE must remain the PRIMARY FOCAL POINT
- Prop furniture should support and frame the main furniture, not compete with it
- Maintain visual hierarchy with the uploaded furniture as the hero piece`
      : `\n\nNO PROP FURNITURE REQUIREMENT:
- DO NOT add any additional furniture or decorative items to the scene
- ONLY show the uploaded furniture piece(s) in the environment
- The uploaded furniture should be centered and prominently displayed
- Keep the background minimal and clean to focus attention on the furniture
- Avoid adding any extra objects, decor, or supplementary furniture`

    const fullPrompt =
      numFurniture === 1
        ? `You are a professional furniture staging AI. Your task is to place the furniture shown in the reference image into the following environment: ${environmentDescription}${backgroundEmphasis}${angleImagesContext}

CRITICAL REQUIREMENTS:
- Keep the furniture EXACTLY as it appears in the reference image
- DO NOT change the furniture's material, texture, color, or finish
- DO NOT alter the furniture's size, proportions, or dimensions
- DO NOT change the furniture's angle, orientation, or perspective
- DO NOT modify any design details of the furniture
- ONLY change the background/environment around the furniture
- The furniture MUST remain the PRIMARY FOCAL POINT - do not alter its appearance, placement, or position
- Trust the original furniture positioning and stage the environment around it
${propFurnitureInstructions}

LIGHTING AND PHOTOGRAPHY REQUIREMENTS:
- Use ONLY NATURAL LIGHTING (sunlight, daylight, ambient natural light)
- DO NOT use artificial lighting (lamps, overhead lights, spotlights)
- Ensure soft, natural light that creates realistic shadows and highlights
- Stage the scene in a PROFESSIONAL PHOTOGRAPHY manner
- Apply professional product photography techniques and composition
- Create a high-end, magazine-quality photographic aesthetic
- Ensure proper exposure and natural color temperature

COMPOSITION AND FOCUS REQUIREMENTS:
- The furniture MUST be the PRIMARY FOCAL POINT of the image
- Ensure BALANCED COMPOSITION with the furniture prominently featured
- Frame the furniture properly - it should occupy the central area of the image
- Use appropriate camera angle and perspective that highlights the furniture
- Avoid cluttered or distracting backgrounds that compete for attention
- Background elements should complement and enhance the furniture, not overshadow it
- Maintain professional product photography standards
- Ensure proper lighting that highlights the furniture's features
- Create natural shadows that ground the furniture in the space

IMAGE FORMAT REQUIREMENTS:
- Generate the image in EXACTLY 1024x1024 pixels (1:1 SQUARE ASPECT RATIO)
- The output MUST be precisely 1024 pixels wide by 1024 pixels tall
- Compose the scene to work perfectly in this square format
- Center the furniture appropriately within the 1024x1024 square frame

Stage the furniture professionally in the described environment with perfect composition balance.

Generate a photorealistic 1024x1024 pixel image with the furniture staged in: ${environmentDescription}`
        : `You are a professional furniture staging AI. Your task is to analyze ${numFurniture} furniture pieces shown in the reference images and stage them together in the following environment: ${environmentDescription}${backgroundEmphasis}${angleImagesContext}

CRITICAL REQUIREMENTS FOR EACH FURNITURE PIECE:
- First, carefully analyze each furniture piece to understand what it is (chair, sofa, table, etc.)
- Keep EACH furniture piece EXACTLY as it appears in its reference image
- DO NOT change any furniture's material, texture, color, or finish
- DO NOT alter any furniture's size, proportions, or dimensions
- DO NOT change any furniture's angle, orientation, or perspective
- DO NOT modify any design details of any furniture piece
- ONLY change the background/environment around the furniture
- ALL furniture pieces MUST remain the PRIMARY FOCAL POINTS - do not alter their appearance, placement, or position
- Trust the original furniture positioning and stage the environment around them
${propFurnitureInstructions}

LIGHTING AND PHOTOGRAPHY REQUIREMENTS:
- Use ONLY NATURAL LIGHTING (sunlight, daylight, ambient natural light)
- DO NOT use artificial lighting (lamps, overhead lights, spotlights)
- Ensure soft, natural light that creates realistic shadows and highlights
- Stage the scene in a PROFESSIONAL PHOTOGRAPHY manner
- Apply professional interior design photography techniques and composition
- Create a high-end, magazine-quality photographic aesthetic
- Ensure proper exposure and natural color temperature

COMPOSITION AND FOCUS REQUIREMENTS:
- ALL ${numFurniture} furniture pieces MUST be the PRIMARY FOCAL POINTS of the image
- Ensure BALANCED COMPOSITION with all furniture pieces prominently featured
- Frame the furniture arrangement properly - they should occupy the central area of the image
- Use appropriate camera angle and perspective that showcases all furniture pieces
- Avoid cluttered or distracting backgrounds that compete for attention
- Background elements should complement and enhance the furniture, not overshadow it
- Maintain professional interior design photography standards
- Ensure proper lighting that highlights each furniture piece's features
- Create natural shadows that ground the furniture in the space
- Arrange furniture with proper spacing and visual balance

IMAGE FORMAT REQUIREMENTS:
- Generate the image in EXACTLY 1024x1024 pixels (1:1 SQUARE ASPECT RATIO)
- The output MUST be precisely 1024 pixels wide by 1024 pixels tall
- Compose the scene to work perfectly in this square format
- Arrange all furniture pieces to fit naturally within the 1024x1024 square frame

STAGING REQUIREMENTS:
- Stage ALL ${numFurniture} furniture pieces together in the SAME scene
- Arrange them naturally as they would appear in a real ${environmentDescription}
- Ensure proper spatial relationships between the furniture pieces
- Create a cohesive, professionally staged scene with balanced composition
- Make the composition look natural and professionally photographed

Generate a photorealistic 1024x1024 pixel image with all ${numFurniture} furniture pieces staged together with perfect composition balance in: ${environmentDescription}`

    console.log("[v0] Calling Gemini API with model: gemini-2.5-flash-image")

    const parts: any[] = [{ text: fullPrompt }]

    imageDataArray.forEach((imageData: string) => {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageData,
        },
      })
    })

    if (Object.keys(angleImageDataMap).length > 0) {
      console.log("[v0] Adding angle images to Gemini API request for enhanced material understanding")
      for (const [mainImageIndex, angles] of Object.entries(angleImageDataMap)) {
        for (const [angleType, angleImageInfo] of Object.entries(angles)) {
          console.log(`[v0] Adding ${angleType} angle for furniture ${mainImageIndex}`)
          parts.push({
            inline_data: {
              mime_type: angleImageInfo.mimeType,
              data: angleImageInfo.data,
            },
          })
        }
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

    let response
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: parts,
              },
            ],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 1,
              maxOutputTokens: 4096,
            },
          }),
          signal: controller.signal,
        },
      )
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      console.error("[v0] Fetch error:", fetchError)

      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timeout. Please try again with fewer images or a simpler prompt." },
          { status: 504 },
        )
      }

      return NextResponse.json({ error: "Network error. Please check your connection and try again." }, { status: 500 })
    }

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorData
      const contentType = response.headers.get("content-type")

      try {
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json()
        } else {
          const errorText = await response.text()
          errorData = { message: errorText }
        }
      } catch (parseError) {
        errorData = { message: "Failed to parse error response from Gemini API" }
      }

      console.error("[v0] Gemini API error:", JSON.stringify(errorData, null, 2))
      return NextResponse.json(
        { error: "Failed to generate image. Please try again.", details: errorData },
        { status: response.status },
      )
    }

    let data
    try {
      data = await response.json()
    } catch (parseError) {
      console.error("[v0] Failed to parse Gemini API response:", parseError)
      return NextResponse.json(
        { error: "Invalid response from image generation service. Please try again." },
        { status: 500 },
      )
    }

    console.log("[v0] Gemini API response:", JSON.stringify(data, null, 2))

    if (data.candidates && data.candidates[0]?.content?.parts) {
      const imageParts = data.candidates[0].content.parts.filter((part: any) => part.inlineData)

      console.log("[v0] Found image parts:", imageParts.length)

      if (imageParts.length > 0) {
        const generatedImages = imageParts.map((part: any) => {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
        })

        console.log("[v0] Successfully generated", generatedImages.length, "images")

        const images = []
        for (let i = 0; i < imageCount; i++) {
          images.push(generatedImages[0])
        }

        const newImagesLeft = Math.max(0, currentImagesLeft - imageCount)
        console.log("[v0] Server updating images left from", currentImagesLeft, "to", newImagesLeft)

        const jsonResponse = NextResponse.json({ images })
        setImagesLeftCookie(jsonResponse, newImagesLeft)

        return jsonResponse
      }
    }

    console.error("[v0] No image data in response")
    return NextResponse.json({ error: "No image generated", details: data }, { status: 500 })
  } catch (error) {
    console.error("[v0] Error in generate-background API:", error)
    return NextResponse.json(
      {
        error: "Internal server error. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
