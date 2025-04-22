"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getStoriesByProject(projectId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching stories:", error)
    throw new Error("Failed to fetch stories")
  }

  return data
}

export async function createStory(
  projectId: string,
  title: string,
  asA: string,
  iWantTo: string,
  soThat: string,
  rationale?: string,
) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("stories")
    .insert([
      {
        project_id: projectId,
        title,
        as_a: asA,
        i_want_to: iWantTo,
        so_that: soThat,
        rationale,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating story:", error)
    throw new Error("Failed to create story")
  }

  revalidatePath(`/stories/${projectId}`)
  return data[0]
}

export async function updateStory(
  id: string,
  title: string,
  asA: string,
  iWantTo: string,
  soThat: string,
  rationale?: string,
) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("stories")
    .update({
      title,
      as_a: asA,
      i_want_to: iWantTo,
      so_that: soThat,
      rationale,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating story:", error)
    throw new Error("Failed to update story")
  }

  revalidatePath(`/stories`)
  return data[0]
}

export async function deleteStory(id: string, projectId: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("stories").delete().eq("id", id)

  if (error) {
    console.error("Error deleting story:", error)
    throw new Error("Failed to delete story")
  }

  revalidatePath(`/stories/${projectId}`)
}
