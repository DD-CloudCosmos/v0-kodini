import { getProject } from "@/app/actions/projects"
import { ProgressWizard } from "@/components/progress-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Edit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { IdeaRefinementSection } from "./idea-refinement-section"

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = params

  try {
    const project = await getProject(id)

    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex justify-center">
          <ProgressWizard />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Project Idea</h1>
            <p className="text-muted-foreground">Refine your idea or explore variations</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>Created on {new Date(project.created_at).toLocaleDateString()}</CardDescription>
              </div>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/ideas/${id}/edit`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit project</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{project.idea_text}</p>
            </CardContent>
          </Card>

          <IdeaRefinementSection projectId={id} ideaText={project.idea_text} />

          <div className="mt-8 flex justify-end">
            <Button asChild>
              <Link href={`/stories/${id}`}>
                Continue to User Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading project:", error)
    notFound()
  }
}
