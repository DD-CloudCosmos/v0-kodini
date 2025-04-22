import { ProgressWizard } from "@/components/progress-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
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

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {userStories.map((story) => (
            <TaskStoryCard key={story.id} story={story} />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button asChild>
            <Link href="/guidance">
              Continue to Guidance
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function TaskStoryCard({ story }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{story.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          As a {story.asA}, I want to {story.iWantTo}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {story.tasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-2">
              <Checkbox id={`task-${task.id}`} />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`task-${task.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {task.description}
                </label>
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" size="sm" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate Tasks
        </Button>
      </CardContent>
    </Card>
  )
}

// Mock data - would come from Supabase in the real app
const userStories = [
  {
    id: "1",
    title: "Task Creation",
    asA: "user",
    iWantTo: "create new tasks with a title, description, and due date",
    tasks: [
      {
        id: "1-1",
        description: "Create database schema for tasks with title, description, due date fields",
      },
      {
        id: "1-2",
        description: "Design and implement task creation form UI",
      },
      {
        id: "1-3",
        description: "Implement form validation for required fields",
      },
      {
        id: "1-4",
        description: "Create API endpoint for saving new tasks",
      },
    ],
  },
  {
    id: "2",
    title: "Task Categories",
    asA: "user",
    iWantTo: "categorize my tasks into different groups",
    tasks: [
      {
        id: "2-1",
        description: "Create database schema for categories",
      },
      {
        id: "2-2",
        description: "Add category selection dropdown to task form",
      },
      {
        id: "2-3",
        description: "Implement category management UI",
      },
      {
        id: "2-4",
        description: "Add filtering by category in task list view",
      },
    ],
  },
  {
    id: "3",
    title: "Task Completion",
    asA: "user",
    iWantTo: "mark tasks as complete",
    tasks: [
      {
        id: "3-1",
        description: "Add completion status field to task schema",
      },
      {
        id: "3-2",
        description: "Implement checkbox UI for marking tasks complete",
      },
      {
        id: "3-3",
        description: "Create API endpoint for updating task status",
      },
      {
        id: "3-4",
        description: "Add visual indication for completed tasks",
      },
    ],
  },
  {
    id: "4",
    title: "Task Editing",
    asA: "user",
    iWantTo: "edit the details of existing tasks",
    tasks: [
      {
        id: "4-1",
        description: "Design and implement task edit form UI",
      },
      {
        id: "4-2",
        description: "Create API endpoint for updating task details",
      },
      {
        id: "4-3",
        description: "Add edit button to task list items",
      },
      {
        id: "4-4",
        description: "Implement form validation for edit form",
      },
    ],
  },
]
