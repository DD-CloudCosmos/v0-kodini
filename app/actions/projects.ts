"use server"

import { refineIdea, suggestVariations, type RefinedIdeasResponse } from "@/lib/ai-orchestration"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProjects() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error fetching projects:", error)
      throw new Error(`Failed to fetch projects: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in getProjects:", error)
    // Return empty array instead of throwing to prevent page from crashing
    return []
  }
}

export async function getProject(id: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      throw new Error(`Failed to fetch project: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error in getProject:", error)
    throw new Error(`Failed to fetch project: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function createProject(title: string, ideaText: string, userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title,
          idea_text: ideaText,
          user_id: userId,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating project:", error)
      throw new Error(`Failed to create project: ${error.message}`)
    }

    revalidatePath("/dashboard")
    return data[0]
  } catch (error) {
    console.error("Error in createProject:", error)
    throw new Error(`Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function updateProject(id: string, title: string, ideaText: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("projects")
      .update({
        title,
        idea_text: ideaText,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating project:", error)
      throw new Error(`Failed to update project: ${error.message}`)
    }

    revalidatePath(`/ideas/${id}`)
    revalidatePath("/dashboard")
    return data[0]
  } catch (error) {
    console.error("Error in updateProject:", error)
    throw new Error(`Failed to update project: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      throw new Error(`Failed to delete project: ${error.message}`)
    }

    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error in deleteProject:", error)
    throw new Error(`Failed to delete project: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function refineProjectIdea(ideaText: string): Promise<RefinedIdeasResponse> {
  try {
    return await refineIdea(ideaText)
  } catch (error) {
    console.error("Error in refineProjectIdea:", error)
    throw new Error(`Failed to refine idea: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function suggestProjectVariations(ideaText: string): Promise<RefinedIdeasResponse> {
  try {
    return await suggestVariations(ideaText)
  } catch (error) {
    console.error("Error in suggestProjectVariations:", error)
    throw new Error(`Failed to suggest variations: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
