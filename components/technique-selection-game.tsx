"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ClientScenario {
  id: string
  title: string
  description: string
  image: string
  correctTechnique: "microblading" | "microshading"
  explanation: string
}

interface DropResult {
  correct: boolean
  explanation: string
}

const clientScenarios: ClientScenario[] = [
  {
    id: "oily-skin",
    title: "Peau grasse",
    description: "Client avec peau grasse et brillante",
    image: "/images/oily-skin.png",
    correctTechnique: "microshading",
    explanation: "Correct! Le microshading tient mieux sur peau grasse car les traits du microblading peuvent baver.",
  },
  {
    id: "dry-skin",
    title: "Peau sèche",
    description: "Client avec peau sèche et texture visible",
    image: "/images/dry-skin-texture.png",
    correctTechnique: "microblading",
    explanation: "Exact! Le microblading fonctionne bien sur peau sèche et crée des traits nets et précis.",
  },
  {
    id: "sparse-eyebrows",
    title: "Sourcils très clairsemés",
    description: "Client avec sourcils très fins et clairsemés",
    image: "/images/sparse-eyebrows.png",
    correctTechnique: "microshading",
    explanation: "Parfait! Le microshading donne plus de densité et couvre mieux les zones clairsemées.",
  },
  {
    id: "natural-look",
    title: "Veut un look naturel",
    description: "Client qui souhaite un résultat très naturel",
    image: "/images/natural-full-eyebrows.png",
    correctTechnique: "microblading",
    explanation: "Correct! Le microblading imite parfaitement les poils naturels pour un effet très réaliste.",
  },
  {
    id: "makeup-look",
    title: "Veut un look maquillé",
    description: "Client qui préfère un effet maquillé",
    image: "/images/over-plucked-eyebrows.png",
    correctTechnique: "microshading",
    explanation: "Exact! Le microshading donne un effet poudré comme un maquillage permanent.",
  },
  {
    id: "sensitive-skin",
    title: "Peau sensible",
    description: "Client avec peau sensible et réactive",
    image: "/images/dry-skin-texture.png",
    correctTechnique: "microshading",
    explanation: "Parfait! Le microshading est moins traumatisant car il nécessite moins de passages.",
  },
]

export default function TechniqueSelectionGame() {
  const [score, setScore] = useState(0)
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set())
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<DropResult | null>(null)
  const [showGuide, setShowGuide] = useState(false)

  const handleDragStart = (scenarioId: string) => {
    setDraggedItem(scenarioId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, technique: "microblading" | "microshading") => {
    e.preventDefault()

    if (!draggedItem) return

    const scenario = clientScenarios.find((s) => s.id === draggedItem)
    if (!scenario) return

    const isCorrect = scenario.correctTechnique === technique

    if (isCorrect && !completedScenarios.has(draggedItem)) {
      setScore((prev) => prev + 1)
      setCompletedScenarios((prev) => new Set([...prev, draggedItem]))
    }

    setFeedback({
      correct: isCorrect,
      explanation: isCorrect
        ? scenario.explanation
        : `Erreur! ${scenario.title} nécessite ${scenario.correctTechnique === "microblading" ? "le microblading" : "le microshading"}.`,
    })

    setDraggedItem(null)

    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(null), 3000)
  }

  const resetGame = () => {
    setScore(0)
    setCompletedScenarios(new Set())
    setFeedback(null)
    setDraggedItem(null)
  }

  const isGameComplete = completedScenarios.size === clientScenarios.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-2">
            Choisir la Bonne Technique - Mini Game
          </h1>
          <p className="text-purple-700 mb-4">Glissez-déposez la technique appropriée selon le type de client</p>

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
                    <DialogTitle className="text-purple-900 text-base sm:text-lg">Guide des Techniques</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto space-y-4 text-sm">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3 text-lg">🖋️ Microblading</h3>
                      <div className="space-y-2 text-purple-800">
                        <div>
                          <p className="font-medium">• Traits fins imitant les poils naturels</p>
                          <p className="text-xs text-purple-600 ml-4">→ "On dessine poil par poil"</p>
                        </div>
                        <div>
                          <p className="font-medium">• Idéal pour peau sèche à normale</p>
                          <p className="text-xs text-purple-600 ml-4">→ "La peau grasse fait baver les traits"</p>
                        </div>
                        <div>
                          <p className="font-medium">• Effet très naturel</p>
                          <p className="text-xs text-purple-600 ml-4">
                            → "Impossible de voir que c'est tatoué de loin"
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">• Parfait pour combler les zones clairsemées</p>
                          <p className="text-xs text-purple-600 ml-4">→ "Remplit les trous avec de faux poils"</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-purple-200">
                          <p className="text-xs">
                            <strong>Durée:</strong> 12-18 mois
                          </p>
                          <p className="text-xs">
                            <strong>Cicatrisation:</strong> 7-14 jours
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3 text-lg">🎨 Microshading</h3>
                      <div className="space-y-2 text-purple-800">
                        <div>
                          <p className="font-medium">• Effet poudré et ombré</p>
                          <p className="text-xs text-purple-600 ml-4">→ "Comme appliquer de la poudre à sourcils"</p>
                        </div>
                        <div>
                          <p className="font-medium">• Idéal pour peau grasse</p>
                          <p className="text-xs text-purple-600 ml-4">
                            → "Les petits points tiennent mieux que les traits"
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">• Look maquillé permanent</p>
                          <p className="text-xs text-purple-600 ml-4">→ "Sourcils toujours maquillés même au réveil"</p>
                        </div>
                        <div>
                          <p className="font-medium">• Moins traumatisant</p>
                          <p className="text-xs text-purple-600 ml-4">→ "Points moins profonds que traits longs"</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-pink-200">
                          <p className="text-xs">
                            <strong>Durée:</strong> 18-24 mois
                          </p>
                          <p className="text-xs">
                            <strong>Cicatrisation:</strong> 5-10 jours
                          </p>
                        </div>
                      </div>
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

        {/* Game Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client Scenarios */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">Scénarios Clients</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clientScenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`cursor-move transition-all duration-200 hover:shadow-lg ${
                    completedScenarios.has(scenario.id) ? "bg-green-50 border-green-200" : "bg-white hover:bg-purple-50"
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(scenario.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <Image
                          src={scenario.image || "/placeholder.svg"}
                          alt={scenario.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-900 mb-1">{scenario.title}</h3>
                        <p className="text-sm text-purple-600 line-clamp-2">{scenario.description}</p>
                        {completedScenarios.has(scenario.id) && (
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
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-purple-900">Techniques</h2>

            {/* Microblading Drop Zone */}
            <div
              className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center transition-colors hover:border-purple-400 hover:bg-purple-50 min-h-[120px] flex flex-col justify-center"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "microblading")}
            >
              <h3 className="font-semibold text-purple-900 mb-1">Microblading</h3>
              <p className="text-sm text-purple-600">Traits fins et naturels</p>
            </div>

            {/* Microshading Drop Zone */}
            <div
              className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center transition-colors hover:border-pink-400 hover:bg-pink-50 min-h-[120px] flex flex-col justify-center"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "microshading")}
            >
              <h3 className="font-semibold text-purple-900 mb-1">Microshading</h3>
              <p className="text-sm text-purple-600">Effet poudré et ombré</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
