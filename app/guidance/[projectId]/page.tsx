import { getProject } from "@/app/actions/projects"
import { getStoriesByProject } from "@/app/actions/stories"
import { getTasksByProject } from "@/app/actions/tasks"
import { ProgressWizard } from "@/components/progress-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TaskGuidanceList } from "./task-guidance-list"

interface GuidancePageProps {
  params: {
    projectId: string
  }
}

export default async function GuidancePage({ params }: GuidancePageProps) {
  const { projectId } = params

  try {
    const project = await getProject(projectId)
    const stories = await getStoriesByProject(projectId)
    const tasks = await getTasksByProject(projectId)

    // Group tasks by story
    const tasksByStory = stories.map((story) => {
      const storyTasks = tasks.filter((task) => task.story_id === story.id)
      return {
        ...story,
        tasks: storyTasks,
      }
    })

    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex justify-center">
          <ProgressWizard />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Implementation Guidance</h1>
            <p className="text-muted-foreground">Step-by-step instructions to implement your tasks</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project: {project.title}</CardTitle>
              <CardDescription>
                {stories.length} {stories.length === 1 ? "story" : "stories"} with {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2">{project.idea_text}</p>
            </CardContent>
          </Card>

          {tasksByStory.length > 0 ? (
            <div className="space-y-8">
              {tasksByStory.map((story) => (
                <div key={story.id}>
                  <h2 className="mb-4 text-xl font-semibold">{story.title}</h2>
                  <TaskGuidanceList tasks={story.tasks} projectId={projectId} story={story} />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No user stories or tasks found. Create user stories and tasks before getting implementation guidance.
                </p>
                <Button asChild>
                  <Link href={`/stories/${projectId}`}>Go to User Stories</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading project data:", error)
    notFound()
  }
}
