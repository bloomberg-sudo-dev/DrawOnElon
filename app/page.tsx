"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DrawingStroke {
  points: { x: number; y: number }[]
  color: string
  thickness: number
}

export default function ElonMuskGame() {
  const [clickCount, setClickCount] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [showCanvas, setShowCanvas] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState("#FF6B9D")
  const [allStrokes, setAllStrokes] = useState<DrawingStroke[]>([]) // All strokes across all rounds
  const [currentSessionStrokes, setCurrentSessionStrokes] = useState(0) // Strokes in current drawing session
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCustomCursor, setShowCustomCursor] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elonImageRef = useRef<HTMLImageElement>(null)

  // Replace the colors array with basic color swatches
  const basicColors = [
    "#000000",
    "#666666",
    "#FF0000",
    "#FF6B6B",
    "#FF9500",
    "#FFD93D",
    "#6BCF7F",
    "#4ECDC4",
    "#0066CC",
    "#9B59B6",
    "#FFFFFF",
    "#CCCCCC",
    "#8B0000",
    "#FF1493",
    "#FFA500",
    "#FFFF00",
    "#32CD32",
    "#00CED1",
    "#4169E1",
    "#DA70D6",
    "#F5F5F5",
    "#A9A9A9",
    "#DC143C",
    "#FF69B4",
  ]

  // Add new state for hue and slider
  const [currentHue, setCurrentHue] = useState(340) // Pink hue
  const [brushSize, setBrushSize] = useState(5)

  // Helper function to convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0")
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const thicknesses = [
    { name: "Thin", value: 2 },
    { name: "Medium", value: 5 },
    { name: "Thick", value: 10 },
  ]

  // Calculate required clicks for current round (10, 20, 40, 80, etc.)
  const getRequiredClicks = (round: number) => 10 * Math.pow(2, round - 1)
  const requiredClicks = getRequiredClicks(currentRound)

  const handleElonClick = () => {
    if (showCanvas) return // Don't allow clicking while in drawing mode

    setClickCount((prev) => {
      const newCount = prev + 1
      if (newCount >= requiredClicks) {
        setShowCanvas(true)
        setCurrentSessionStrokes(0) // Reset stroke counter for new session
      }
      return newCount
    })
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (currentSessionStrokes >= 5) return // Max strokes reached

    setIsDrawing(true)
    const coords = getCanvasCoordinates(e)
    setCurrentStroke([coords])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || currentSessionStrokes >= 5) return

    const coords = getCanvasCoordinates(e)
    setCurrentStroke((prev) => [...prev, coords])
  }

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 0 && currentSessionStrokes < 5) {
      const newStroke = {
        points: currentStroke,
        color: currentColor,
        thickness: brushSize,
      }

      setAllStrokes((prev) => [...prev, newStroke])
      setCurrentSessionStrokes((prev) => {
        const newCount = prev + 1
        if (newCount >= 5) {
          // End drawing session, return to clicking mode
          setTimeout(() => {
            setShowCanvas(false)
            setClickCount(0) // Reset click count
            setCurrentRound((round) => round + 1) // Advance to next round
          }, 1000) // Small delay to show the completed stroke
        }
        return newCount
      })
      setCurrentStroke([])
    }
    setIsDrawing(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showCanvas) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    // Continue with existing draw logic if drawing
    if (isDrawing) {
      draw(e)
    }
  }

  const handleMouseEnter = () => {
    setShowCustomCursor(true)
  }

  const handleMouseLeave = () => {
    setShowCustomCursor(false)
    stopDrawing()
  }

  const clearCanvas = () => {
    setAllStrokes([])
    setCurrentStroke([])
    setCurrentSessionStrokes(0)
    redrawCanvas()
  }

  const undoLastStroke = () => {
    if (currentSessionStrokes > 0) {
      setAllStrokes((prev) => prev.slice(0, -1))
      setCurrentSessionStrokes((prev) => prev - 1)
    }
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const elonImage = elonImageRef.current

    if (!canvas || !ctx || !elonImage) return

    // Clear canvas and set proper dimensions
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw Elon image to fill the square canvas properly
    ctx.drawImage(elonImage, 0, 0, canvas.width, canvas.height)

    // Draw all strokes from all sessions
    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.thickness
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    })

    // Draw current stroke
    if (currentStroke.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = currentColor
      ctx.lineWidth = brushSize
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.moveTo(currentStroke[0].x, currentStroke[0].y)
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y)
      }
      ctx.stroke()
    }
  }

  // Create a composite image for clicking mode (Elon + all drawings)
  const createCompositeImage = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const elonImage = elonImageRef.current

    if (!ctx || !elonImage) return null

    canvas.width = 500
    canvas.height = 500

    // Ensure the image fills the square canvas properly
    ctx.drawImage(elonImage, 0, 0, 500, 500)

    // Draw all existing strokes
    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.thickness
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    })

    return canvas.toDataURL()
  }

  // Export function for downloading/sharing
  const exportArtwork = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const elonImage = elonImageRef.current

    if (!ctx || !elonImage) return null

    canvas.width = 500
    canvas.height = 500

    // Draw Elon image
    ctx.drawImage(elonImage, 0, 0, 500, 500)

    // Draw all existing strokes
    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.thickness
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    })

    return canvas.toDataURL("image/png")
  }

  const downloadArtwork = () => {
    const dataUrl = exportArtwork()
    if (!dataUrl) return

    const link = document.createElement("a")
    link.download = `elon-masterpiece-round-${currentRound}-${allStrokes.length}-strokes.png`
    link.href = dataUrl
    link.click()
  }

  const shareToTwitter = () => {
    const text = `Check out my Elon Musk masterpiece! 🎨 Round ${currentRound} with ${allStrokes.length} strokes! 🚀 #ElonClickerGame #DigitalArt`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  useEffect(() => {
    if (showCanvas) {
      redrawCanvas()
    }
  }, [allStrokes, currentStroke, showCanvas, brushSize, currentColor])

  useEffect(() => {
    const handleImageLoad = () => {
      if (showCanvas) {
        redrawCanvas()
      }
    }

    const elonImage = elonImageRef.current
    if (elonImage) {
      if (elonImage.complete) {
        handleImageLoad()
      } else {
        elonImage.addEventListener("load", handleImageLoad)
        return () => elonImage.removeEventListener("load", handleImageLoad)
      }
    }
  }, [showCanvas])

  const compositeImageSrc = !showCanvas && allStrokes.length > 0 ? createCompositeImage() : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4 relative">
      {/* Top Right Action Buttons - Moved to page level */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <Button
          onClick={downloadArtwork}
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg"
          disabled={allStrokes.length === 0}
        >
          📥 Download
        </Button>
        <Button
          onClick={shareToTwitter}
          variant="outline"
          size="sm"
          className="bg-blue-500/80 text-white backdrop-blur-sm hover:bg-blue-600/90 border-blue-500 shadow-lg"
          disabled={allStrokes.length === 0}
        >
          🐦 Tweet
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">🚀 DrawOnElon.xyz 🚀</h1>
          {/* Remove the buttons from here since they're now at page level */}

          {/* Game Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-lg font-bold text-purple-600">Round: {currentRound}</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-lg font-bold text-blue-600">
                Clicks: {clickCount}/{requiredClicks}
              </span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-lg font-bold text-green-600">Total Strokes: {allStrokes.length}</span>
            </div>
          </div>

          {/* Status Messages */}
          {!showCanvas && clickCount < requiredClicks && (
            <p className="text-lg text-gray-600">
              Click Elon <strong>{requiredClicks - clickCount}</strong> more times to unlock drawing mode!
            </p>
          )}
          {showCanvas && (
            <div className="space-y-2">
              <p className="text-lg text-green-600 font-semibold">🎨 Drawing mode unlocked! Draw on Elon's face!</p>
              <p className="text-md text-orange-600">
                Strokes remaining: <strong>{5 - currentSessionStrokes}</strong>/5
              </p>
              {currentSessionStrokes >= 5 && (
                <p className="text-md text-red-600 font-semibold">
                  Drawing session complete! Returning to clicking mode...
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col xl:flex-row gap-6 items-start justify-center max-w-7xl mx-auto">
          {/* Left Panel - Color Picker & Brush Size */}
          {showCanvas && (
            <Card className="w-full xl:w-72 p-4 bg-white/80 backdrop-blur-sm order-2 xl:order-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🎨 Color & Brush</h3>

              {/* Color Selection - Simplified Color Picker */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Color Picker</h4>

                {/* Current Color Display */}
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span className="text-sm font-mono text-gray-600">{currentColor}</span>
                  </div>
                </div>

                {/* Hue Slider */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-2 block">Hue</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={currentHue}
                      onChange={(e) => {
                        const hue = Number.parseInt(e.target.value)
                        setCurrentHue(hue)
                        setCurrentColor(hslToHex(hue, 80, 60))
                      }}
                      className="w-full h-4 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background:
                          "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                      }}
                      disabled={currentSessionStrokes >= 5}
                    />
                  </div>
                </div>

                {/* Basic Colors Grid */}
                <div className="mb-3">
                  <label className="text-xs text-gray-600 mb-2 block">Basic Colors</label>
                  <div className="grid grid-cols-6 gap-1">
                    {basicColors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-7 h-7 rounded border-2 transition-all hover:scale-110 ${
                          currentColor === color ? "border-gray-800 shadow-lg" : "border-gray-200"
                        } ${currentSessionStrokes >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => currentSessionStrokes < 5 && setCurrentColor(color)}
                        disabled={currentSessionStrokes >= 5}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Brush Size Slider */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">🖌️ Brush Size</h4>
                <div className="space-y-3">
                  {/* Size Preview */}
                  <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                    <div
                      className="rounded-full bg-gray-600"
                      style={{
                        width: `${Math.min(brushSize * 2, 32)}px`,
                        height: `${Math.min(brushSize * 2, 32)}px`,
                      }}
                    />
                  </div>

                  {/* Size Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Thin</span>
                      <span>Thick</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      disabled={currentSessionStrokes >= 5}
                    />
                    <div className="text-center text-xs text-gray-600">Size: {brushSize}px</div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Center - Main Game Area */}
          <div className="flex-1 max-w-2xl order-1 xl:order-2">
            <div className="relative">
              {/* Hidden original image for canvas drawing */}
              <img
                ref={elonImageRef}
                src="/elon-musk-cartoon.png"
                alt="Cartoon Elon Musk"
                className="hidden"
                crossOrigin="anonymous"
              />

              {/* Clickable composite image (Elon + drawings) */}
              {!showCanvas && (
                <img
                  src={compositeImageSrc || "/elon-musk-cartoon.png"}
                  alt="Cartoon Elon Musk"
                  className="w-full max-w-lg mx-auto block rounded-3xl shadow-2xl transition-transform hover:scale-105 cursor-pointer aspect-square"
                  style={{ maxWidth: "500px", maxHeight: "500px" }}
                  onClick={handleElonClick}
                />
              )}

              {/* Drawing Canvas */}
              {showCanvas && (
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={500}
                  className="w-full max-w-lg mx-auto block rounded-3xl shadow-2xl touch-none aspect-square cursor-none"
                  style={{ maxWidth: "500px", maxHeight: "500px" }}
                  onMouseDown={startDrawing}
                  onMouseMove={handleMouseMove}
                  onMouseUp={stopDrawing}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              )}

              {/* Custom Cursor Overlay */}
              {showCustomCursor && (
                <div
                  className="absolute pointer-events-none z-10"
                  style={{
                    left: cursorPosition.x,
                    top: cursorPosition.y,
                    width: brushSize * 2,
                    height: brushSize * 2,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Simple brush size circle */}
                  <div
                    className="absolute border-2 border-gray-800 rounded-full opacity-60"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: brushSize * 2,
                      height: brushSize * 2,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Session Progress & Actions */}
          {showCanvas && (
            <Card className="w-full xl:w-72 p-4 bg-white/80 backdrop-blur-sm order-3">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Session Info</h3>

              {/* Session Progress */}
              <div className="mb-6 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">Drawing Progress</div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-3 rounded ${i < currentSessionStrokes ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-600">{currentSessionStrokes}/5 strokes used</div>
                {currentSessionStrokes >= 5 && (
                  <div className="text-xs text-red-600 font-semibold mt-1">
                    Session complete! Returning to clicking...
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={undoLastStroke}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={currentSessionStrokes === 0}
                >
                  ↶ Undo Last Stroke
                </Button>
                <Button onClick={clearCanvas} variant="destructive" className="w-full">
                  🗑️ Clear All Drawings
                </Button>
              </div>

              {/* Next Round Preview */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-semibold text-blue-800 mb-1">Next Round</div>
                <div className="text-xs text-blue-600 mb-2">
                  Round {currentRound + 1}: {getRequiredClicks(currentRound + 1)} clicks required
                </div>
                <div className="text-xs text-gray-600">
                  Total Strokes: <strong>{allStrokes.length}</strong>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Game Progress */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-sm text-gray-600">
              🎯 Current Round: <strong>{currentRound}</strong>
            </span>
            <span className="text-sm text-gray-600">
              🖌️ Total Artwork: <strong>{allStrokes.length} strokes</strong>
            </span>
            <span className="text-sm text-gray-600">
              🚀 Next Goal: <strong>{getRequiredClicks(currentRound + 1)} clicks</strong>
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4F46E5;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4F46E5;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
