"use client"

import { getTask } from "@/app/actions/tasks"
import { getStory } from "@/app/actions/stories"
import { getProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Lightbulb } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { generateGuidanceAction } from "./actions"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface GenerateGuidancePageProps {
  params: {
    projectId: string
    taskId: string
  }
}

export default function GenerateGuidancePage({ params }: GenerateGuidancePageProps) {
  const { projectId, taskId } = params
  const [task, setTask] = useState<any>(null)
  const [story, setStory] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskData = await getTask(taskId)
        if (!taskData) {
          throw new Error("Task not found")
        }
        setTask(taskData)

        const storyData = await getStory(taskData.story_id)
        if (!storyData) {
          throw new Error("Story not found")
        }
        setStory(storyData)

        const projectData = await getProject(projectId)
        if (!projectData) {
          throw new Error("Project not found")
        }
        setProject(projectData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [projectId, taskId, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!task || !story || !project) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href={`/guidance/${projectId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guidance
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Generate Implementation Guidance</h1>
          <p className="text-muted-foreground">Get step-by-step instructions for implementing this task</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Task: {task.description}</CardTitle>
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

            {task.rationale && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Task Rationale</h3>
                <p className="mt-1">{task.rationale}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-8 text-center">
            <Lightbulb className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Click the button below to generate step-by-step implementation guidance for this task. The AI will analyze
              the task and provide detailed instructions and code examples.
            </p>
            <form action={generateGuidanceAction}>
              <input type="hidden" name="taskId" value={taskId} />
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="storyId" value={story.id} />
              <Button type="submit" size="lg">
                Generate Implementation Guidance
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              This may take up to 30 seconds as we create detailed guidance.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
