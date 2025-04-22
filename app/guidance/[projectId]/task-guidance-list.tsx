"use client"

import { getGuidanceByTask } from "@/app/actions/guidance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, ChevronRight, Lightbulb, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface TaskGuidanceListProps {
  tasks: any[]
  projectId: string
  story: any
}

export function TaskGuidanceList({ tasks, projectId, story }: TaskGuidanceListProps) {
  const { toast } = useToast()
  const [guidanceStatus, setGuidanceStatus] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const checkGuidanceStatus = async () => {
      const statusMap: Record<string, boolean> = {}
      const loadingMap: Record<string, boolean> = {}

      for (const task of tasks) {
        loadingMap[task.id] = true
        setIsLoading(loadingMap)

        try {
          const guidance = await getGuidanceByTask(task.id)
          statusMap[task.id] = !!guidance
        } catch (error) {
          statusMap[task.id] = false
        } finally {
          loadingMap[task.id] = false
          setIsLoading({ ...loadingMap })
        }
      }

      setGuidanceStatus(statusMap)
    }

    if (tasks.length > 0) {
      checkGuidanceStatus()
    }
  }, [tasks, toast])

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">No tasks found for this user story.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={task.is_completed ? "border-green-200 bg-green-50 dark:bg-green-950/20" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {task.is_completed && <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />}
                <div>
                  <CardTitle className="text-base">{task.description}</CardTitle>
                  <CardDescription>
                    {guidanceStatus[task.id] ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                        <Lightbulb className="h-3 w-3" />
                        Guidance available
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1 mt-1">No guidance yet</span>
                    )}
                  </CardDescription>
                </div>
              </div>
              {isLoading[task.id] ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <Button size="sm" variant={guidanceStatus[task.id] ? "default" : "outline"} asChild>
                  <Link
                    href={
                      guidanceStatus[task.id]
                        ? `/guidance/${projectId}/task/${task.id}`
                        : `/guidance/${projectId}/task/${task.id}/generate`
                    }
                  >
                    {guidanceStatus[task.id] ? "View Guidance" : "Generate Guidance"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
