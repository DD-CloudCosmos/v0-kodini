"use client"

import type React from "react"

import { createProject } from "@/app/actions/projects"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewProjectPage() {
  const [title, setTitle] = useState("")
  const [ideaText, setIdeaText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

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
      const project = await createProject(title, ideaText, user.id)

      toast({
        title: "Success",
        description: "Your project has been created.",
      })

      router.push(`/ideas/${project.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the project.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground">Describe your software idea</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Provide a title and description for your software project idea.</CardDescription>
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
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
