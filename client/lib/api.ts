import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface SectionOutline {
  id: string
  title: string
  format: string
}

export async function generateOutlines(
  theme: string,
  context: string,
  forbiddenWords: string,
  wordCount: number,
): Promise<SectionOutline[]> {
  try {
    const prompt = `
      Create a detailed outline for content about "${theme}".
      
      Additional context:
      ${context}
      
      Forbidden words (do not use these): ${forbiddenWords}
      
      Total word count target: ${wordCount}
      
      Generate 4-6 section outlines in the following JSON format:
      [
        {
          "id": "Section ID (0, 1, 2 etc.)",
          "title": "Section title",
          "format": "Concise description of how the section should be structured, including tone and style guidance."
        }
      ]
      
      Make the sections flow logically and cover the topic comprehensively.
      Only return the JSON array, nothing else.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the JSON response
    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating outlines:", error)
    throw error
  }
}

export async function generateContent(
  theme: string,
  context: string,
  sectionOutline: SectionOutline,
  forbiddenWords: string,
  wordCount: number,
): Promise<string> {
  try {
    const prompt = `
      Write content for a section about "${theme}" with the following specifications:
      
      Section title: ${sectionOutline.title}
      
      Section format: ${sectionOutline.format}
      
      Additional context:
      ${context}
      
      Forbidden words (do not use these): ${forbiddenWords}
      
      Target word count for this section: ${Math.floor(wordCount / 4)} words
      
      Write engaging, well-structured content that follows the format description.
      Focus on creating a compelling narrative that captures the reader's attention.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    return text
  } catch (error) {
    console.error("Error generating content:", error)
    throw error
  }
}

