"use client"

import { getProject } from "@/app/actions/projects"
import { getStoriesByProject } from "@/app/actions/stories"
import { getTasksByStory } from "@/app/actions/tasks"
import { getGuidanceByTask } from "@/app/actions/guidance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown, ChevronLeft, Code, Copy, FileText, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface GuidanceViewPageProps {
  params: {
    projectId: string
    taskId: string
  }
}

export default function GuidanceViewPage({ params }: GuidanceViewPageProps) {
  const { projectId, taskId } = params
  const [project, setProject] = useState<any>(null)
  const [story, setStory] = useState<any>(null)
  const [task, setTask] = useState<any>(null)
  const [guidance, setGuidance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
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

        // Fetch guidance
        const guidanceData = await getGuidanceByTask(taskId)
        if (!guidanceData) {
          router.push(`/guidance/${projectId}/task/${taskId}/generate`)
          return
        }

        setGuidance(guidanceData)
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

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)

    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedIndex(null)
    }, 2000)
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href={`/guidance/${projectId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Guidance
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{task.description}</CardTitle>
                <CardDescription>From: {story.title}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/guidance/${projectId}/task/${taskId}/generate`}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="steps">
              <TabsList className="mb-4">
                <TabsTrigger value="steps">
                  <FileText className="mr-2 h-4 w-4" />
                  Steps
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="mr-2 h-4 w-4" />
                  Code Examples
                </TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="space-y-4">
                {guidance.steps.map((step: any, index: number) => (
                  <div key={index}>
                    <h3 className="mb-2 text-lg font-medium">
                      {index + 1}. {step.step}
                    </h3>

                    <Collapsible className="mt-2">
                      <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="mr-1 h-4 w-4" />
                        Why is this important?
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                        <p>{step.rationale}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}

                {guidance.summary && (
                  <div className="mt-6 rounded-md bg-slate-50 p-4 dark:bg-slate-900">
                    <h3 className="mb-2 font-medium">Summary</h3>
                    <p className="text-sm">{guidance.summary}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="code" className="space-y-6">
                {guidance.code_examples?.map((example: any, index: number) => (
                  <div key={index}>
                    <h3 className="mb-2 text-lg font-medium">{example.title}</h3>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                        <code>{example.code}</code>
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => handleCopyCode(example.code, index)}
                      >
                        {copiedIndex === index ? "Copied!" : "Copy"}
                        <Copy className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    {example.explanation && <p className="mt-2 text-sm text-muted-foreground">{example.explanation}</p>}
                  </div>
                ))}

                {(!guidance.code_examples || guidance.code_examples.length === 0) && (
                  <div className="rounded-md bg-muted p-6 text-center">
                    <p className="text-muted-foreground">No code examples available for this task.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline">Previous Task</Button>
          <Button>Next Task</Button>
        </div>
      </div>
    </div>
  )
}
