"use server"

import { generateText } from "ai"
import { azure } from "@/lib/azure-openai"
import { z } from "zod"

// Schema for refined ideas
export const RefinedIdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
})

export type RefinedIdea = z.infer<typeof RefinedIdeaSchema>

export const RefinedIdeasResponseSchema = z.object({
  ideas: z.array(RefinedIdeaSchema),
})

export type RefinedIdeasResponse = z.infer<typeof RefinedIdeasResponseSchema>

// Schema for tasks
export const TaskSchema = z.object({
  description: z.string(),
  rationale: z.string().optional(),
})

export type TaskType = z.infer<typeof TaskSchema>

export const TasksResponseSchema = z.object({
  tasks: z.array(TaskSchema),
})

export type TasksResponse = z.infer<typeof TasksResponseSchema>

// Schema for guidance steps
export const GuidanceStepSchema = z.object({
  step: z.string(),
  rationale: z.string(),
})

export type GuidanceStep = z.infer<typeof GuidanceStepSchema>

// Schema for code examples
export const CodeExampleSchema = z.object({
  title: z.string(),
  language: z.string(),
  code: z.string(),
  explanation: z.string().optional(),
})

export type CodeExample = z.infer<typeof CodeExampleSchema>

// Schema for guidance response
export const GuidanceResponseSchema = z.object({
  steps: z.array(GuidanceStepSchema),
  codeExamples: z.array(CodeExampleSchema).optional(),
  summary: z.string().optional(),
})

export type GuidanceResponse = z.infer<typeof GuidanceResponseSchema>

// Prompt templates
const REFINE_IDEA_PROMPT = `
You are an expert software development advisor helping a novice developer refine their project idea.

Original idea:
"""
{ideaText}
"""

Please generate 3 refined versions of this idea that are more specific, focused, and implementable.
For each refined idea, provide:
1. A concise title (max 5 words)
2. A detailed description (2-3 sentences)
3. 2-3 relevant tags (e.g., "Beginner", "Web", "Mobile", "API", "Database", etc.)

Format your response as valid JSON with the following structure:
{
"ideas": [
  {
    "title": "string",
    "description": "string",
    "tags": ["string", "string"]
  },
  ...
]
}
`

const SUGGEST_VARIATIONS_PROMPT = `
You are an expert software development advisor helping a novice developer explore variations of their project idea.

Original idea:
"""
{ideaText}
"""

Please generate 3 creative variations of this idea that explore different approaches, features, or target audiences.
For each variation, provide:
1. A concise title (max 5 words)
2. A detailed description (2-3 sentences)
3. 2-3 relevant tags (e.g., "Beginner", "Web", "Mobile", "API", "Database", etc.)

Format your response as valid JSON with the following structure:
{
"ideas": [
  {
    "title": "string",
    "description": "string",
    "tags": ["string", "string"]
  },
  ...
]
}
`

const GENERATE_TASKS_PROMPT = `
You are an expert software development advisor helping a novice developer break down a user story into specific development tasks.

User Story:
Title: {storyTitle}
As a {asA}, I want to {iWantTo}, so that {soThat}

Please generate 4-6 specific, actionable development tasks that would be needed to implement this user story.
Each task should be concrete enough that a developer would know exactly what to build.

For each task, provide:
1. A clear, specific description of what needs to be done
2. A brief rationale explaining why this task is necessary (optional)

Format your response as valid JSON with the following structure:
{
"tasks": [
  {
    "description": "string",
    "rationale": "string"
  },
  ...
]
}

Ensure the tasks cover both frontend and backend aspects where applicable, and follow a logical sequence.
`

const GENERATE_GUIDANCE_PROMPT = `
You are an expert software development advisor helping a novice developer implement a specific task in their project.

Project Context:
Project: {projectTitle}
User Story: As a {asA}, I want to {iWantTo}, so that {soThat}

Task to implement:
"""
{taskDescription}
"""

Please provide detailed step-by-step guidance on how to implement this task. For each step:
1. Provide a clear instruction on what to do
2. Include a rationale explaining why this step is important or how it contributes to the overall task

Additionally, provide 1-3 code examples that demonstrate key aspects of the implementation. Each example should include:
1. A title describing what the code does
2. The programming language
3. The code snippet itself
4. A brief explanation of how the code works (optional)

Format your response as valid JSON with the following structure:
{
"steps": [
  {
    "step": "string",
    "rationale": "string"
  },
  ...
],
"codeExamples": [
  {
    "title": "string",
    "language": "string",
    "code": "string",
    "explanation": "string"
  },
  ...
],
"summary": "string"
}

Focus on providing educational guidance that helps the developer learn while implementing. Avoid providing complete solutions that the developer can copy-paste without understanding.
`

export async function refineIdea(ideaText: string): Promise<RefinedIdeasResponse> {
  try {
    const prompt = REFINE_IDEA_PROMPT.replace("{ideaText}", ideaText)

    const { text } = await generateText({
      model: azure("kodini-dev-gpt-35-turbo"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse and validate the response
    const jsonResponse = JSON.parse(text)
    const validatedResponse = RefinedIdeasResponseSchema.parse(jsonResponse)

    return validatedResponse
  } catch (error) {
    console.error("Error refining idea:", error)
    throw new Error("Failed to refine idea. Please try again.")
  }
}

export async function suggestVariations(ideaText: string): Promise<RefinedIdeasResponse> {
  try {
    const prompt = SUGGEST_VARIATIONS_PROMPT.replace("{ideaText}", ideaText)

    const { text } = await generateText({
      model: azure("kodini-dev-gpt-35-turbo"),
      prompt: prompt,
      temperature: 0.8,
      maxTokens: 1000,
    })

    // Parse and validate the response
    const jsonResponse = JSON.parse(text)
    const validatedResponse = RefinedIdeasResponseSchema.parse(jsonResponse)

    return validatedResponse
  } catch (error) {
    console.error("Error suggesting variations:", error)
    throw new Error("Failed to suggest variations. Please try again.")
  }
}

export async function generateTasks(
  storyTitle: string,
  asA: string,
  iWantTo: string,
  soThat: string,
): Promise<TasksResponse> {
  try {
    const prompt = GENERATE_TASKS_PROMPT.replace("{storyTitle}", storyTitle)
      .replace("{asA}", asA)
      .replace("{iWantTo}", iWantTo)
      .replace("{soThat}", soThat)

    const { text } = await generateText({
      model: azure("kodini-dev-gpt-35-turbo"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse and validate the response
    const jsonResponse = JSON.parse(text)
    const validatedResponse = TasksResponseSchema.parse(jsonResponse)

    return validatedResponse
  } catch (error) {
    console.error("Error generating tasks:", error)
    throw new Error("Failed to generate tasks. Please try again.")
  }
}

export async function generateGuidance(
  projectTitle: string,
  asA: string,
  iWantTo: string,
  soThat: string,
  taskDescription: string,
): Promise<GuidanceResponse> {
  try {
    const prompt = GENERATE_GUIDANCE_PROMPT.replace("{projectTitle}", projectTitle)
      .replace("{asA}", asA)
      .replace("{iWantTo}", iWantTo)
      .replace("{soThat}", soThat)
      .replace("{taskDescription}", taskDescription)

    const { text } = await generateText({
      model: azure("kodini-dev-gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 2500,
    })

    // Parse and validate the response
    const jsonResponse = JSON.parse(text)
    const validatedResponse = GuidanceResponseSchema.parse(jsonResponse)

    return validatedResponse
  } catch (error) {
    console.error("Error generating guidance:", error)
    throw new Error("Failed to generate guidance. Please try again.")
  }
}
