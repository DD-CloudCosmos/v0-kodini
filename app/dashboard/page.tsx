import { getProjects } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/ideas/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>Created on {new Date(project.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{project.idea_text}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/ideas/${project.id}`}>Continue</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Kodini!</CardTitle>
                <CardDescription>Get started by creating your first project</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Kodini helps you structure your software ideas into actionable plans. Start by creating a new project
                  and follow the guided workflow.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/ideas/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Project
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
