import { getProject } from "@/app/actions/projects"
import { getStoriesByProject } from "@/app/actions/stories"
import { getTasksByStory } from "@/app/actions/tasks"
import { ProgressWizard } from "@/components/progress-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TaskStoryCard } from "./task-story-card"

interface TasksPageProps {
  params: {
    projectId: string
  }
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { projectId } = params

  try {
    const project = await getProject(projectId)
    const stories = await getStoriesByProject(projectId)

    // Fetch tasks for each story
    const storiesWithTasks = await Promise.all(
      stories.map(async (story) => {
        const tasks = await getTasksByStory(story.id)
        return {
          ...story,
          tasks,
        }
      }),
    )

    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex justify-center">
          <ProgressWizard />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Development Tasks</h1>
            <p className="text-muted-foreground">Break down user stories into actionable tasks</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project: {project.title}</CardTitle>
              <CardDescription>
                {stories.length} {stories.length === 1 ? "story" : "stories"} in this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2">{project.idea_text}</p>
            </CardContent>
          </Card>

          {storiesWithTasks.length > 0 ? (
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {storiesWithTasks.map((story) => (
                <TaskStoryCard key={story.id} story={story} projectId={projectId} />
              ))}
            </div>
          ) : (
            <Card className="mb-6">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No user stories found. Create user stories before adding tasks.
                </p>
                <Button asChild>
                  <Link href={`/stories/${projectId}`}>Go to User Stories</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex justify-end">
            <Button asChild>
              <Link href={`/guidance/${projectId}`}>
                Continue to Guidance
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
