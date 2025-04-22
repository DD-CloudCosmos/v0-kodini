import { ProgressWizard } from "@/components/progress-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowRight, ChevronDown, Edit, RefreshCw, Trash2 } from "lucide-react"
import Link from "next/link"

export default function StoriesPage() {
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
            <CardDescription>Task Management App</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              A simple task management application with categories, priorities, and due dates. Users can create, edit,
              and delete tasks, as well as mark them as complete.
            </p>
          </CardContent>
        </Card>

        <div className="mb-6 flex justify-between">
          <h2 className="text-xl font-semibold">Generated User Stories</h2>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Stories
          </Button>
        </div>

        <div className="space-y-4">
          {userStories.map((story) => (
            <Card key={story.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <span className="font-medium">As a</span> {story.asA}, <span className="font-medium">I want to</span>{" "}
                  {story.iWantTo}, <span className="font-medium">so that</span> {story.soThat}
                </p>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ChevronDown className="mr-1 h-4 w-4" />
                    Why is this important?
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                    <p>{story.rationale}</p>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button asChild>
            <Link href="/tasks">
              Continue to Tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mock data - would come from Supabase in the real app
const userStories = [
  {
    id: "1",
    title: "Task Creation",
    asA: "user",
    iWantTo: "create new tasks with a title, description, and due date",
    soThat: "I can keep track of what I need to do",
    rationale:
      "This is a core functionality that allows users to add items to their task list. Including details like description and due date helps users organize and prioritize their work effectively.",
  },
  {
    id: "2",
    title: "Task Categories",
    asA: "user",
    iWantTo: "categorize my tasks into different groups",
    soThat: "I can organize them by project or area of responsibility",
    rationale:
      "Categories help users organize related tasks together, making it easier to focus on specific areas of work or life. This improves the user experience by reducing cognitive load when managing many tasks.",
  },
  {
    id: "3",
    title: "Task Completion",
    asA: "user",
    iWantTo: "mark tasks as complete",
    soThat: "I can track my progress and focus on remaining work",
    rationale:
      "Completing tasks is satisfying and motivating for users. This feature provides visual feedback on progress and helps users maintain focus on uncompleted items.",
  },
  {
    id: "4",
    title: "Task Editing",
    asA: "user",
    iWantTo: "edit the details of existing tasks",
    soThat: "I can update information as circumstances change",
    rationale:
      "Requirements and details often change over time. Allowing users to edit tasks ensures the information stays relevant and accurate without having to delete and recreate tasks.",
  },
]
