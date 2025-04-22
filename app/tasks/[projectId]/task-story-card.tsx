"use client"

import { toggleTaskCompletion } from "@/app/actions/tasks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown, Edit, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface TaskStoryCardProps {
  story: any
  projectId: string
}

export function TaskStoryCard({ story, projectId }: TaskStoryCardProps) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState(story.tasks || [])
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})

  const handleToggleCompletion = async (taskId: string, currentStatus: boolean) => {
    setIsUpdating((prev) => ({ ...prev, [taskId]: true }))

    try {
      const updatedTask = await toggleTaskCompletion(taskId, !currentStatus)

      // Update the local state
      setTasks((prevTasks: any[]) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, is_completed: !currentStatus } : task)),
      )
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating((prev) => ({ ...prev, [taskId]: false }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{story.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              As a {story.as_a}, I want to {story.i_want_to}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/tasks/${projectId}/story/${story.id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Tasks</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {tasks && tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task: any) => (
              <div key={task.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.is_completed}
                  onCheckedChange={() => handleToggleCompletion(task.id, task.is_completed)}
                  disabled={isUpdating[task.id]}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      task.is_completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.description}
                  </label>

                  {task.rationale && (
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center text-xs text-muted-foreground hover:text-foreground">
                        <ChevronDown className="mr-1 h-3 w-3" />
                        Why?
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 rounded-md bg-muted p-2 text-xs">
                        <p>{task.rationale}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">No tasks yet</p>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks/${projectId}/story/${story.id}/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks/${projectId}/story/${story.id}/generate`}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Tasks
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
