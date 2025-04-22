"use client"

import { getProject } from "@/app/actions/projects"
import { getStoriesByProject } from "@/app/actions/stories"
import { getTasksByStory } from "@/app/actions/tasks"
import { generateAndCreateGuidance } from "@/app/actions/guidance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface GenerateGuidancePageProps {
  params: {
    projectId: string
    taskId: string
  }
}

export default function GenerateGuidancePage({ params }: GenerateGuidancePageProps) {
  const { projectId, taskId } = params
  const [project, setProject] = useState<any>(null)
  const [story, setStory] = useState<any>(null)
  const [task, setTask] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project
        const projectData = await getProject(projectId)
        setProject(projectData)

        // Fetch stories
        const stories = await getStoriesByProject(projectId)

        // Find the story that contains the task
        let foundStory = null
        let foundTask = null

        for (const s of stories) {
          const tasks = await getTasksByStory(s.id)
          const t = tasks.find((t) => t.id === taskId)
          if (t) {
            foundStory = s
            foundTask = t
            break
          }
        }

        if (!foundStory || !foundTask) {
          toast({
            title: "Error",
            description: "Task or story not found",
            variant: "destructive",
          })
          router.push(`/guidance/${projectId}`)
          return
        }

        setStory(foundStory)
        setTask(foundTask)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [projectId, taskId, toast, router])

  const handleGenerateGuidance = async () => {
    if (!project || !story || !task) return

    setIsGenerating(true)

    try {
      await generateAndCreateGuidance(
        taskId,
        project.title,
        story.as_a,
        story.i_want_to,
        story.so_that,
        task.description,
      )

      toast({
        title: "Success",
        description: "Implementation guidance has been generated",
      })

      router.push(`/guidance/${projectId}/task/${taskId}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate guidance. Please try again.",
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
            <Link href={`/guidance/${projectId}`}>Back to Guidance</Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Generate Implementation Guidance</h1>
          <p className="text-muted-foreground">Get step-by-step instructions for implementing this task</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project: {project.title}</CardTitle>
            <CardDescription>User Story: {story.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">User Story</h3>
              <p className="mt-1">
                <span className="font-medium">As a</span> {story.as_a}, <span className="font-medium">I want to</span>{" "}
                {story.i_want_to}, <span className="font-medium">so that</span> {story.so_that}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Task</h3>
              <p className="mt-1 font-medium">{task.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Click the button below to generate step-by-step implementation guidance for this task. The AI will analyze
              the task and provide detailed instructions and code examples.
            </p>
            <div className="flex flex-col items-center gap-2">
              <Button onClick={handleGenerateGuidance} disabled={isGenerating} size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Guidance...
                  </>
                ) : (
                  "Generate Implementation Guidance"
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This may take up to 30 seconds as we create detailed guidance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
