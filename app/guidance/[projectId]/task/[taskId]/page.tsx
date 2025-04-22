import { getGuidanceForTask } from "@/app/actions/guidance"
import { getTask } from "@/app/actions/tasks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, RefreshCw } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface TaskGuidancePageProps {
  params: {
    projectId: string
    taskId: string
  }
}

export default async function TaskGuidancePage({ params }: TaskGuidancePageProps) {
  const { projectId, taskId } = params

  const task = await getTask(taskId)
  if (!task) {
    notFound()
  }

  const guidance = await getGuidanceForTask(taskId)

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center">
          <Button asChild variant="ghost" size="sm" className="mr-4">
            <Link href={`/guidance/${projectId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guidance
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Implementation Guidance</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{task.description}</CardTitle>
            {task.rationale && <CardDescription>{task.rationale}</CardDescription>}
          </CardHeader>
        </Card>

        {guidance ? (
          <div className="space-y-6">
            {guidance.summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{guidance.summary}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {guidance.steps.map((step, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="mb-2 font-medium">
                        Step {index + 1}: {step.step}
                      </h3>
                      {step.rationale && (
                        <div className="mt-2 rounded-md bg-muted p-3">
                          <h4 className="mb-1 text-sm font-medium">Why?</h4>
                          <p className="text-sm text-muted-foreground">{step.rationale}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <Link href={`/guidance/${projectId}/task/${taskId}/generate`}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Guidance
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Guidance Available</CardTitle>
              <CardDescription>
                Generate implementation guidance to get step-by-step instructions for this task.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="mb-6 text-center text-muted-foreground">
                AI-powered guidance will help you understand how to implement this task with detailed steps and
                explanations.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/guidance/${projectId}/task/${taskId}/generate`}>Generate Implementation Guidance</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
