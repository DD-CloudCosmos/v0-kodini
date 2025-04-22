import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Kodini</h1>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Structure your software ideas into actionable plans
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Kodini helps novice developers transform ideas into structured development plans with AI-powered guidance.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Discover Ideas</CardTitle>
              <CardDescription>Explore and refine software project ideas</CardDescription>
            </CardHeader>
            <CardContent>Browse curated project ideas or refine your own with AI-powered suggestions.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Create User Stories</CardTitle>
              <CardDescription>Break down ideas into user stories</CardDescription>
            </CardHeader>
            <CardContent>
              Transform your ideas into well-structured user stories following INVEST principles.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guidance</CardTitle>
              <CardDescription>Get step-by-step development instructions</CardDescription>
            </CardHeader>
            <CardContent>Receive detailed guidance on how to implement each task in your development plan.</CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
