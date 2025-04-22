import { getProject } from "@/app/actions/projects"
import { getStoriesByProject } from "@/app/actions/stories"
import { ProgressWizard } from "@/components/progress-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowRight, ChevronDown, Edit, RefreshCw, Trash2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface StoriesPageProps {
  params: {
    projectId: string
  }
}

export default async function StoriesPage({ params }: StoriesPageProps) {
  const { projectId } = params

  try {
    const project = await getProject(projectId)
    const stories = await getStoriesByProject(projectId)

    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex justify-center">
          <ProgressWizard />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">User Stories</h1>
            <p className="text-muted-foreground">Break down your idea into user stories</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project Idea</CardTitle>
              <CardDescription>{project.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{project.idea_text}</p>
            </CardContent>
          </Card>

          <div className="mb-6 flex justify-between">
            <h2 className="text-xl font-semibold">User Stories</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/stories/${projectId}/generate`}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Stories
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {stories && stories.length > 0 ? (
              stories.map((story) => (
                <Card key={story.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{story.title}</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/stories/${projectId}/edit/${story.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <span className="font-medium">As a</span> {story.as_a},{" "}
                      <span className="font-medium">I want to</span> {story.i_want_to},{" "}
                      <span className="font-medium">so that</span> {story.so_that}
                    </p>

                    {story.rationale && (
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                          <ChevronDown className="mr-1 h-4 w-4" />
                          Why is this important?
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                          <p>{story.rationale}</p>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No user stories yet. Generate stories based on your project idea or create them manually.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" asChild>
                      <Link href={`/stories/${projectId}/new`}>Create Manually</Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/stories/${projectId}/generate`}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Generate Stories
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Button asChild>
              <Link href={`/tasks/${projectId}`}>
                Continue to Tasks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading project or stories:", error)
    notFound()
  }
}
