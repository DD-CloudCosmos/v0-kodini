"use client"

import { getStoriesByProject } from "@/app/actions/stories"
import { deleteTask, getTasksByStory, updateTask } from "@/app/actions/tasks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown, Edit, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface EditTasksPageProps {
  params: {
    projectId: string
    storyId: string
  }
}

export default function EditTasksPage({ params }: EditTasksPageProps) {
  const { projectId, storyId } = params
  const [story, setStory] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [taskDescription, setTaskDescription] = useState("")
  const [taskRationale, setTaskRationale] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
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

        const storyTasks = await getTasksByStory(storyId)
        setTasks(storyTasks)
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
  }, [projectId, storyId, toast, router])

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setTaskDescription(task.description)
    setTaskRationale(task.rationale || "")
  }

  const handleUpdateTask = async () => {
    if (!editingTask || !taskDescription) return

    setIsUpdating(true)

    try {
      const updatedTask = await updateTask(editingTask.id, taskDescription, taskRationale || undefined)

      // Update the local state
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === editingTask.id ? updatedTask : task)))

      setEditingTask(null)

      toast({
        title: "Success",
        description: "Task has been updated",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    setIsDeleting(true)

    try {
      await deleteTask(taskId)

      // Update the local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))

      toast({
        title: "Success",
        description: "Task has been deleted",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
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
          <h1 className="text-3xl font-bold">Edit Tasks</h1>
          <p className="text-muted-foreground">Manage development tasks for this user story</p>
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

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Button asChild>
            <Link href={`/tasks/${projectId}/story/${storyId}/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-4 mb-6">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{task.description}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {task.rationale && (
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="mr-1 h-4 w-4" />
                        Why is this task necessary?
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                        <p>{task.rationale}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mb-6">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                No tasks yet. Add tasks manually or generate them automatically.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href={`/tasks/${projectId}/story/${storyId}/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/tasks/${projectId}/story/${storyId}/generate`}>Generate Tasks</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the task details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-description">Task Description</Label>
                <Input
                  id="edit-description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe what needs to be done"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rationale">Why is this task necessary? (Optional)</Label>
                <Textarea
                  id="edit-rationale"
                  value={taskRationale}
                  onChange={(e) => setTaskRationale(e.target.value)}
                  placeholder="Explain why this task is important"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
