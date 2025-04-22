export interface Project {
  id: string
  user_id: string
  idea_text: string
  title: string
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  project_id: string
  title: string
  as_a: string
  i_want_to: string
  so_that: string
  rationale?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  story_id: string
  description: string
  rationale?: string
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface Guidance {
  id: string
  task_id: string
  steps: GuidanceStep[]
  code_examples?: CodeExample[]
  summary?: string
  created_at: string
  updated_at: string
}

export interface GuidanceStep {
  step: string
  rationale: string
}

export interface CodeExample {
  title: string
  language: string
  code: string
  explanation?: string
}
