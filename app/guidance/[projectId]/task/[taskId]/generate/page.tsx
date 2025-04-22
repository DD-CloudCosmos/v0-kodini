"use client"

import { getTask } from "@/app/actions/tasks"
import { generateGuidanceAction } from "@/app/actions/generate-guidance-action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"
import { Suspense } from "react"

interface GenerateGuidancePageProps {
  params: {
    projectId: string
    taskId: string
  }
}

export default async function GenerateGuidancePage({ params }: GenerateGuidancePageProps) {
  const { projectId, taskId } = params

  const task = await getTask(taskId)
  if (!task) {
    redirect(`/guidance/${projectId}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Generate Implementation Guidance</CardTitle>
            <CardDescription>We'll use AI to generate step-by-step guidance for implementing this task</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Task:</h3>
                <p className="mt-1">{task.description}</p>
              </div>
              {task.rationale && (
                <div>
                  <h3 className="font-medium">Rationale:</h3>
                  <p className="mt-1 text-muted-foreground">{task.rationale}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Suspense
              fallback={
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </Button>
              }
            >
              <form action={generateGuidanceAction}>
                <input type="hidden" name="taskId" value={taskId} />
                <input type="hidden" name="projectId" value={projectId} />
                <Button type="submit">Generate Guidance</Button>
              </form>
            </Suspense>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
