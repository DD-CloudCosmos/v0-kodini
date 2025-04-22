"use client"

import { refineProjectIdea, suggestProjectVariations, updateProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import type { RefinedIdea } from "@/lib/ai-orchestration"
import { ArrowRight, Loader2, RefreshCw, Sparkles } from "lucide-react"
import { useState } from "react"

interface IdeaRefinementSectionProps {
  projectId: string
  ideaText: string
}

export function IdeaRefinementSection({ projectId, ideaText }: IdeaRefinementSectionProps) {
  const [refinedIdeas, setRefinedIdeas] = useState<RefinedIdea[]>([])
  const [variations, setVariations] = useState<RefinedIdea[]>([])
  const [isRefining, setIsRefining] = useState(false)
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<RefinedIdea | null>(null)
  const { toast } = useToast()

  const handleRefineIdea = async () => {
    setIsRefining(true)
    try {
      const response = await refineProjectIdea(ideaText)
      setRefinedIdeas(response.ideas)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to refine idea. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefining(false)
    }
  }

  const handleGenerateVariations = async () => {
    setIsGeneratingVariations(true)
    try {
      const response = await suggestProjectVariations(ideaText)
      setVariations(response.ideas)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate variations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingVariations(false)
    }
  }

  const handleSelectIdea = (idea: RefinedIdea) => {
    setSelectedIdea(idea)
  }

  const handleApplySelectedIdea = async () => {
    if (!selectedIdea) return

    try {
      await updateProject(projectId, selectedIdea.title, selectedIdea.description)
      toast({
        title: "Success",
        description: "Project updated with the selected idea.",
      })
      // Reload the page to show the updated project
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update project. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="refine" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="refine">Refine Idea</TabsTrigger>
        <TabsTrigger value="variations">Explore Variations</TabsTrigger>
      </TabsList>

      <TabsContent value="refine" className="mt-6">
        <div className="mb-4 flex justify-end">
          <Button onClick={handleRefineIdea} disabled={isRefining}>
            {isRefining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refining...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refine Idea
              </>
            )}
          </Button>
        </div>

        {refinedIdeas.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {refinedIdeas.map((idea, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  selectedIdea === idea ? "ring-2 ring-primary" : "hover:shadow-md"
                }`}
                onClick={() => handleSelectIdea(idea)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <CardDescription>
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="mr-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-4">{idea.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Click the "Refine Idea" button to get AI-powered suggestions to improve your project idea.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedIdea && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleApplySelectedIdea}>
              Apply Selected Idea
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="variations" className="mt-6">
        <div className="mb-4 flex justify-end">
          <Button onClick={handleGenerateVariations} disabled={isGeneratingVariations}>
            {isGeneratingVariations ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Variations
              </>
            )}
          </Button>
        </div>

        {variations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {variations.map((idea, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  selectedIdea === idea ? "ring-2 ring-primary" : "hover:shadow-md"
                }`}
                onClick={() => handleSelectIdea(idea)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <CardDescription>
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="mr-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-4">{idea.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Click the "Generate Variations" button to explore different approaches to your project idea.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedIdea && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleApplySelectedIdea}>
              Apply Selected Variation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
