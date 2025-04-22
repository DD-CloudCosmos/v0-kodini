"use server"

import { generateTasks } from "@/lib/ai-orchestration"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTasksByStory(storyId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("story_id", storyId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching tasks:", error)
    throw new Error("Failed to fetch tasks")
  }

  return data
}

export async function getTasksByProject(projectId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("tasks")
    .select("*, stories!inner(*)")
    .eq("stories.project_id", projectId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching tasks:", error)
    throw new Error("Failed to fetch tasks")
  }

  return data
}

export async function getTask(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching task:", error)
    throw new Error("Failed to fetch task")
  }

  return data
}

export async function createTask(storyId: string, description: string, rationale?: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        story_id: storyId,
        description,
        rationale,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating task:", error)
    throw new Error("Failed to create task")
  }

  revalidatePath(`/tasks`)
  return data[0]
}

export async function updateTask(id: string, description: string, rationale?: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("tasks")
    .update({
      description,
      rationale,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating task:", error)
    throw new Error("Failed to update task")
  }

  revalidatePath(`/tasks`)
  return data[0]
}

export async function deleteTask(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) {
    console.error("Error deleting task:", error)
    throw new Error("Failed to delete task")
  }

  revalidatePath(`/tasks`)
}

export async function toggleTaskCompletion(id: string, isCompleted: boolean) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("tasks")
    .update({
      is_completed: isCompleted,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error toggling task completion:", error)
    throw new Error("Failed to toggle task completion")
  }

  revalidatePath(`/tasks`)
  return data[0]
}

export async function generateAndCreateTasks(
  storyId: string,
  storyTitle: string,
  asA: string,
  iWantTo: string,
  soThat: string,
) {
  try {
    const tasksResponse = await generateTasks(storyTitle, asA, iWantTo, soThat)

    // Create each task in the database
    for (const task of tasksResponse.tasks) {
      await createTask(storyId, task.description, task.rationale)
    }

    return tasksResponse.tasks
  } catch (error) {
    console.error("Error generating and creating tasks:", error)
    throw new Error("Failed to generate and create tasks")
  }
}
