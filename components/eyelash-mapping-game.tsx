"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface EyeShape {
  id: string
  title: string
  description: string
  image: string
  correctMapping: "oeil-de-poupee" | "naturel" | "oeil-de-biche" | "oeil-ouvert" | "oeil-de-chaton"
  explanation: string
}

interface DropResult {
  correct: boolean
  explanation: string
}

const eyeShapes: EyeShape[] = [
  {
    id: "yeux-tombants",
    title: "Yeux tombants",
    description: "Paupière supérieure qui descend vers l'extérieur",
    image: "/images/yeux-tombants.png",
    correctMapping: "oeil-de-biche",
    explanation: "Correct! L'œil de biche avec ses longueurs croissantes vers l'extérieur corrige l'effet tombant.",
  },
  {
    id: "yeux-ronds",
    title: "Yeux ronds",
    description: "Forme d'œil naturellement arrondie",
    image: "/images/yeux-ronds.png",
    correctMapping: "naturel",
    explanation: "Exact! Le mapping naturel sublime la belle forme ronde sans la dénaturer.",
  },
  {
    id: "yeux-enfonces",
    title: "Yeux enfoncés",
    description: "Yeux qui paraissent reculés dans l'orbite",
    image: "/images/yeux-enfonces.png",
    correctMapping: "oeil-ouvert",
    explanation: "Parfait! L'œil ouvert avec son emphase au centre fait ressortir les yeux enfoncés.",
  },
  {
    id: "yeux-ecartes",
    title: "Yeux écartés",
    description: "Distance importante entre les deux yeux",
    image: "/images/yeux-ecartes.png",
    correctMapping: "oeil-de-poupee",
    explanation: "Correct! L'œil de poupée concentre l'attention au centre et rapproche visuellement les yeux.",
  },
  {
    id: "yeux-rapproches",
    title: "Yeux rapprochés",
    description: "Faible distance entre les deux yeux",
    image: "/images/yeux-rapproches.png",
    correctMapping: "oeil-de-biche",
    explanation: "Exact! L'œil de biche étire le regard vers l'extérieur et écarte visuellement les yeux.",
  },
  {
    id: "yeux-petits",
    title: "Yeux petits",
    description: "Yeux de petite taille qui manquent d'intensité",
    image: "/images/yeux-petits.png",
    correctMapping: "oeil-de-chaton",
    explanation: "Parfait! L'œil de chaton donne un lifting subtil qui agrandit délicatement les petits yeux.",
  },
]

const mappingStyles = [
  {
    id: "oeil-de-poupee",
    title: "Œil de poupée",
    description: "Cils longs au centre, effet regard innocent",
    image: "/images/oeil-de-poupee.png",
  },
  {
    id: "naturel",
    title: "Naturel",
    description: "Répartition uniforme, sublime la forme naturelle",
    image: "/images/naturel.png",
  },
  {
    id: "oeil-de-biche",
    title: "Œil de biche",
    description: "Longueurs croissantes vers l'extérieur, effet allongé",
    image: "/images/oeil-de-biche.png",
  },
  {
    id: "oeil-ouvert",
    title: "Œil ouvert",
    description: "Emphase au centre, agrandit les petits yeux",
    image: "/images/oeil-ouvert.png",
  },
  {
    id: "oeil-de-chaton",
    title: "Œil de chaton",
    description: "Version douce de l'œil de biche, léger lifting",
    image: "/images/oeil-de-chaton.png",
  },
]

export default function EyelashMappingGame() {
  const [score, setScore] = useState(0)
  const [completedShapes, setCompletedShapes] = useState<Set<string>>(new Set())
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<DropResult | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null)

  const handleDragStart = (shapeId: string) => {
    setDraggedItem(shapeId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, mappingId: string) => {
    e.preventDefault()

    if (!draggedItem) return

    const eyeShape = eyeShapes.find((s) => s.id === draggedItem)
    if (!eyeShape) return

    const isCorrect = eyeShape.correctMapping === mappingId

    if (isCorrect && !completedShapes.has(draggedItem)) {
      setScore((prev) => prev + 1)
      setCompletedShapes((prev) => new Set([...prev, draggedItem]))
    }

    setFeedback({
      correct: isCorrect,
      explanation: isCorrect
        ? eyeShape.explanation
        : `Erreur! ${eyeShape.title} nécessite ${mappingStyles.find((m) => m.id === eyeShape.correctMapping)?.title}.`,
    })

    setDraggedItem(null)

    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(null), 3000)
  }

  const resetGame = () => {
    setScore(0)
    setCompletedShapes(new Set())
    setFeedback(null)
    setDraggedItem(null)
    setZoomedImage(null)
  }

  const isGameComplete = completedShapes.size === eyeShapes.length

  const handleImageClick = (imageSrc: string, imageAlt: string) => {
    setZoomedImage({ src: imageSrc, alt: imageAlt })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-2">
            Cartographie des Cils - Choisir le Bon Mapping
          </h1>
          <p className="text-purple-700 mb-4">Glissez-déposez la technique appropriée selon la morphologie de l'œil</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Badge className="text-lg px-4 py-2 bg-purple-200 text-purple-800 hover:bg-purple-200">
              Score: {score}/6
            </Badge>

            <div className="flex gap-2">
              <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">GUIDE</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl mx-2 sm:mx-4 max-h-[85vh] sm:max-h-[90vh] flex flex-col fixed top-96 left-1/2 transform -translate-x-1/2">
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-purple-900 text-base sm:text-lg">
                      Guide du Mapping des Cils
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto space-y-4 text-sm">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3 text-lg">Œil de poupée</h3>
                      <div className="space-y-2 text-purple-800">
                        <p className="font-medium">Centre long, coins courts = agrandit les petits yeux</p>
                        <p className="text-xs text-purple-600">Règle: 12mm centre, 9mm coins</p>
                        <div className="mt-3 pt-2 border-t border-purple-200">
                          <p className="text-xs">
                            <strong>Durée:</strong> 4-6 semaines
                          </p>
                          <p className="text-xs">
                            <strong>Temps de pose:</strong> 2-3 heures
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3 text-lg">Naturel</h3>
                      <div className="space-y-2 text-purple-800">
                        <p className="font-medium">Longueurs uniformes = suit la forme naturelle</p>
                        <p className="text-xs text-purple-600">Règle: même courbure partout</p>
                        <div className="mt-3 pt-2 border-t border-pink-200">
                          <p className="text-xs">
                            <strong>Durée:</strong> 4-6 semaines
                          </p>
                          <p className="text-xs">
                            <strong>Temps de pose:</strong> 2-2.5 heures
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3 text-lg">Œil de biche</h3>
                      <div className="space-y-2 text-purple-800">
                        <p className="font-medium">Court → long vers l'extérieur = corrige yeux tombants</p>
                        <p className="text-xs text-purple-600">Règle: 9mm intérieur, 14mm extérieur</p>
                        <div className="mt-3 pt-2 border-t border-purple-200">
                          <p className="text-xs">
                            <strong>Durée:</strong> 4-6 semaines
                          </p>
                          <p className="text-xs">
                            <strong>Temps de pose:</strong> 2.5-3 heures
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3 text-lg">Œil ouvert</h3>
                      <div className="space-y-2 text-purple-800">
                        <p className="font-medium">Pic au centre = ouvre les yeux enfoncés</p>
                        <p className="text-xs text-purple-600">Règle: 12mm milieu, 10mm coins</p>
                        <div className="mt-3 pt-2 border-t border-pink-200">
                          <p className="text-xs">
                            <strong>Durée:</strong> 4-6 semaines
                          </p>
                          <p className="text-xs">
                            <strong>Temps de pose:</strong> 2-3 heures
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3 text-lg">Œil de chaton</h3>
                      <div className="space-y-2 text-purple-800">
                        <p className="font-medium">Biche version douce = lifting subtil</p>
                        <p className="text-xs text-purple-600">Règle: progression moins marquée</p>
                        <div className="mt-3 pt-2 border-t border-purple-200">
                          <p className="text-xs">
                            <strong>Durée:</strong> 4-6 semaines
                          </p>
                          <p className="text-xs">
                            <strong>Temps de pose:</strong> 2.5-3 heures
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg mt-4">
                      <p className="text-sm font-medium text-purple-900">
                        <strong>Mémo:</strong> Centre = agrandit / Extérieur = allonge / Uniforme = naturel
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={resetGame}
                variant="outline"
                className="border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent"
              >
                Recommencer
              </Button>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded-lg shadow-lg max-w-md mx-auto text-center ${
              feedback.correct
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <p className="font-medium">{feedback.explanation}</p>
          </div>
        )}

        {/* Game Complete */}
        {isGameComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">🎉 Félicitations!</h2>
              <p className="text-purple-700 mb-4">Vous avez terminé le jeu avec un score parfait de 6/6!</p>
              <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
                Rejouer
              </Button>
            </div>
          </div>
        )}

        {/* Zoom Modal */}
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-2">
            <DialogHeader>
              <DialogTitle className="text-center text-purple-900">{zoomedImage?.alt}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              {zoomedImage && (
                <div className="relative w-full max-w-2xl aspect-square">
                  <Image
                    src={zoomedImage.src || "/placeholder.svg"}
                    alt={zoomedImage.alt}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Game Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Eye Shapes */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">Morphologies d'Yeux</h2>
            <p className="text-purple-600 mb-6 text-sm">
              Glissez chaque morphologie d'œil vers la technique de mapping que vous pensez être la plus appropriée
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eyeShapes.map((shape) => (
                <Card
                  key={shape.id}
                  className={`cursor-move transition-all duration-200 hover:shadow-lg ${
                    completedShapes.has(shape.id) ? "bg-green-50 border-green-200" : "bg-white hover:bg-purple-50"
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(shape.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="relative w-40 h-40 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(shape.image || "/placeholder.svg", shape.title)}
                      >
                        <Image
                          src={shape.image || "/placeholder.svg"}
                          alt={shape.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-900 mb-1">{shape.title}</h3>
                        <p className="text-sm text-purple-600">{shape.description}</p>
                        {completedShapes.has(shape.id) && (
                          <Badge className="mt-2 bg-green-100 text-green-800">✓ Complété</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-900">Styles de Mapping</h2>
            <p className="text-purple-600 mb-4 text-sm">Cliquez sur les images pour les agrandir et voir les détails</p>

            {mappingStyles.map((style) => (
              <div
                key={style.id}
                className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center transition-colors hover:border-purple-400 hover:bg-purple-50 min-h-[100px] flex flex-col justify-center"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, style.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="relative w-16 h-16 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick(style.image || "/placeholder.svg", style.title)}
                  >
                    <Image
                      src={style.image || "/placeholder.svg"}
                      alt={style.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-purple-900 mb-1">{style.title}</h3>
                    <p className="text-xs text-purple-600">{style.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
