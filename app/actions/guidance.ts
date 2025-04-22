"use server"

import { generateGuidance } from "@/lib/ai-orchestration"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Schema for guidance
const guidanceSchema = z.object({
  id: z.string().uuid().optional(),
  task_id: z.string().uuid(),
  steps: z.array(
    z.object({
      step: z.string(),
      rationale: z.string().optional(),
    }),
  ),
  summary: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type Guidance = z.infer<typeof guidanceSchema>

// Get guidance for a task
export async function getGuidanceForTask(taskId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("guidance")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching guidance:", error)
    return null
  }

  return data as Guidance | null
}

// Generate guidance for a task
export async function generateGuidanceForTask(
  taskId: string,
  taskDescription: string,
  projectTitle: string,
  asA: string,
  iWantTo: string,
  soThat: string,
) {
  try {
    const supabase = createServerClient()

    // Generate guidance using AI
    const guidanceData = await generateGuidance(projectTitle, asA, iWantTo, soThat, taskDescription)

    // Save guidance to database
    const { data, error } = await supabase
      .from("guidance")
      .insert({
        task_id: taskId,
        steps: guidanceData.steps,
        summary: guidanceData.summary,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving guidance:", error)
      throw new Error("Failed to save guidance")
    }

    revalidatePath(`/guidance`)
    return data as Guidance
  } catch (error) {
    console.error("Error generating guidance:", error)
    throw new Error("Failed to generate guidance")
  }
}

// Delete guidance
export async function deleteGuidance(guidanceId: string, taskId: string, projectId: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("guidance").delete().eq("id", guidanceId)

    if (error) {
      console.error("Error deleting guidance:", error)
      throw new Error("Failed to delete guidance")
    }

    revalidatePath(`/guidance/${projectId}/task/${taskId}`)
    redirect(`/guidance/${projectId}/task/${taskId}`)
  } catch (error) {
    console.error("Error deleting guidance:", error)
    throw new Error("Failed to delete guidance")
  }
}
