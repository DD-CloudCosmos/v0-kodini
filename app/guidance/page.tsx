import { ProgressWizard } from "@/components/progress-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, Code, Copy, FileText } from "lucide-react"

export default function GuidancePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex justify-center">
        <ProgressWizard />
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Implementation Guidance</h1>
          <p className="text-muted-foreground">Step-by-step instructions to implement your tasks</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create database schema for tasks</CardTitle>
                <CardDescription>From: Task Creation</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="steps">
              <TabsList className="mb-4">
                <TabsTrigger value="steps">
                  <FileText className="mr-2 h-4 w-4" />
                  Steps
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="mr-2 h-4 w-4" />
                  Code Examples
                </TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">1. Define the task schema</h3>
                  <p className="mb-2">
                    First, you need to define what information your tasks will store. For a basic task management app,
                    you'll want to include:
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>ID (unique identifier)</li>
                    <li>Title (required)</li>
                    <li>Description (optional)</li>
                    <li>Due date (optional)</li>
                    <li>Created date</li>
                    <li>Updated date</li>
                    <li>Completion status</li>
                    <li>User ID (foreign key to users table)</li>
                  </ul>

                  <Collapsible className="mt-2">
                    <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className="mr-1 h-4 w-4" />
                      Why is this important?
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                      <p>
                        A well-designed database schema is the foundation of your application. It determines how data is
                        stored, retrieved, and related. Including fields like created/updated dates helps with auditing
                        and sorting, while the user ID enables multi-user support in the future.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">2. Create the SQL table</h3>
                  <p className="mb-2">
                    Using Supabase, you can create the tasks table through the web interface or using SQL. The SQL
                    approach gives you more control and is better for version control.
                  </p>

                  <Collapsible className="mt-2">
                    <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className="mr-1 h-4 w-4" />
                      Why is this important?
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                      <p>
                        Using SQL to create your tables makes your schema changes reproducible and documentable. This is
                        especially important as your application grows and you need to make changes to the schema.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">3. Set up Row Level Security (RLS)</h3>
                  <p className="mb-2">
                    Implement RLS policies to ensure users can only access their own tasks. This is a critical security
                    feature in Supabase.
                  </p>

                  <Collapsible className="mt-2">
                    <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className="mr-1 h-4 w-4" />
                      Why is this important?
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                      <p>
                        Row Level Security (RLS) is essential for multi-user applications. It ensures that even if
                        there's a bug in your application code, users cannot access data they shouldn't have permission
                        to see. This is enforced at the database level, providing an additional layer of security.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">4. Create TypeScript interfaces</h3>
                  <p className="mb-2">
                    Define TypeScript interfaces that match your database schema to ensure type safety throughout your
                    application.
                  </p>

                  <Collapsible className="mt-2">
                    <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className="mr-1 h-4 w-4" />
                      Why is this important?
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-md bg-muted p-4 text-sm">
                      <p>
                        TypeScript interfaces provide compile-time type checking, which helps catch errors early in the
                        development process. They also serve as documentation for your data structures, making it easier
                        for you to understand the shape of your data as your application grows.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-medium">SQL for creating the tasks table</h3>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    {`CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own tasks
CREATE POLICY "Users can view their own tasks" 
  ON tasks FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own tasks
CREATE POLICY "Users can insert their own tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own tasks
CREATE POLICY "Users can update their own tasks" 
  ON tasks FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own tasks
CREATE POLICY "Users can delete their own tasks" 
  ON tasks FOR DELETE 
  USING (auth.uid() = user_id);`}
                  </pre>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy SQL
                  </Button>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">TypeScript interface for Task</h3>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    {`// types/database.ts
export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_completed: boolean;
  user_id: string;
}

export interface NewTask {
  title: string;
  description?: string | null;
  due_date?: string | null;
  // user_id will be added by the server
}`}
                  </pre>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy TypeScript
                  </Button>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">Supabase client setup</h3>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    {`// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);`}
                  </pre>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy TypeScript
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline">Previous Task</Button>
          <Button>Next Task</Button>
        </div>
      </div>
    </div>
  )
}
