"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Step {
  id: number
  name: string
  href: string
}

const steps: Step[] = [
  { id: 1, name: "Idea", href: "/ideas" },
  { id: 2, name: "Stories", href: "/stories" },
  { id: 3, name: "Tasks", href: "/tasks" },
  { id: 4, name: "Guidance", href: "/guidance" },
]

export function ProgressWizard() {
  const pathname = usePathname()

  // Determine current step based on pathname
  const currentStepIndex = steps.findIndex((step) => pathname.startsWith(step.href))

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => {
          const isActive = pathname.startsWith(step.href)
          const isCompleted = stepIdx < currentStepIndex

          return (
            <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "", "relative")}>
              {isCompleted ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-primary" />
                  </div>
                  <Link
                    href={step.href}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/80"
                  >
                    <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    <span className="sr-only">{step.name}</span>
                  </Link>
                </>
              ) : isActive ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <Link
                    href={step.href}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white dark:bg-gray-900 text-primary"
                    aria-current="step"
                  >
                    <span className="font-medium">{step.id}</span>
                    <span className="sr-only">{step.name}</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <Link
                    href={step.href}
                    className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                      {step.id}
                    </span>
                    <span className="sr-only">{step.name}</span>
                  </Link>
                </>
              )}

              {stepIdx !== steps.length - 1 ? (
                <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-gray-300 dark:text-gray-700"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : null}

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium">
                {step.name}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
