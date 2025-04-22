"use client"

import { getStoriesByProject } from "@/app/actions/stories"
import { generateAndCreateTasks } from "@/app/actions/tasks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { TaskType } from "@/lib/ai-orchestration"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface GenerateTasksPageProps {
  params: {
    projectId: string
    storyId: string
  }
}

export default function GenerateTasksPage({ params }: GenerateTasksPageProps) {
  const { projectId, storyId } = params
  const [story, setStory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState<TaskType[]>([])
  const [selectedTasks, setSelectedTasks] = useState<Record<number, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const stories = await getStoriesByProject(projectId)
        const currentStory = stories.find((s) => s.id === storyId)

        if (!currentStory) {
          toast({
            title: "Error",
            description: "Story not found",
            variant: "destructive",
          })
          router.push(`/tasks/${projectId}`)
          return
        }

        setStory(currentStory)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch story details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStory()
  }, [projectId, storyId, toast, router])

  const handleGenerateTasks = async () => {
    if (!story) return

    setIsGenerating(true)

    try {
      const tasks = await generateAndCreateTasks(storyId, story.title, story.as_a, story.i_want_to, story.so_that)

      setGeneratedTasks(tasks)

      toast({
        title: "Success",
        description: `${tasks.length} tasks have been generated and saved.`,
      })

      // Redirect back to the tasks page
      router.push(`/tasks/${projectId}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate tasks. Please try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href={`/tasks/${projectId}`}>Back to Tasks</Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Generate Tasks</h1>
          <p className="text-muted-foreground">Create development tasks for this user story</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{story.title}</CardTitle>
            <CardDescription>User Story</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              <span className="font-medium">As a</span> {story.as_a}, <span className="font-medium">I want to</span>{" "}
              {story.i_want_to}, <span className="font-medium">so that</span> {story.so_that}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Click the button below to generate development tasks for this user story. The AI will analyze the user
              story and create specific, actionable tasks.
            </p>
            <Button onClick={handleGenerateTasks} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Tasks...
                </>
              ) : (
                "Generate Tasks"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
