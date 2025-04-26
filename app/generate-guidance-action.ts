"use server"

import { generateGuidanceForTask } from "@/app/actions/guidance"
import { getTask } from "@/app/actions/tasks"
import { getStory } from "@/app/actions/stories"
import { getProject } from "@/app/actions/projects"
import { redirect } from "next/navigation"

export async function generateGuidanceAction(formData: FormData) {
  const taskId = formData.get("taskId") as string
  const projectId = formData.get("projectId") as string
  const storyId = formData.get("storyId") as string

  if (!taskId || !projectId || !storyId) {
    throw new Error("Missing required parameters")
  }

  try {
    const task = await getTask(taskId)
    if (!task) {
      throw new Error("Task not found")
    }

    const story = await getStory(storyId)
    if (!story) {
      throw new Error("Story not found")
    }

    const project = await getProject(projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    await generateGuidanceForTask(taskId, task.description, project.title, story.as_a, story.i_want_to, story.so_that)

    redirect(`/guidance/${projectId}/task/${taskId}`)
  } catch (error) {
    console.error("Error generating guidance:", error)
    throw new Error("Failed to generate guidance")
  }
}
