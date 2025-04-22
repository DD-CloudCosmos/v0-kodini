"use client"

import type React from "react"

import { getProject } from "@/app/actions/projects"
import { getStoriesByProject, updateStory } from "@/app/actions/stories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface EditStoryPageProps {
  params: {
    projectId: string
    storyId: string
  }
}

export default function EditStoryPage({ params }: EditStoryPageProps) {
  const { projectId, storyId } = params
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [asA, setAsA] = useState("")
  const [iWantTo, setIWantTo] = useState("")
  const [soThat, setSoThat] = useState("")
  const [rationale, setRationale] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProject(projectId)
        setProject(projectData)

        const stories = await getStoriesByProject(projectId)
        const story = stories.find((s) => s.id === storyId)

        if (!story) {
          toast({
            title: "Error",
            description: "User story not found.",
            variant: "destructive",
          })
          router.push(`/stories/${projectId}`)
          return
        }

        setTitle(story.title)
        setAsA(story.as_a)
        setIWantTo(story.i_want_to)
        setSoThat(story.so_that)
        setRationale(story.rationale || "")
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [projectId, storyId, toast, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !asA || !iWantTo || !soThat) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      await updateStory(storyId, title, asA, iWantTo, soThat, rationale)

      toast({
        title: "Success",
        description: "User story has been updated.",
      })

      router.push(`/stories/${projectId}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href={`/stories/${projectId}`}>Back to User Stories</Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit User Story</h1>
          <p className="text-muted-foreground">Update the details of your user story</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>User Story Details</CardTitle>
              <CardDescription>Follow the "As a [role], I want to [action], so that [benefit]" format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., User Registration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="as-a">As a...</Label>
                <Input
                  id="as-a"
                  placeholder="e.g., new user"
                  value={asA}
                  onChange={(e) => setAsA(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-want-to">I want to...</Label>
                <Input
                  id="i-want-to"
                  placeholder="e.g., create an account with my email and password"
                  value={iWantTo}
                  onChange={(e) => setIWantTo(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="so-that">So that...</Label>
                <Input
                  id="so-that"
                  placeholder="e.g., I can access the application's features"
                  value={soThat}
                  onChange={(e) => setSoThat(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rationale">Why is this important? (Optional)</Label>
                <Textarea
                  id="rationale"
                  placeholder="Explain why this user story is important for the project..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href={`/stories/${projectId}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update User Story"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
