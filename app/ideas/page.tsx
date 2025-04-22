import { getProjects } from "@/app/actions/projects"
import { ProgressWizard } from "@/components/progress-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, PlusCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function IdeasPage() {
  // Fetch user's projects
  const projects = await getProjects()

  // If the user has projects, redirect to the first project
  if (projects && projects.length > 0) {
    redirect(`/ideas/${projects[0].id}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex justify-center">
        <ProgressWizard />
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Discover Ideas</h1>
          <p className="text-muted-foreground">Find inspiration or create your own idea</p>
        </div>

        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="explore">Explore Ideas</TabsTrigger>
            <TabsTrigger value="my-idea">My Own Idea</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {sampleIdeas.map((idea) => (
                <Card key={idea.id}>
                  <CardHeader>
                    <CardTitle>{idea.title}</CardTitle>
                    <CardDescription>
                      {idea.tags.map((tag) => (
                        <span
                          key={tag}
                          className="mr-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3">{idea.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Variations
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/ideas/new?template=true&id={idea.id}">
                        Select
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-idea" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Own Idea</CardTitle>
                <CardDescription>Start with a blank project or use a template</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="mb-6 text-muted-foreground">
                  Create a new project to describe your software idea and get AI-powered refinements.
                </p>
                <Button asChild>
                  <Link href="/ideas/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Mock data - would come from Supabase in the real app
const sampleIdeas = [
  {
    id: "1",
    title: "Task Management App",
    description:
      "A simple task management application with categories, priorities, and due dates. Users can create, edit, and delete tasks, as well as mark them as complete.",
    tags: ["Productivity", "Beginner"],
  },
  {
    id: "2",
    title: "Recipe Sharing Platform",
    description:
      "A platform for users to share and discover recipes. Features include recipe uploads, ratings, comments, and the ability to save favorites.",
    tags: ["Social", "Intermediate"],
  },
  {
    id: "3",
    title: "Personal Finance Tracker",
    description:
      "An application to help users track their income, expenses, and savings goals. Includes visualizations of spending patterns and budget planning tools.",
    tags: ["Finance", "Intermediate"],
  },
  {
    id: "4",
    title: "Learning Management System",
    description:
      "A platform for creating and managing online courses. Features include content creation, student enrollment, progress tracking, and assessments.",
    tags: ["Education", "Advanced"],
  },
]
