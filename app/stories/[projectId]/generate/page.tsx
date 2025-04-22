"use client"

import { getProject } from "@/app/actions/projects"
import { createStory } from "@/app/actions/stories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { ChevronDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod"

interface GenerateStoriesPageProps {
  params: {
    projectId: string
  }
}

// Schema for user stories
const UserStorySchema = z.object({
  title: z.string(),
  asA: z.string(),
  iWantTo: z.string(),
  soThat: z.string(),
  rationale: z.string(),
})

export type UserStory = z.infer<typeof UserStorySchema>

const UserStoriesResponseSchema = z.object({
  stories: z.array(UserStorySchema),
})

export default function GenerateStoriesPage({ params }: GenerateStoriesPageProps) {
  const { projectId } = params
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedStories, setGeneratedStories] = useState<UserStory[]>([])
  const [selectedStories, setSelectedStories] = useState<Record<number, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProject(projectId)
        setProject(projectData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch project details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId, toast])

  const generateStories = async () => {
    if (!project) return

    setIsGenerating(true)

    try {
      const prompt = `
You are an expert software development advisor helping a novice developer create user stories for their project.

Project idea:
"""
${project.idea_text}
"""

Please generate 5 well-structured user stories following the "As a [role], I want to [action], so that [benefit]" format.
For each user story:
1. Create a concise title
2. Specify the user role (as a...)
3. Describe what they want to do (I want to...)
4. Explain the benefit (so that...)
5. Include a brief rationale explaining why this story is important for the project

Format your response as valid JSON with the following structure:
{
  "stories": [
    {
      "title": "string",
      "asA": "string",
      "iWantTo": "string",
      "soThat": "string",
      "rationale": "string"
    },
    ...
  ]
}

Ensure the stories are specific, valuable, and cover different aspects of the application.
`

      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt,
        temperature: 0.7,
        maxTokens: 1500,
      })

      // Parse and validate the response
      const jsonResponse = JSON.parse(text)
      const validatedResponse = UserStoriesResponseSchema.parse(jsonResponse)

      setGeneratedStories(validatedResponse.stories)

      // Initialize all stories as selected
      const initialSelection: Record<number, boolean> = {}
      validatedResponse.stories.forEach((_, index) => {
        initialSelection[index] = true
      })
      setSelectedStories(initialSelection)
    } catch (error: any) {
      console.error("Error generating stories:", error)
      toast({
        title: "Error",
        description: "Failed to generate user stories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleStorySelection = (index: number) => {
    setSelectedStories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const saveSelectedStories = async () => {
    const storiesToSave = generatedStories.filter((_, index) => selectedStories[index])

    if (storiesToSave.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one user story to save.",
      })
      return
    }

    setIsSaving(true)

    try {
      // Save each selected story
      for (const story of storiesToSave) {
        await createStory(projectId, story.title, story.asA, story.iWantTo, story.soThat, story.rationale)
      }

      toast({
        title: "Success",
        description: `${storiesToSave.length} user stories have been saved.`,
      })

      router.push(`/stories/${projectId}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user stories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href={`/stories/${projectId}`}>Back to User Stories</Link>
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Generate User Stories</h1>
          <p className="text-muted-foreground">Create user stories based on your project idea</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Idea</CardTitle>
            <CardDescription>{project.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{project.idea_text}</p>
          </CardContent>
        </Card>

        {!generatedStories.length ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Click the button below to generate user stories based on your project idea.
              </p>
              <Button onClick={generateStories} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate User Stories"
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Generated User Stories</h2>
              <Button onClick={generateStories} variant="outline" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate"
                )}
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              {generatedStories.map((story, index) => (
                <Card key={index} className={selectedStories[index] ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedStories[index]}
                          onCheckedChange={() => toggleStorySelection(index)}
                          id={`story-${index}`}
                        />
                        <div>
                          <CardTitle className="text-lg">{story.title}</CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <span className="font-medium">As a</span> {story.asA},{" "}
                      <span className="font-medium">I want to</span> {story.iWantTo},{" "}
                      <span className="font-medium">so that</span> {story.soThat}
                    </p>

                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="mr-1 h-4 w-4" />
                        Why is this important?
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                        <p>{story.rationale}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href={`/stories/${projectId}`}>Cancel</Link>
              </Button>
              <Button onClick={saveSelectedStories} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Selected Stories"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
