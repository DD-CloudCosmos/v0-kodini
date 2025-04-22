"use client"

import type React from "react"

import { getStoriesByProject } from "@/app/actions/stories"
import { createTask } from "@/app/actions/tasks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface NewTaskPageProps {
  params: {
    projectId: string
    storyId: string
  }
}

export default function NewTaskPage({ params }: NewTaskPageProps) {
  const { projectId, storyId } = params
  const [story, setStory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [description, setDescription] = useState("")
  const [rationale, setRationale] = useState("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description) {
      toast({
        title: "Error",
        description: "Please provide a task description",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      await createTask(storyId, description, rationale || undefined)

      toast({
        title: "Success",
        description: "Task has been created",
      })

      router.push(`/tasks/${projectId}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task. Please try again.",
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href={`/tasks/${projectId}`}>Back to Tasks</Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Task</h1>
          <p className="text-muted-foreground">Create a new development task for this user story</p>
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

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Provide a clear, specific description of what needs to be done</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Task Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Create database schema for users table"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rationale">Why is this task necessary? (Optional)</Label>
                <Textarea
                  id="rationale"
                  placeholder="Explain why this task is important for implementing the user story..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href={`/tasks/${projectId}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
