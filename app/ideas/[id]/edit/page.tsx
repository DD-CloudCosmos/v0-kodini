"use client"

import type React from "react"

import { getProject, updateProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = params
  const [title, setTitle] = useState("")
  const [ideaText, setIdeaText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProject(id)
        setTitle(project.title)
        setIdeaText(project.idea_text)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch project details.",
          variant: "destructive",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchProject()
  }, [id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !ideaText) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await updateProject(id, title, ideaText)

      toast({
        title: "Success",
        description: "Your project has been updated.",
      })

      router.push(`/ideas/${id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating the project.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href={`/ideas/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update your project details</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Update the title and description of your project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Task Management App"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idea-text">Project Description</Label>
                <Textarea
                  id="idea-text"
                  placeholder="Describe your software idea in a few sentences..."
                  className="min-h-[150px]"
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href={`/ideas/${id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
