import { createAzure } from "@ai-sdk/azure"

// Create Azure OpenAI client with environment variables
export const azure = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview",
})
