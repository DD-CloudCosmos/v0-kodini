"use server"

import { getTask } from "@/app/actions/tasks"
import { generateGuidanceForTask } from "@/app/actions/guidance"
import { redirect } from "next/navigation"

export async function generateGuidanceAction(formData: FormData) {
  const taskId = formData.get("taskId") as string
  const projectId = formData.get("projectId") as string

  if (!taskId || !projectId) {
    throw new Error("Missing task ID or project ID")
  }

  try {
    const task = await getTask(taskId)
    if (!task) {
      throw new Error("Task not found")
    }

    await generateGuidanceForTask(taskId, task.description)

    redirect(`/guidance/${projectId}/task/${taskId}`)
  } catch (error) {
    console.error("Error generating guidance:", error)
    throw new Error("Failed to generate guidance")
  }
}
