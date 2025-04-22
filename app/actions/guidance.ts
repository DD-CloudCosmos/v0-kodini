"use server"

import { generateGuidance } from "@/lib/ai-orchestration"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getGuidanceByTask(taskId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("guidance").select("*").eq("task_id", taskId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for "no rows returned"
    console.error("Error fetching guidance:", error)
    throw new Error("Failed to fetch guidance")
  }

  return data
}

export async function createGuidance(taskId: string, steps: any[], codeExamples?: any[], summary?: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("guidance")
    .insert([
      {
        task_id: taskId,
        steps,
        code_examples: codeExamples || null,
        summary: summary || null,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating guidance:", error)
    throw new Error("Failed to create guidance")
  }

  revalidatePath(`/guidance`)
  return data[0]
}

export async function updateGuidance(id: string, steps: any[], codeExamples?: any[], summary?: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("guidance")
    .update({
      steps,
      code_examples: codeExamples || null,
      summary: summary || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating guidance:", error)
    throw new Error("Failed to update guidance")
  }

  revalidatePath(`/guidance`)
  return data[0]
}

export async function deleteGuidance(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("guidance").delete().eq("id", id)

  if (error) {
    console.error("Error deleting guidance:", error)
    throw new Error("Failed to delete guidance")
  }

  revalidatePath(`/guidance`)
}

export async function generateAndCreateGuidance(
  taskId: string,
  projectTitle: string,
  asA: string,
  iWantTo: string,
  soThat: string,
  taskDescription: string,
) {
  try {
    const guidanceResponse = await generateGuidance(projectTitle, asA, iWantTo, soThat, taskDescription)

    // Create the guidance in the database
    const guidance = await createGuidance(
      taskId,
      guidanceResponse.steps,
      guidanceResponse.codeExamples,
      guidanceResponse.summary,
    )

    return guidance
  } catch (error) {
    console.error("Error generating and creating guidance:", error)
    throw new Error("Failed to generate and create guidance")
  }
}
