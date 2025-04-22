"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Story, Task } from "@/lib/types"
import { CheckCircle2, Circle, FileText, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface TaskGuidanceListProps {
  tasks: Task[]
  projectId: string
  story: Story
}

export function TaskGuidanceList({ tasks, projectId, story }: TaskGuidanceListProps) {
  const [expandedStory, setExpandedStory] = useState<string | null>(null)

  const toggleStory = (storyId: string) => {
    if (expandedStory === storyId) {
      setExpandedStory(null)
    } else {
      setExpandedStory(storyId)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                <div className="mt-0.5 text-muted-foreground">
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.description}</h3>
                  </div>
                  {task.rationale && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.rationale}</p>
                  )}
                </div>
                <div className="ml-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/guidance/${projectId}/task/${task.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Guidance
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No tasks found for this story.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-4">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/tasks/${projectId}/story/${story.id}/generate`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate More Tasks
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
